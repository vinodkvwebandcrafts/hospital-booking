import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications.service';
import { PushNotificationService } from '../push/push-notification.service';
import { EmailService } from '../email/email.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let mockPush: Record<string, jest.Mock>;
  let mockEmail: Record<string, jest.Mock>;

  const mockPatient = {
    id: 'patient-uuid-1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    expoPushToken: 'ExponentPushToken[abc123]',
  };

  const mockDoctorUser = {
    id: 'user-uuid-doctor',
    firstName: 'James',
    lastName: 'Smith',
    email: 'dr.smith@hospital.com',
    expoPushToken: 'ExponentPushToken[xyz789]',
  };

  const mockAppointment = {
    id: 'appt-uuid-1',
    appointmentDateTime: new Date('2026-03-25T10:00:00.000Z'),
    consultationType: 'IN_PERSON',
    patient: mockPatient,
    doctor: {
      id: 'doctor-uuid-1',
      user: mockDoctorUser,
    },
  };

  beforeEach(async () => {
    mockPush = {
      sendPushNotification: jest.fn().mockResolvedValue(undefined),
    };

    mockEmail = {
      sendBookingConfirmation: jest.fn().mockResolvedValue(undefined),
      sendCancellationNotification: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PushNotificationService, useValue: mockPush },
        { provide: EmailService, useValue: mockEmail },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------- handleAppointmentCreated ----------
  describe('handleAppointmentCreated', () => {
    it('should send push notification and email to patient', async () => {
      await service.handleAppointmentCreated({ appointment: mockAppointment as any });

      expect(mockPush.sendPushNotification).toHaveBeenCalledWith(
        mockPatient.expoPushToken,
        'Appointment Booked',
        expect.stringContaining('Dr. James Smith'),
        expect.objectContaining({
          type: 'APPOINTMENT_BOOKED',
          appointmentId: 'appt-uuid-1',
        }),
      );

      expect(mockEmail.sendBookingConfirmation).toHaveBeenCalledWith(
        'jane@example.com',
        'Jane Doe',
        'Dr. James Smith',
        expect.any(String),
        'IN_PERSON',
      );
    });

    it('should send push notification to doctor', async () => {
      await service.handleAppointmentCreated({ appointment: mockAppointment as any });

      expect(mockPush.sendPushNotification).toHaveBeenCalledWith(
        mockDoctorUser.expoPushToken,
        'New Appointment',
        expect.stringContaining('Jane Doe'),
        expect.objectContaining({
          type: 'APPOINTMENT_BOOKED',
          appointmentId: 'appt-uuid-1',
        }),
      );
    });

    it('should not send push to patient when push token is missing', async () => {
      const appointmentNoPush = {
        ...mockAppointment,
        patient: { ...mockPatient, expoPushToken: null },
      };

      await service.handleAppointmentCreated({
        appointment: appointmentNoPush as any,
      });

      // Should not send push to patient (no token), but still send email
      expect(mockPush.sendPushNotification).toHaveBeenCalledTimes(1);
      expect(mockPush.sendPushNotification).toHaveBeenCalledWith(
        mockDoctorUser.expoPushToken,
        expect.any(String),
        expect.any(String),
        expect.any(Object),
      );
      expect(mockEmail.sendBookingConfirmation).toHaveBeenCalled();
    });

    it('should not send email when patient email is missing', async () => {
      const appointmentNoEmail = {
        ...mockAppointment,
        patient: { ...mockPatient, email: null },
      };

      await service.handleAppointmentCreated({
        appointment: appointmentNoEmail as any,
      });

      expect(mockEmail.sendBookingConfirmation).not.toHaveBeenCalled();
    });

    it('should return early when patient data is missing', async () => {
      await service.handleAppointmentCreated({
        appointment: { ...mockAppointment, patient: null } as any,
      });

      expect(mockPush.sendPushNotification).not.toHaveBeenCalled();
      expect(mockEmail.sendBookingConfirmation).not.toHaveBeenCalled();
    });

    it('should return early when doctor user data is missing', async () => {
      await service.handleAppointmentCreated({
        appointment: {
          ...mockAppointment,
          doctor: { id: 'doctor-1', user: null },
        } as any,
      });

      expect(mockPush.sendPushNotification).not.toHaveBeenCalled();
      expect(mockEmail.sendBookingConfirmation).not.toHaveBeenCalled();
    });

    it('should not send push to doctor when doctor has no push token', async () => {
      const appointmentDoctorNoPush = {
        ...mockAppointment,
        doctor: {
          id: 'doctor-uuid-1',
          user: { ...mockDoctorUser, expoPushToken: null },
        },
      };

      await service.handleAppointmentCreated({
        appointment: appointmentDoctorNoPush as any,
      });

      // Patient gets push + doctor does not
      expect(mockPush.sendPushNotification).toHaveBeenCalledTimes(1);
      expect(mockPush.sendPushNotification).toHaveBeenCalledWith(
        mockPatient.expoPushToken,
        expect.any(String),
        expect.any(String),
        expect.any(Object),
      );
    });
  });

  // ---------- handleAppointmentCancelled ----------
  describe('handleAppointmentCancelled', () => {
    it('should send cancellation push and email to patient', async () => {
      await service.handleAppointmentCancelled({ appointment: mockAppointment as any });

      expect(mockPush.sendPushNotification).toHaveBeenCalledWith(
        mockPatient.expoPushToken,
        'Appointment Cancelled',
        expect.stringContaining('Dr. James Smith'),
        expect.objectContaining({
          type: 'APPOINTMENT_CANCELLED',
          appointmentId: 'appt-uuid-1',
        }),
      );

      expect(mockEmail.sendCancellationNotification).toHaveBeenCalledWith(
        'jane@example.com',
        'Jane Doe',
        'Dr. James Smith',
        expect.any(String),
      );
    });

    it('should send cancellation push to doctor', async () => {
      await service.handleAppointmentCancelled({ appointment: mockAppointment as any });

      expect(mockPush.sendPushNotification).toHaveBeenCalledWith(
        mockDoctorUser.expoPushToken,
        'Appointment Cancelled',
        expect.stringContaining("Jane Doe's appointment"),
        expect.objectContaining({ type: 'APPOINTMENT_CANCELLED' }),
      );
    });

    it('should return early when patient or doctor data is missing', async () => {
      await service.handleAppointmentCancelled({
        appointment: { ...mockAppointment, patient: null } as any,
      });

      expect(mockPush.sendPushNotification).not.toHaveBeenCalled();
      expect(mockEmail.sendCancellationNotification).not.toHaveBeenCalled();
    });

    it('should not send push to patient without push token', async () => {
      const appointment = {
        ...mockAppointment,
        patient: { ...mockPatient, expoPushToken: null },
      };

      await service.handleAppointmentCancelled({ appointment: appointment as any });

      // Only doctor gets push
      expect(mockPush.sendPushNotification).toHaveBeenCalledTimes(1);
      expect(mockPush.sendPushNotification).toHaveBeenCalledWith(
        mockDoctorUser.expoPushToken,
        expect.any(String),
        expect.any(String),
        expect.any(Object),
      );
    });
  });

  // ---------- handleAppointmentCompleted ----------
  describe('handleAppointmentCompleted', () => {
    it('should send completion push to patient', async () => {
      await service.handleAppointmentCompleted({ appointment: mockAppointment as any });

      expect(mockPush.sendPushNotification).toHaveBeenCalledWith(
        mockPatient.expoPushToken,
        'Appointment Completed',
        expect.stringContaining('completed'),
        expect.objectContaining({
          type: 'APPOINTMENT_COMPLETED',
          appointmentId: 'appt-uuid-1',
        }),
      );
    });

    it('should not send push when patient has no push token', async () => {
      const appointment = {
        ...mockAppointment,
        patient: { ...mockPatient, expoPushToken: null },
      };

      await service.handleAppointmentCompleted({ appointment: appointment as any });

      expect(mockPush.sendPushNotification).not.toHaveBeenCalled();
    });

    it('should return early when patient is missing', async () => {
      await service.handleAppointmentCompleted({
        appointment: { ...mockAppointment, patient: null } as any,
      });

      expect(mockPush.sendPushNotification).not.toHaveBeenCalled();
    });
  });

  // ---------- handleMedicalRecordCreated ----------
  describe('handleMedicalRecordCreated', () => {
    it('should handle medical-record.created event without error', async () => {
      // This handler currently only logs, so we just verify no exception
      await expect(
        service.handleMedicalRecordCreated({
          record: { id: 'rec-1' },
          patientId: 'patient-uuid-1',
        }),
      ).resolves.not.toThrow();
    });
  });
});
