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
        "flex min-h-full flex-1 flex-col justify-center px-6 py-16 lg:px-8", 
        "bg-gradient-to-b from-background to-muted/30",
        "relative overflow-hidden",
        className
      )}>
        {/* Decorative elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-primary/10 blur-3xl"></div>
        </div>

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
            className="flex justify-center"
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
    </>
  );
}
