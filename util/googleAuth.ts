import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export const signInWithGoogle = async () => {
  try {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices();
    
    // Sign in
    const userInfo = await GoogleSignin.signIn();
    
    // Get the ID token
    const tokenResponse = await GoogleSignin.getTokens();
    
    return {
      userInfo,
      idToken: tokenResponse.idToken,
    };
  } catch (error) {
    console.error('Google Sign-In error:', error);
    throw error;
  }
};

export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('Google Sign-Out error:', error);
    throw error;
  }
};

export const checkSignInStatus = async () => {
  try {
    const user = GoogleSignin.getCurrentUser();
    return user !== null;
  } catch (error) {
    console.error('Check sign-in status error:', error);
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    return GoogleSignin.getCurrentUser();
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};
