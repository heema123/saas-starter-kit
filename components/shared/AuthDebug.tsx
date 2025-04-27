import React from 'react';
import env from '@/lib/env';

interface AuthDebugProps {
  authProviders: {
    github: boolean;
    google: boolean;
    email: boolean;
    saml: boolean;
    credentials: boolean;
  };
}

const AuthDebug = ({ authProviders }: AuthDebugProps) => {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const googleClientId = env.google.clientId;
  const googleClientSecret = env.google.clientSecret;
  
  const hasValidGoogleCredentials = 
    googleClientId && 
    googleClientSecret && 
    googleClientId !== 'your-google-client-id-here' && 
    googleClientSecret !== 'your-google-client-secret-here' &&
    googleClientId !== 'undefined' &&
    googleClientSecret !== 'undefined';

  return (
    <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-md text-xs">
      <div className="font-bold mb-2">Auth Providers Debug:</div>
      <ul>
        <li>GitHub: {authProviders.github ? '✅' : '❌'}</li>
        <li>Google: {authProviders.google ? '✅' : '❌'}</li>
        <li>Email: {authProviders.email ? '✅' : '❌'}</li>
        <li>SAML: {authProviders.saml ? '✅' : '❌'}</li>
        <li>Credentials: {authProviders.credentials ? '✅' : '❌'}</li>
      </ul>
      
      <div className="mt-3 font-bold">Google OAuth Configuration:</div>
      <ul>
        <li>ClientID: {googleClientId ? (googleClientId.length > 20 ? googleClientId.substring(0, 5) + '...' : googleClientId) : 'missing'}</li>
        <li>ClientSecret: {googleClientSecret ? 'present' : 'missing'}</li>
        <li>Status: {hasValidGoogleCredentials ? '✅ Valid' : '❌ Invalid or Missing'}</li>
      </ul>
      
      <div className="mt-3">
        <p>If Google button is not showing correctly:</p>
        <ol className="ml-4 list-decimal">
          <li>Ensure AUTH_PROVIDERS includes "google" (currently {authProviders.google ? '✅' : '❌'})</li>
          <li>Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in .env.local (currently {hasValidGoogleCredentials ? '✅' : '❌'})</li>
          <li>Check browser console for any JavaScript errors</li>
          <li>Try clearing browser cache and reloading</li>
        </ol>
      </div>
    </div>
  );
};

export default AuthDebug; 