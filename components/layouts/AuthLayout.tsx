import app from '@/lib/app';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  heading?: string;
  description?: string;
  className?: string;
}

export default function AuthLayout({
  children,
  heading,
  description,
  className,
}: AuthLayoutProps) {
  const { t } = useTranslation('common');

  return (
    <>
      <div className={cn(
        "flex min-h-screen flex-col md:flex-row bg-gradient-to-b from-background to-muted/30 relative overflow-hidden",
        className
      )}>
        {/* Features section - Left side */}
        <div className="hidden md:flex md:w-1/2 bg-primary/5 p-8 flex-col justify-center items-center relative">
          <div className="max-w-md mx-auto space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Image
                src={app.logoUrl}
                className="h-16 w-auto mx-auto mb-6 drop-shadow"
                alt={app.name}
                width={64}
                height={64}
                priority
              />
              <h1 className="text-3xl font-bold text-foreground">{app.name}</h1>
              <p className="mt-2 text-muted-foreground">{t('auth-tagline', 'Your complete business solution')}</p>
            </motion.div>

            <div className="space-y-12">
              {/* Feature 1 */}
              <motion.div 
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{t('feature-1-title', 'Team Collaboration')}</h3>
                  <p className="text-sm text-muted-foreground">{t('feature-1-desc', 'Work together with your team in real-time with shared workspaces.')}</p>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{t('feature-2-title', 'Lightning Fast')}</h3>
                  <p className="text-sm text-muted-foreground">{t('feature-2-desc', 'Optimized performance for the best user experience possible.')}</p>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{t('feature-3-title', 'Enterprise Security')}</h3>
                  <p className="text-sm text-muted-foreground">{t('feature-3-desc', 'Advanced security features to keep your data safe and protected.')}</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Background decorative elements */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-primary/10 blur-3xl"></div>
          </div>
        </div>

        {/* Auth form - Right side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-8">
          <motion.div 
            className="sm:mx-auto sm:w-full sm:max-w-sm relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="md:hidden flex justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={app.logoUrl}
                className="h-16 w-auto drop-shadow transition-all duration-300 hover:drop-shadow-lg"
                alt={app.name}
                width={64}
                height={64}
                priority
              />
            </motion.div>
            {heading && (
              <motion.h2 
                className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {t(heading)}
              </motion.h2>
            )}
            {description && (
              <motion.p 
                className="mt-2 text-center text-muted-foreground text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                {t(description)}
              </motion.p>
            )}
          </motion.div>
          <motion.div 
            className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </>
  );
}
