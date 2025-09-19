# Google reCAPTCHA v3 Integration Setup

This document provides comprehensive instructions for setting up Google reCAPTCHA v3 integration in your Next.js application.

## 🚀 Quick Start

### 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "Create" to create a new site
3. Choose **reCAPTCHA v3**
4. Add your domain(s):
   - `localhost` (for development)
   - `yourdomain.com` (for production)
5. Accept the Terms of Service
6. Click "Submit"
7. Copy your **Site Key** and **Secret Key**

### 2. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Google reCAPTCHA v3 Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key-here
RECAPTCHA_SECRET_KEY=your-secret-key-here
RECAPTCHA_THRESHOLD=0.5
RECAPTCHA_ACTION=submit
RECAPTCHA_TIMEOUT=30000
```

### 3. Basic Usage

#### Wrap your app with RecaptchaProvider

```tsx
// app/layout.tsx
import { RecaptchaProvider } from '@/components/RecaptchaProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RecaptchaProvider autoLoad={true} hideBadge={false}>
          {children}
        </RecaptchaProvider>
      </body>
    </html>
  );
}
```

#### Use RecaptchaForm for forms

```tsx
import RecaptchaForm from '@/components/RecaptchaForm';

function ContactForm() {
  const handleSubmit = async (token: string) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-recaptcha-token': token,
      },
      body: JSON.stringify(formData),
    });
    return response.json();
  };

  return (
    <RecaptchaForm onSubmit={handleSubmit} action="contact_form">
      <input type="text" name="name" required />
      <input type="email" name="email" required />
      <textarea name="message" required></textarea>
    </RecaptchaForm>
  );
}
```

#### Use RecaptchaButton for actions

```tsx
import RecaptchaButton from '@/components/RecaptchaButton';

function VoteButton() {
  const handleVote = async (token: string) => {
    const response = await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-recaptcha-token': token,
      },
      body: JSON.stringify({ itemId: '123' }),
    });
    return response.json();
  };

  return (
    <RecaptchaButton
      onClick={handleVote}
      action="vote"
      threshold={0.3}
    >
      Vote
    </RecaptchaButton>
  );
}
```

## 🔧 Advanced Configuration

### Custom Thresholds

Different actions can have different security thresholds:

```tsx
import { recaptchaActions, getThresholdForAction } from '@/lib/recaptchaConfig';

// High security (admin actions)
<RecaptchaForm threshold={0.8} action={recaptchaActions.ADMIN_LOGIN}>

// Medium security (user login)
<RecaptchaForm threshold={0.6} action={recaptchaActions.LOGIN}>

// Low security (voting)
<RecaptchaButton threshold={0.3} action={recaptchaActions.VOTE}>
```

### API Route Protection

Protect your API routes with reCAPTCHA middleware:

```tsx
// app/api/protected/route.ts
import { protectRoute } from '@/lib/recaptchaMiddleware';

export async function POST(request: NextRequest) {
  const protection = await protectRoute(request, {
    threshold: 0.6,
    action: 'api_request',
  });

  if (!protection.success) {
    return protection.response!;
  }

  // Your protected logic here
  return NextResponse.json({ success: true });
}
```

### Custom Hooks

Use the reCAPTCHA hooks for custom implementations:

```tsx
import { useRecaptcha, useRecaptchaForm } from '@/hooks/useRecaptcha';

function CustomForm() {
  const { execute, verify, isLoading, error } = useRecaptcha({
    action: 'custom_action',
    threshold: 0.5,
    onSuccess: (response) => console.log('Score:', response.score),
    onError: (error) => console.error('Error:', error),
  });

  const handleSubmit = async () => {
    try {
      const token = await execute();
      const response = await verify(token.token);
      console.log('Verification result:', response);
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return (
    <button onClick={handleSubmit} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Submit'}
    </button>
  );
}
```

## 📊 Score Interpretation

reCAPTCHA v3 returns a score from 0.0 to 1.0:

- **0.0**: Very likely a bot
- **0.1-0.3**: Likely a bot
- **0.4-0.6**: Neutral
- **0.7-0.9**: Likely a human
- **1.0**: Very likely a human

### Recommended Thresholds

- **0.8-0.9**: Admin actions, payments, sensitive operations
- **0.6-0.7**: Login, registration, password reset
- **0.4-0.5**: Contact forms, comments, general submissions
- **0.2-0.3**: Voting, liking, low-risk interactions

## 🛡️ Security Best Practices

### 1. Server-Side Verification

Always verify tokens on the server:

```tsx
// ❌ Don't do this (client-side only)
const response = await grecaptcha.execute(siteKey, { action });

// ✅ Do this (server-side verification)
const response = await fetch('/api/recaptcha/verify', {
  method: 'POST',
  body: JSON.stringify({ token, action }),
});
```

### 2. Action Validation

Always validate the action matches your expected action:

```tsx
const response = await verifyToken(token, 'contact_form');
if (response.action !== 'contact_form') {
  throw new Error('Invalid action');
}
```

### 3. Score Thresholds

Use appropriate thresholds for different actions:

```tsx
// High security
if (response.score < 0.8) {
  throw new Error('Score too low');
}

// Medium security
if (response.score < 0.5) {
  throw new Error('Score too low');
}
```

### 4. Rate Limiting

Implement rate limiting alongside reCAPTCHA:

```tsx
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // Check rate limit first
  const rateLimitResult = await rateLimit(request);
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  // Then check reCAPTCHA
  const recaptchaResult = await protectRoute(request);
  if (!recaptchaResult.success) {
    return recaptchaResult.response;
  }

  // Process request
}
```

## 🐛 Troubleshooting

### Common Issues

1. **"reCAPTCHA not configured"**
   - Check your environment variables
   - Ensure `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set
   - Verify the key is correct

2. **"reCAPTCHA verification failed"**
   - Check your secret key
   - Ensure the domain is registered in reCAPTCHA admin
   - Verify the action matches

3. **"Score too low"**
   - Lower your threshold for testing
   - Check if you're testing from localhost
   - Ensure the action is appropriate

4. **Script loading errors**
   - Check your internet connection
   - Verify the site key is correct
   - Check browser console for errors

### Debug Mode

Enable debug mode for development:

```tsx
// In development, you can log reCAPTCHA responses
const { execute } = useRecaptcha({
  onSuccess: (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('reCAPTCHA Response:', response);
    }
  },
});
```

### Testing

For testing, you can use these test keys:

```bash
# Test keys (always pass)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

## 📚 API Reference

### RecaptchaService

```tsx
import { recaptchaService } from '@/lib/recaptcha';

// Execute reCAPTCHA
const token = await recaptchaService.execute('contact_form');

// Verify token
const response = await recaptchaService.verifyToken(token.token);

// Check if configured
const isConfigured = recaptchaService.isConfigured();
```

### useRecaptcha Hook

```tsx
const {
  execute,           // Execute reCAPTCHA
  verify,           // Verify token
  isLoading,        // Loading state
  error,            // Error message
  isConfigured,     // Configuration status
  lastToken,        // Last generated token
  lastResponse,     // Last verification response
  reset,            // Reset state
  clearCache,       // Clear cached tokens
} = useRecaptcha(options);
```

### RecaptchaForm Component

```tsx
<RecaptchaForm
  onSubmit={handleSubmit}        // Submit handler
  action="contact_form"          // reCAPTCHA action
  threshold={0.5}               // Score threshold
  disabled={false}              // Disable form
  loading={false}               // Loading state
  showScore={true}              // Show score
  showStatus={true}             // Show status
  onSuccess={handleSuccess}     // Success callback
  onError={handleError}         // Error callback
  submitButtonText="Submit"     // Button text
  submitButtonProps={{}}        // Button props
>
  {/* Form content */}
</RecaptchaForm>
```

## 🔗 Useful Links

- [Google reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA Best Practices](https://developers.google.com/recaptcha/docs/v3#best_practices)
- [reCAPTCHA Troubleshooting](https://developers.google.com/recaptcha/docs/faq)

## 📝 License

This reCAPTCHA integration is part of your MovieSearch2025 application and follows the same license terms.
