import {
  Cog6ToothIcon,
  RectangleStackIcon,
  UsersIcon,
  KeyIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import NavigationItems from './NavigationItems';
import { MenuItem, NavigationProps } from './NavigationItems';

interface OrganizationNavigationProps extends NavigationProps {
  slug: string;
}

const OrganizationNavigation = ({ activePathname, slug }: OrganizationNavigationProps) => {
  const { t } = useTranslation('common');

  const menus: MenuItem[] = [
    {
      name: t('all-products'),
      href: `/organizations/${slug}/products`,
      icon: RectangleStackIcon,
      active: activePathname === `/organizations/${slug}/products`,
    },
    {
      name: t('members'),
      href: `/organizations/${slug}/members`,
      icon: UsersIcon,
      active: activePathname === `/organizations/${slug}/members`,
    },
    {
      name: t('settings'),
      href: `/organizations/${slug}/settings`,
      icon: Cog6ToothIcon,
      active: 
        activePathname === `/organizations/${slug}/settings` ||
        activePathname?.startsWith(`/organizations/${slug}/settings/`),
      items: [
        {
          name: t('general'),
          href: `/organizations/${slug}/settings`,
          active: activePathname === `/organizations/${slug}/settings`,
        },
        {
          name: t('api-keys'),
          href: `/organizations/${slug}/settings/api-keys`,
          active: activePathname === `/organizations/${slug}/settings/api-keys`,
        },
        {
          name: t('sso'),
          href: `/organizations/${slug}/settings/sso`,
          active: activePathname === `/organizations/${slug}/settings/sso`,
        }
      ],
    },
  ];

  return <NavigationItems menus={menus} />;
};

export default OrganizationNavigation; 