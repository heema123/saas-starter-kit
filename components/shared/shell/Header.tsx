import Link from 'next/link';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  SunIcon,
  UserCircleIcon,
  BellIcon,
  Cog8ToothIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import useTheme from 'hooks/useTheme';
import env from '@/lib/env';
import { useTranslation } from 'next-i18next';
import { useCustomSignOut } from 'hooks/useCustomSignout';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ setSidebarOpen }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { status, data } = useSession();
  const { t } = useTranslation('common');
  const signOut = useCustomSignOut();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (status === 'loading' || !data) {
    return null;
  }

  const { user } = data;
  
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 bg-background backdrop-blur-sm">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground transition-colors lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">{t('open-sidebar')}</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden lg:block text-xl font-semibold"
          >
            {t('dashboard')}
          </motion.div>
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={toggleNotifications}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
            </button>
            
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="p-4 border-b">
                    <h3 className="text-base font-semibold">{t('notifications')}</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto p-2">
                    <div className="p-2 hover:bg-muted rounded-md transition-colors">
                      <p className="text-sm font-medium">New team invite</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                    <div className="p-2 hover:bg-muted rounded-md transition-colors">
                      <p className="text-sm font-medium">API key created</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <div className="p-2 hover:bg-muted rounded-md transition-colors">
                      <p className="text-sm font-medium">Subscription updated</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                  <div className="p-2 text-center border-t">
                    <button className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                      {t('view-all')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Settings */}
          <Link 
            href="/settings/account" 
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted hidden sm:block"
          >
            <Cog8ToothIcon className="h-6 w-6" />
          </Link>
          
          {/* Theme Toggle */}
          {env.darkModeEnabled && (
            <button
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted hidden sm:block"
              type="button"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
          )}
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="flex items-center gap-x-2 rounded-full p-1.5 text-foreground hover:bg-muted transition-colors"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold uppercase text-primary">
                {user.name?.charAt(0) || 'U'}
              </span>
              <span className="hidden lg:flex lg:items-center">
                <span
                  className="ml-4 text-sm font-semibold leading-6 text-foreground"
                  aria-hidden="true"
                >
                  {user.name}
                </span>
                <ChevronDownIcon
                  className="ml-2 h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </span>
            </button>
            
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-200 rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      <div>{user.name}</div>
                      <div className="truncate">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="p-1">
                    <Link
                      href="/settings/account"
                      className="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <UserCircleIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                      {t('account')}
                    </Link>
                    
                    {env.darkModeEnabled && (
                      <button
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                        type="button"
                        onClick={toggleTheme}
                      >
                        {theme === 'dark' ? (
                          <SunIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                        ) : (
                          <MoonIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                        )}
                        {t('switch-theme')}
                      </button>
                    )}
                  </div>
                  
                  <div className="p-1">
                    <button
                      className="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                      type="button"
                      onClick={signOut}
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                      {t('logout')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
