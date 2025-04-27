import React from 'react';
import OrganizationDropdown from '../OrganizationDropdown';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Brand from './Brand';
import Navigation from './Navigation';
import { useTranslation } from 'next-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Drawer = ({ sidebarOpen, setSidebarOpen }: DrawerProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <div className="relative z-50 lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            
            <div className="fixed inset-0 flex">
              <motion.div 
                className="relative mr-16 flex w-full max-w-xs flex-1"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors focus:outline-none"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">{t('close-sidebar')}</span>
                    <XMarkIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border px-6 pb-4 bg-background">
                  <div className="flex h-16 shrink-0 items-center">
                    <Brand />
                  </div>
                  <OrganizationDropdown />
                  <div className="flex-1">
                    <Navigation />
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground px-2">
                      &copy; {new Date().getFullYear()} Your Company
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-background">
          <div className="flex h-16 shrink-0 items-center px-6">
            <Brand />
          </div>
          <div className="px-6">
            <OrganizationDropdown />
          </div>
          <div className="flex-1 px-6">
            <Navigation />
          </div>
          <div className="border-t border-border p-4 mt-auto">
            <p className="text-xs text-muted-foreground px-2">
              &copy; {new Date().getFullYear()} Your Company
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
