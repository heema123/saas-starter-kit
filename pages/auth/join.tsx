import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { type ReactElement, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';

import type { NextPageWithLayout } from 'types';
import { authProviderEnabled } from '@/lib/auth';
import { AuthLayout } from '@/components/layouts';
import GithubButton from '@/components/auth/GithubButton';
import GoogleButton from '@/components/auth/GoogleButton';
import { JoinWithInvitation, Join } from '@/components/auth';
import Head from 'next/head';
import { Loading } from '@/components/shared';
import env from '@/lib/env';

const Signup: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ authProviders, recaptchaSiteKey }) => {
  const router = useRouter();
  const { status } = useSession();
  const { t } = useTranslation('common');

  const { error, token } = router.query as {
    error: string;
    token: string;
  };

  useEffect(() => {
    if (error) {
      toast.error(t(error));
    }
  }, [error, t]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'authenticated') {
    router.push(env.redirectIfAuthenticated);
  }

  const params = token ? `?token=${token}` : '';

  return (
    <>
      <Head>
        <title>{t('sign-up-title')}</title>
      </Head>
      <motion.div 
        className="rounded-xl p-8 border bg-card shadow-md transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        dir={t('direction')}
      >
        <div className="mb-6 w-full flex flex-col items-center">
          <h3 className="text-center mb-3 text-sm font-medium text-muted-foreground">
            {t('sign-up-with')}
          </h3>
          <div className="w-full max-w-xs">
            {authProviders.google && <GoogleButton />}
          </div>
        </div>

        {authProviders.google && authProviders.credentials && (
          <div className="divider my-6 opacity-70">{t('or')}</div>
        )}

        {authProviders.credentials && (
          <>
            {token ? (
              <JoinWithInvitation
                inviteToken={token}
                recaptchaSiteKey={recaptchaSiteKey}
              />
            ) : (
              <Join recaptchaSiteKey={recaptchaSiteKey} />
            )}
          </>
        )}
      </motion.div>
      <motion.p 
        className="text-center text-sm text-muted-foreground mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        {t('already-have-an-account')}
        <Link
          href={`/auth/login/${params}`}
          className="font-medium text-primary hover:text-primary/80 transition-colors mx-1"
        >
          {t('sign-in')}
        </Link>
      </motion.p>
    </>
  );
};

Signup.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout heading="get-started" description="create-a-new-account">
      {page}
    </AuthLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { locale } = context;

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
      authProviders: authProviderEnabled(),
      recaptchaSiteKey: env.recaptcha.siteKey,
    },
  };
};

export default Signup;
