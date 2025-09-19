# Fix India Phone Number Support in Clerk

## Issue
When users from India try to sign up or sign in, they get the error: "Phone numbers from this country (India) are currently not supported."

## Solution

### Step 1: Update Clerk Dashboard Settings

1. **Go to your Clerk Dashboard**: https://dashboard.clerk.com
2. **Navigate to User & Authentication > Phone, SMS, and MFA**
3. **Enable Phone Number Authentication**:
   - Toggle "Enable phone number authentication" to ON
   - Under "Allowed countries", make sure **India (IN)** is selected
   - Add other countries as needed: US, GB, CA, AU, DE, FR, IT, ES, BR, MX, JP, KR, CN

### Step 2: Configure SMS Provider

1. **Go to User & Authentication > Phone, SMS, and MFA**
2. **Select SMS Provider**:
   - **Recommended**: Twilio (most reliable for India)
   - **Alternative**: MessageBird or Vonage
3. **Configure Twilio** (if using):
   - Sign up at https://www.twilio.com
   - Get your Account SID and Auth Token
   - Add them to your Clerk dashboard

### Step 3: Update Environment Variables

Add these to your `.env.local` file:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Twilio Configuration (if using Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Step 4: Test the Configuration

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test with Indian phone number**:
   - Go to http://localhost:3000/sign-up
   - Try signing up with an Indian phone number (+91)
   - The SMS should be sent successfully

### Step 5: Alternative Solutions

If you still face issues:

#### Option A: Use Email-Only Authentication
Update your Clerk configuration to use email instead of phone:

```javascript
// In your Clerk dashboard, disable phone authentication
// and enable email authentication only
```

#### Option B: Use Social Authentication
Enable Google, Facebook, or other social providers:

1. Go to **User & Authentication > Social Connections**
2. Enable **Google** or **Facebook**
3. Configure OAuth credentials

#### Option C: Use Magic Links
Enable magic link authentication:

1. Go to **User & Authentication > Email, Magic Links**
2. Enable **Magic Links**
3. Configure your email templates

### Step 6: Update Your Application Code

The application is already configured with the correct settings. The key changes made:

1. **Middleware**: Now requires authentication for all routes except sign-in/sign-up
2. **Clerk Configuration**: Added India to allowed countries
3. **Appearance**: Customized the sign-in/sign-up forms

### Step 7: Production Considerations

For production deployment:

1. **Update allowed origins** in Clerk dashboard
2. **Use production API keys**
3. **Configure proper SMS provider**
4. **Set up webhooks** for user events

## Testing Checklist

- [ ] Indian phone numbers (+91) work for sign-up
- [ ] Indian phone numbers (+91) work for sign-in
- [ ] SMS codes are received
- [ ] Users can complete authentication
- [ ] Protected routes require authentication
- [ ] Public routes (sign-in/sign-up) are accessible

## Support

If you continue to face issues:

1. **Check Clerk Status**: https://status.clerk.com
2. **Contact Clerk Support**: https://clerk.com/support
3. **Check Twilio Status**: https://status.twilio.com (if using Twilio)

## Additional Notes

- **Cost**: SMS messages cost money (usually $0.01-$0.05 per message)
- **Rate Limits**: Be aware of SMS rate limits
- **Fallback**: Always provide alternative authentication methods
- **Testing**: Use test phone numbers during development
