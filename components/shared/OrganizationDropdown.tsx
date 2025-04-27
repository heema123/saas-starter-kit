import {
  ChevronUpDownIcon,
  FolderIcon,
  FolderPlusIcon,
  RectangleStackIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import useOrganizations from 'hooks/useOrganizations';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useRef, useEffect } from 'react';
import { maxLengthPolicies } from '@/lib/common';
import { motion, AnimatePresence } from 'framer-motion';

const OrganizationDropdown = () => {
  const router = useRouter();
  const { organizations } = useOrganizations();
  const { data } = useSession();
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOrganization = (organizations || []).find(
    (organization) => organization.slug === router.query.slug
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menus = [
    {
      id: 2,
      name: t('organizations'),
      items: (organizations || []).map((organization) => ({
        id: organization.id,
        name: organization.name,
        href: `/organizations/${organization.slug}/settings`,
        icon: FolderIcon,
        active: organization.slug === router.query.slug,
      })),
    },
    {
      id: 1,
      name: t('profile'),
      items: [
        {
          id: data?.user.id,
          name: data?.user?.name,
          href: '/settings/account',
          icon: UserCircleIcon,
          active: router.pathname === '/settings/account',
        },
      ],
    },
    {
      id: 3,
      name: '',
      items: [
        {
          id: 'all-organizations',
          name: t('all-organizations'),
          href: '/organizations',
          icon: RectangleStackIcon,
          active: router.pathname === '/organizations' && !router.query.newOrganization,
        },
        {
          id: 'new-organization',
          name: t('new-organization'),
          href: '/organizations?newOrganization=true',
          icon: FolderPlusIcon,
          active: router.pathname === '/organizations' && router.query.newOrganization === 'true',
        },
      ],
    },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex w-full items-center justify-between rounded-md border border-border bg-background hover:bg-muted px-3 py-2 transition-colors duration-200"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
            <span className="text-xs font-semibold text-primary">
              {currentOrganization 
                ? currentOrganization.name.charAt(0)
                : data?.user?.name?.charAt(0) || 'U'}
            </span>
          </span>
          <span className="truncate text-sm font-medium">
            {currentOrganization?.name ||
              data?.user?.name?.substring(
                0,
                maxLengthPolicies.nameShortDisplay
              )}
          </span>
        </div>
        <ChevronUpDownIcon className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 z-10 mt-2 origin-top-right rounded-md border border-border bg-card shadow-lg focus:outline-none"
          >
            <div className="max-h-[350px] overflow-y-auto p-1 scrollbar">
              {menus.map(({ id, name, items }) => (
                <div key={id} className="py-1">
                  {name && (
                    <div className="px-3 py-1 text-xs font-medium text-muted-foreground">
                      {name}
                    </div>
                  )}
                  <div className="mt-1 space-y-1">
                    {items.map((item) => (
                      <Link
                        key={`${id}-${item.id}`}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                          item.active
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        <item.icon className={`h-4 w-4 ${item.active ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                  {id !== 3 && (
                    <div className="my-1 border-t border-border opacity-70" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganizationDropdown; 