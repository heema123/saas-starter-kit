import app from '@/lib/app';
import Image from 'next/image';
import useTheme from 'hooks/useTheme';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Brand = () => {
  const { theme } = useTheme();
  
  return (
    <Link href="/dashboard" className="outline-none focus:ring-0">
      <motion.div 
        className="flex items-center text-xl font-bold gap-3 text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <motion.div
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Image
            src={theme !== 'dark' ? app.logoUrl : '/logowhite.png'}
            alt={app.name}
            width={36}
            height={36}
            className="rounded-md shadow-sm"
          />
        </motion.div>
        <span className="text-gradient bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {app.name}
        </span>
      </motion.div>
    </Link>
  );
};

export default Brand;
