# Google Sign-In Setup Guide

This guide will help you set up Google Sign-In for your Expense Tracker app.

## Prerequisites

1. A Google Cloud Console project
2. Firebase project configured
3. Expo development environment

## Step 1: Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Choose "Web application" as the application type
7. Add the following authorized redirect URIs:
   - `https://auth.expo.io/ritikmitra/expense-tracker`
   - `expense-tracker://auth` (for development builds)
8. Note down your Client ID and Client Secret

## Step 2: Update Configuration

1. Open `util/googleAuth.ts`
2. Replace the placeholder values:
   ```typescript
   const GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID';
   const GOOGLE_CLIENT_SECRET = 'YOUR_ACTUAL_CLIENT_SECRET';
   ```

## Step 3: Firebase Configuration

1. In your Firebase Console, go to Authentication → Sign-in method
2. Enable Google as a sign-in provider
3. Add your Google OAuth Client ID and Client Secret
4. Configure the authorized domains if needed

## Step 4: Environment Variables (Recommended)

For better security, consider using environment variables:

1. Create a `.env` file in your project root:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

2. Install expo-constants if not already installed:
   ```bash
   npm install expo-constants
   ```

3. Update `util/googleAuth.ts` to use environment variables:
   ```typescript
   import Constants from 'expo-constants';
   
   const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.googleClientId || 'YOUR_CLIENT_ID';
   const GOOGLE_CLIENT_SECRET = Constants.expoConfig?.extra?.googleClientSecret || 'YOUR_CLIENT_SECRET';
   ```

4. Update `app.json` to include the extra configuration:
   ```json
   {
     "expo": {
       "extra": {
         "googleClientId": process.env.GOOGLE_CLIENT_ID,
         "googleClientSecret": process.env.GOOGLE_CLIENT_SECRET
       }
     }
   }
   ```

## Step 5: Testing

1. Run your app: `npm start`
2. Navigate to the sign-in screen
3. Tap "Sign in with Google"
4. Complete the OAuth flow

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**: Make sure your redirect URI matches exactly what's configured in Google Cloud Console
2. **"Client ID not found" error**: Verify your Client ID is correct and the API is enabled
3. **"Network error"**: Check your internet connection and firewall settings

### For Development Builds:

If you're using development builds, you'll need to:
1. Build a development client: `expo run:android` or `expo run:ios`
2. Use the development redirect URI: `expense-tracker://auth`

### For Production:

1. Update the redirect URI in Google Cloud Console to match your production app
2. Use environment variables for production credentials
3. Test thoroughly before deploying

## Security Notes

- Never commit your Client Secret to version control
- Use environment variables for sensitive configuration
- Regularly rotate your OAuth credentials
- Monitor your OAuth usage in Google Cloud Console

## Additional Resources

- [Expo AuthSession Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
