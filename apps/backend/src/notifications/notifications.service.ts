import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PushNotificationService } from './push/push-notification.service';
import { EmailService } from './email/email.service';
import { AppointmentEntity } from '../appointments/entities/appointment.entity';

interface AppointmentEvent {
  appointment: AppointmentEntity;
}

interface MedicalRecordEvent {
  record: any;
  patientId: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly pushNotificationService: PushNotificationService,
    private readonly emailService: EmailService,
  ) {}

  @OnEvent('appointment.created')
  async handleAppointmentCreated(event: AppointmentEvent): Promise<void> {
    const { appointment } = event;
    this.logger.log(`Handling appointment.created for ${appointment.id}`);

    const patient = appointment.patient;
    const doctorUser = appointment.doctor?.user;

    if (!patient || !doctorUser) {
      this.logger.warn('Missing patient or doctor data in appointment event');
      return;
    }

    const doctorName = `Dr. ${doctorUser.firstName} ${doctorUser.lastName}`;
    const patientName = `${patient.firstName} ${patient.lastName}`;
    const dateTime = new Date(appointment.appointmentDateTime).toLocaleString();

    if (patient.expoPushToken) {
      await this.pushNotificationService.sendPushNotification(
        patient.expoPushToken,
        'Appointment Booked',
        `Your appointment with ${doctorName} on ${dateTime} has been confirmed.`,
        {
          type: 'APPOINTMENT_BOOKED',
          appointmentId: appointment.id,
        },
      );
    }

    if (patient.email) {
      await this.emailService.sendBookingConfirmation(
        patient.email,
        patientName,
        doctorName,
        dateTime,
        appointment.consultationType,
      );
    }

    if (doctorUser.expoPushToken) {
      await this.pushNotificationService.sendPushNotification(
        doctorUser.expoPushToken,
        'New Appointment',
        `${patientName} has booked an appointment on ${dateTime}.`,
        {
          type: 'APPOINTMENT_BOOKED',
          appointmentId: appointment.id,
        },
      );
    }
  }

  @OnEvent('appointment.cancelled')
  async handleAppointmentCancelled(event: AppointmentEvent): Promise<void> {
    const { appointment } = event;
    this.logger.log(`Handling appointment.cancelled for ${appointment.id}`);

    const patient = appointment.patient;
    const doctorUser = appointment.doctor?.user;

    if (!patient || !doctorUser) return;

    const doctorName = `Dr. ${doctorUser.firstName} ${doctorUser.lastName}`;
    const patientName = `${patient.firstName} ${patient.lastName}`;
    const dateTime = new Date(appointment.appointmentDateTime).toLocaleString();

    if (patient.expoPushToken) {
      await this.pushNotificationService.sendPushNotification(
        patient.expoPushToken,
        'Appointment Cancelled',
        `Your appointment with ${doctorName} on ${dateTime} has been cancelled.`,
        {
          type: 'APPOINTMENT_CANCELLED',
          appointmentId: appointment.id,
        },
      );
    }

    if (patient.email) {
      await this.emailService.sendCancellationNotification(
        patient.email,
        patientName,
        doctorName,
        dateTime,
      );
    }

    if (doctorUser.expoPushToken) {
      await this.pushNotificationService.sendPushNotification(
        doctorUser.expoPushToken,
        'Appointment Cancelled',
        `${patientName}'s appointment on ${dateTime} has been cancelled.`,
        {
          type: 'APPOINTMENT_CANCELLED',
          appointmentId: appointment.id,
        },
      );
    }
  }

  @OnEvent('appointment.completed')
  async handleAppointmentCompleted(event: AppointmentEvent): Promise<void> {
    const { appointment } = event;
    this.logger.log(`Handling appointment.completed for ${appointment.id}`);

    const patient = appointment.patient;

    if (!patient) return;

    if (patient.expoPushToken) {
      await this.pushNotificationService.sendPushNotification(
        patient.expoPushToken,
        'Appointment Completed',
        'Your appointment has been marked as completed. You can view your medical records in the app.',
        {
          type: 'APPOINTMENT_COMPLETED',
          appointmentId: appointment.id,
        },
      );
    }
  }

  @OnEvent('medical-record.created')
  async handleMedicalRecordCreated(event: MedicalRecordEvent): Promise<void> {
    this.logger.log(
      `Handling medical-record.created for patient ${event.patientId}`,
    );
  }
}
