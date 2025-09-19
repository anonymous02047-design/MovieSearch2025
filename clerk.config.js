/** @type {import('@clerk/nextjs').ClerkConfig} */
module.exports = {
  // Disable phone number authentication - use email only
  phoneNumber: {
    enabled: false,
  },
  
  // Configure sign-in and sign-up options
  signIn: {
    allowedRedirectOrigins: ['http://localhost:3000', 'http://localhost:3001'],
    afterSignInUrl: '/',
  },
  
  signUp: {
    allowedRedirectOrigins: ['http://localhost:3000', 'http://localhost:3001'],
    afterSignUpUrl: '/',
  },
  
  // Configure appearance
  appearance: {
    theme: {
      baseTheme: {
        colors: {
          primary: '#2563eb',
          primaryHover: '#1d4ed8',
        },
      },
    },
  },
  
  // Configure user profile
  userProfile: {
    additionalOAuthScopes: ['email', 'profile'],
  },
  
  // Configure session
  session: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  
  // Disable multi-factor authentication
  multiFactor: {
    enabled: false,
  },
};
