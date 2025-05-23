import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from '@/components/shared';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

const GoogleButton = ({ className = '' }: { className?: string }) => {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const { push } = router;
  const [isLoading, setIsLoading] = useState(false);

  const { token } = router.query as { token: string };
  const redirectUrl = token ? `/invitations/${token}` : '/dashboard';

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const res = await signIn('google', { 
        redirect: false,
        callbackUrl: redirectUrl
      });
      
      if (res?.ok && !res?.error) {
        await push(redirectUrl);
      } else {
        toast.error(t('sign_in_error'));
      }
    } catch (error) {
      console.error(error);
      toast.error(t('sign_in_error_description'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
      dir={t('direction')}
    >
      <Button
        type="button"
        variant="outline"
        className={`w-full flex items-center justify-center gap-3 py-6 transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm hover:shadow font-medium rounded-md ${className}`}
        onClick={handleGoogleAuth}
        disabled={isLoading}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span>{t('google')}</span>
      </Button>
    </motion.div>
  );
};

export default GoogleButton;
