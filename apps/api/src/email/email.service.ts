import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Email Service
 *
 * Abstraction layer for sending emails.
 * Supports multiple providers: Resend (default), SendGrid, AWS SES
 *
 * Configure via EMAIL_PROVIDER environment variable:
 * - 'resend' (default) - Uses Resend API
 * - 'sendgrid' - Uses SendGrid API
 * - 'ses' - Uses AWS SES
 * - 'console' - Logs to console (development)
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly provider: string;

  constructor(private readonly configService: ConfigService) {
    this.provider = this.configService.get<string>('EMAIL_PROVIDER', 'console');
  }

  /**
   * Send an email using the configured provider
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      switch (this.provider) {
        case 'resend':
          await this.sendViaResend(options);
          break;
        case 'sendgrid':
          await this.sendViaSendGrid(options);
          break;
        case 'ses':
          await this.sendViaSES(options);
          break;
        case 'console':
        default:
          await this.sendViaConsole(options);
          break;
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      // Don't throw - email failures shouldn't break the app
      // In production, you might want to queue failed emails for retry
    }
  }

  /**
   * Send email verification email
   */
  async sendVerificationEmail(
    email: string,
    firstName: string,
    verificationToken: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3001');
    const verificationLink = `${frontendUrl}/auth/verify-email?token=${verificationToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
            <h1 style="color: #333;">Verify Your Email Address</h1>
            <p>Hi ${firstName},</p>
            <p>Thank you for registering with Digital Offices! Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationLink}</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">This link will expire in 24 hours.</p>
            <p style="color: #666; font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Verify Your Email Address

      Hi ${firstName},

      Thank you for registering with Digital Offices! Please verify your email address by visiting:

      ${verificationLink}

      This link will expire in 24 hours.

      If you didn't create an account, you can safely ignore this email.
    `;

    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email Address - Digital Offices',
      html,
      text,
    });
  }

  /**
   * Resend provider implementation
   */
  private async sendViaResend(options: EmailOptions): Promise<void> {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    // Dynamic import to avoid requiring resend as a dependency if not used
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const from = this.configService.get<string>(
      'RESEND_FROM_EMAIL',
      'onboarding@resend.dev',
    );

    await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    this.logger.log(`Email sent via Resend to ${options.to}`);
  }

  /**
   * SendGrid provider implementation
   */
  private async sendViaSendGrid(options: EmailOptions): Promise<void> {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is not configured');
    }

    const sgMail = await import('@sendgrid/mail');
    sgMail.default.setApiKey(apiKey);

    const from = this.configService.get<string>(
      'SENDGRID_FROM_EMAIL',
      'noreply@example.com',
    );

    await sgMail.default.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    this.logger.log(`Email sent via SendGrid to ${options.to}`);
  }

  /**
   * AWS SES provider implementation
   */
  private async sendViaSES(options: EmailOptions): Promise<void> {
    const { SESClient, SendEmailCommand } = await import('@aws-sdk/client-ses');

    const region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials are not configured');
    }

    const sesClient = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const from = this.configService.get<string>(
      'SES_FROM_EMAIL',
      'noreply@example.com',
    );

    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: [options.to],
      },
      Message: {
        Subject: {
          Data: options.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: options.html,
            Charset: 'UTF-8',
          },
          Text: options.text
            ? {
                Data: options.text,
                Charset: 'UTF-8',
              }
            : undefined,
        },
      },
    });

    await sesClient.send(command);
    this.logger.log(`Email sent via AWS SES to ${options.to}`);
  }

  /**
   * Console provider (development) - logs email to console
   */
  private async sendViaConsole(options: EmailOptions): Promise<void> {
    this.logger.log('='.repeat(60));
    this.logger.log('📧 EMAIL (Console Mode - Development)');
    this.logger.log('='.repeat(60));
    this.logger.log(`To: ${options.to}`);
    this.logger.log(`Subject: ${options.subject}`);
    this.logger.log(`HTML:\n${options.html}`);
    if (options.text) {
      this.logger.log(`Text:\n${options.text}`);
    }
    this.logger.log('='.repeat(60));
  }
}
