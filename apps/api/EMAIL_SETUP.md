# Email Service Setup

The email service supports multiple providers. By default, it runs in `console` mode (logs emails to console) for development.

## Quick Start (Development)

No setup needed! The service defaults to `console` mode and will log emails to your console.

```env
EMAIL_PROVIDER="console"  # Default
```

## Production Setup

Choose one of the following providers:

### Option 1: Resend (Recommended for Startups)

**Pros:** Easy setup, generous free tier, great developer experience

1. Sign up at https://resend.com
2. Get your API key from the dashboard
3. Add to `.env`:

```env
EMAIL_PROVIDER="resend"
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

4. Install dependency (if not already installed):
```bash
pnpm add resend
```

5. Verify your domain in Resend dashboard (for production)

### Option 2: SendGrid

**Pros:** Mature platform, good deliverability

1. Sign up at https://sendgrid.com
2. Create API key in Settings > API Keys
3. Add to `.env`:

```env
EMAIL_PROVIDER="sendgrid"
SENDGRID_API_KEY="SG.xxxxxxxxxxxxx"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

4. Install dependency:
```bash
pnpm add @sendgrid/mail
```

5. Verify sender email/domain in SendGrid

### Option 3: AWS SES

**Pros:** Cost-effective at scale, integrates with AWS infrastructure

1. Set up AWS SES in your AWS account
2. Verify your domain/email in SES
3. Create IAM user with SES permissions
4. Add to `.env`:

```env
EMAIL_PROVIDER="ses"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIAxxxxxxxxxxxxx"
AWS_SECRET_ACCESS_KEY="xxxxxxxxxxxxx"
SES_FROM_EMAIL="noreply@yourdomain.com"
```

5. Install dependencies:
```bash
pnpm add @aws-sdk/client-ses
```

## Email Templates

The service includes a built-in verification email template. To customize:

1. Edit `src/email/email.service.ts`
2. Modify the `sendVerificationEmail` method
3. Update HTML/text templates as needed

## Testing

### Console Mode (Development)

Emails are logged to the console. Check your server logs when testing registration.

### Production Testing

1. Use a test email service like Mailtrap or Ethereal Email
2. Or use Resend's test mode (emails go to a test inbox)
3. Verify emails are received correctly

## Troubleshooting

### Emails not sending

1. Check `EMAIL_PROVIDER` is set correctly
2. Verify API keys/credentials are correct
3. Check server logs for error messages
4. Ensure your domain/email is verified (for production)

### Resend: "Domain not verified"

- In development, use `onboarding@resend.dev` as `RESEND_FROM_EMAIL`
- For production, verify your domain in Resend dashboard

### SendGrid: "Unauthorized"

- Verify API key has "Mail Send" permissions
- Check sender email is verified

### AWS SES: "Email address not verified"

- Verify sender email in SES console
- Or verify entire domain

## Environment Variables Summary

```env
# Required
EMAIL_PROVIDER="console" | "resend" | "sendgrid" | "ses"

# Resend
RESEND_API_KEY="re_xxx"
RESEND_FROM_EMAIL="noreply@domain.com"

# SendGrid
SENDGRID_API_KEY="SG.xxx"
SENDGRID_FROM_EMAIL="noreply@domain.com"

# AWS SES
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIAxxx"
AWS_SECRET_ACCESS_KEY="xxx"
SES_FROM_EMAIL="noreply@domain.com"
```
