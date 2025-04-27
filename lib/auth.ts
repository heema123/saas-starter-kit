import { compare, hash } from 'bcryptjs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ComponentType, useEffect } from 'react';

import env from './env';
import type { AUTH_PROVIDER } from 'types';

export async function hashPassword(password: string) {
  return await hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

function getAuthProviders() {
  return env.authProviders?.split(',') || [];
}

export function isAuthProviderEnabled(provider: AUTH_PROVIDER) {
  return getAuthProviders().includes(provider);
}

export function authProviderEnabled() {
  return {
    github: isAuthProviderEnabled('github'),
    google: isAuthProviderEnabled('google'),
    email: isAuthProviderEnabled('email'),
    saml: isAuthProviderEnabled('saml'),
    credentials: isAuthProviderEnabled('credentials'),
  };
}

// Higher-order component that requires authentication
export const WithAuth = (Component: ComponentType) => {
  const AuthComponent = (props: any) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isAuthenticated = status === 'authenticated';
    const isLoading = status === 'loading';

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push(`/auth/login?callbackUrl=${router.asPath}`);
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return null;
    }

    if (!isAuthenticated) {
      return null;
    }

    return Component(props);
  };

  return AuthComponent;
};
