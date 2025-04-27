import useCanAccess from 'hooks/useCanAccess';
import { Organization } from '@prisma/client';
import type { ReactNode } from 'react';
import {
  BanknotesIcon,
  Cog6ToothIcon,
  DocumentMagnifyingGlassIcon,
  PaperAirplaneIcon,
  ShieldExclamationIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { cn } from '@/lib/lib/utils';

interface OrganizationTabProps {
  activeTab: string;
  organization: Organization;
  heading?: ReactNode;
  teamFeatures?: {
    sso: boolean;
    dsync: boolean;
    auditLog: boolean;
    webhook: boolean;
    apiKey: boolean;
    payments: boolean;
    deleteTeam: boolean;
  };
}

const OrganizationTab = ({
  activeTab,
  organization,
  heading,
  teamFeatures,
}: OrganizationTabProps) => {
  const { canAccess } = useCanAccess();

  const navigations = [
    {
      name: 'Settings',
      href: `/organizations/${organization.slug}/settings`,
      active: activeTab === 'settings',
      icon: Cog6ToothIcon,
    },
  ];

  if (canAccess('organization_member', ['create', 'update', 'read', 'delete'])) {
    navigations.push({
      name: 'Members',
      href: `/organizations/${organization.slug}/members`,
      active: activeTab === 'members',
      icon: UserPlusIcon,
    });
  }

  if (
    teamFeatures?.sso &&
    canAccess('organization_sso', ['create', 'update', 'read', 'delete'])
  ) {
    navigations.push({
      name: 'Single Sign-On',
      href: `/organizations/${organization.slug}/sso`,
      active: activeTab === 'sso',
      icon: ShieldExclamationIcon,
    });
  }

  if (
    teamFeatures?.dsync &&
    canAccess('organization_dsync', ['create', 'update', 'read', 'delete'])
  ) {
    navigations.push({
      name: 'Directory Sync',
      href: `/organizations/${organization.slug}/directory-sync`,
      active: activeTab === 'directory-sync',
      icon: UserPlusIcon,
    });
  }

  if (
    teamFeatures?.auditLog &&
    canAccess('organization_audit_log', ['create', 'update', 'read', 'delete'])
  ) {
    navigations.push({
      name: 'Audit Logs',
      href: `/organizations/${organization.slug}/audit-logs`,
      active: activeTab === 'audit-logs',
      icon: DocumentMagnifyingGlassIcon,
    });
  }

  if (
    teamFeatures?.payments &&
    canAccess('organization_payments', ['create', 'update', 'read', 'delete'])
  ) {
    navigations.push({
      name: 'Billing',
      href: `/organizations/${organization.slug}/billing`,
      active: activeTab === 'payments',
      icon: BanknotesIcon,
    });
  }

  if (
    teamFeatures?.webhook &&
    canAccess('organization_webhook', ['create', 'update', 'read', 'delete'])
  ) {
    navigations.push({
      name: 'Webhooks',
      href: `/organizations/${organization.slug}/webhooks`,
      active: activeTab === 'webhooks',
      icon: PaperAirplaneIcon,
    });
  }

  return (
    <div className="space-y-4 pb-6">
      {heading && <div className="space-y-3">{heading}</div>}
      <div className="flex flex-wrap items-center space-x-1 border-b border-border">
        {navigations.map((navigation) => (
          <Link
            key={navigation.name}
            href={navigation.href}
            className={cn(
              navigation.active
                ? 'border-b-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground',
              'group inline-flex w-full max-w-[180px] flex-1 items-center justify-center border-b-2 border-transparent px-5 py-3 text-sm lg:text-base'
            )}
          >
            <navigation.icon
              className={cn(
                navigation.active ? 'text-primary' : 'text-muted-foreground',
                'mr-2 h-5 w-5 flex-shrink-0 group-hover:text-foreground'
              )}
              aria-hidden="true"
            />
            <span>{navigation.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrganizationTab; 