# Native Google Sign-In Setup Guide

This guide will help you set up native Google Sign-In for your Expense Tracker app using `@react-native-google-signin/google-signin`.

## Prerequisites

1. A Google Cloud Console project
2. Firebase project configured
3. Expo development environment
4. Development build (not Expo Go)

## Step 1: Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity API
4. Go to "Credentials" in the left sidebar
5. Create OAuth 2.0 Client IDs for both Android and iOS:

### Android Configuration
1. Click "Create Credentials" → "OAuth 2.0 Client IDs"
2. Choose "Android" as the application type
3. Enter your package name: `com.ritik.expensetracker`
4. Generate a SHA-1 certificate fingerprint (see below)
5. Note down the Client ID

### iOS Configuration
1. Click "Create Credentials" → "OAuth 2.0 Client IDs"
2. Choose "iOS" as the application type
3. Enter your bundle ID: `com.ritik.expensetracker`
4. Note down the Client ID

### Web Configuration (for Firebase)
1. Click "Create Credentials" → "OAuth 2.0 Client IDs"
2. Choose "Web application" as the application type
3. Add authorized JavaScript origins:
   - `https://auth.expo.io`
4. Add authorized redirect URIs:
   - `https://auth.expo.io/@ritikmitra/expense-tracker`
5. Note down the Client ID (this is your webClientId)

## Step 2: Generate SHA-1 Certificate Fingerprint

### For Development
```bash
# For debug keystore
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### For Production
```bash
# For your release keystore
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

## Step 3: Update Configuration

1. Update `util/googleAuth.ts` with your web client ID:
   ```typescript
   GoogleSignin.configure({
     webClientId: 'YOUR_WEB_CLIENT_ID', // Use the web client ID here
     offlineAccess: true,
     forceCodeForRefreshToken: true,
   });
   ```

2. Update `app.json` with your iOS URL scheme:
   ```json
   {
     "expo": {
       "plugins": [
         [
           "@react-native-google-signin/google-signin",
           {
             "iosUrlScheme": "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID"
           }
         ]
       ]
     }
   }
   ```

## Step 4: Firebase Configuration

1. In your Firebase Console, go to Authentication → Sign-in method
2. Enable Google as a sign-in provider
3. Add your Google OAuth Web Client ID and Client Secret
4. Configure the authorized domains if needed

## Step 5: Development Build

Since native Google Sign-In doesn't work with Expo Go, you need to create a development build:

```bash
# Install EAS CLI if not already installed
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure EAS Build
eas build:configure

# Build for development
eas build --profile development --platform android
# or
eas build --profile development --platform ios
```

## Step 6: Testing

1. Install the development build on your device
2. Navigate to the sign-in screen
3. Tap "Sign in with Google"
4. Complete the native Google Sign-In flow

## Troubleshooting

### Common Issues:

1. **"Google Play Services not available"**: Ensure Google Play Services is installed and updated
2. **"Sign in failed"**: Check that your SHA-1 fingerprint is correct in Google Cloud Console
3. **"Client ID not found"**: Verify your webClientId matches the web application client ID

### Debugging Steps:

1. Check console logs for detailed error messages
2. Verify Google Play Services is available:
   ```typescript
   await GoogleSignin.hasPlayServices();
   ```

3. Check if user is already signed in:
   ```typescript
   const isSignedIn = await GoogleSignin.isSignedIn();
   ```

## Security Notes

- Never commit your Client Secret to version control
- Use environment variables for production credentials
- Regularly rotate your OAuth credentials
- Monitor your OAuth usage in Google Cloud Console

## Additional Resources

- [@react-native-google-signin/google-signin Documentation](https://github.com/react-native-google-signin/google-signin)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
