import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    this.fromAddress = this.configService.get<string>(
      'SMTP_FROM',
      'noreply@hospital-booking.com',
    );

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.mailtrap.io'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendBookingConfirmation(
    to: string,
    patientName: string,
    doctorName: string,
    dateTime: string,
    consultationType: string,
  ): Promise<void> {
    const subject = 'Appointment Booking Confirmation';
    const html = `
      <h2>Appointment Confirmed</h2>
      <p>Dear ${patientName},</p>
      <p>Your appointment has been successfully booked.</p>
      <table style="border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; font-weight: bold;">Doctor:</td><td style="padding: 8px;">${doctorName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Date & Time:</td><td style="padding: 8px;">${dateTime}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Type:</td><td style="padding: 8px;">${consultationType}</td></tr>
      </table>
      <p>If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
      <p>Thank you for choosing our hospital.</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  async sendCancellationNotification(
    to: string,
    patientName: string,
    doctorName: string,
    dateTime: string,
  ): Promise<void> {
    const subject = 'Appointment Cancellation';
    const html = `
      <h2>Appointment Cancelled</h2>
      <p>Dear ${patientName},</p>
      <p>Your appointment has been cancelled.</p>
      <table style="border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; font-weight: bold;">Doctor:</td><td style="padding: 8px;">${doctorName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Date & Time:</td><td style="padding: 8px;">${dateTime}</td></tr>
      </table>
      <p>You can book a new appointment at any time through our app.</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  async sendAppointmentReminder(
    to: string,
    patientName: string,
    doctorName: string,
    dateTime: string,
  ): Promise<void> {
    const subject = 'Appointment Reminder';
    const html = `
      <h2>Appointment Reminder</h2>
      <p>Dear ${patientName},</p>
      <p>This is a reminder for your upcoming appointment.</p>
      <table style="border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; font-weight: bold;">Doctor:</td><td style="padding: 8px;">${doctorName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Date & Time:</td><td style="padding: 8px;">${dateTime}</td></tr>
      </table>
      <p>Please arrive 15 minutes early for your appointment.</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${(error as Error).message}`);
    }
  }
}
