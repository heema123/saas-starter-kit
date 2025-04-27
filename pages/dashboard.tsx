import { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import useTeams from 'hooks/useTeams';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ChevronRightIcon, 
  UserGroupIcon, 
  BellIcon,
  ShieldCheckIcon,
  ClockIcon,
  KeyIcon,
  DocumentMagnifyingGlassIcon,
  CreditCardIcon,
  PlusCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import type { NextPageWithLayout } from 'types';
import { Button, QuickLink } from '@/components/shared';

const Dashboard: NextPageWithLayout = () => {
  const router = useRouter();
  const { teams, isLoading } = useTeams();
  const { t } = useTranslation('common');
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    totalTeams: 0,
    apiCalls: 0,
    events: 0
  });
  const [activities, setActivities] = useState([]);
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    // Simulate loading metrics data
    const timer = setTimeout(() => {
      setMetrics({
        activeUsers: teams?.length ? teams.length * 5 + 7 : 12,
        totalTeams: teams?.length || 1,
        apiCalls: 287,
        events: 52
      });
      
      // Sample activity data
      setActivities([
        { id: 1, type: 'login', user: 'John Doe', time: '5 minutes ago', icon: ShieldCheckIcon },
        { id: 2, type: 'invite', user: 'Sarah Smith', time: '2 hours ago', icon: UserGroupIcon },
        { id: 3, type: 'settings', user: 'Mike Johnson', time: '4 hours ago', icon: BellIcon },
        { id: 4, type: 'api', user: 'Lisa Brown', time: 'Yesterday', icon: ClockIcon }
      ]);
      
      setIsMetricsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoading, teams]);

  return (
    <>
      <Head>
        <title>{t('dashboard')}</title>
      </Head>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{t('dashboard')}</h1>
          {teams?.length > 0 && (
            <Button 
              asChild
              gradient
              rightIcon={<ChevronRightIcon className="h-4 w-4" />}
              withAnimation
            >
              <Link href={`/teams/${teams[0].slug}/settings`}>
                {t('team-settings')}
              </Link>
            </Button>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title={t('active-users')}
            value={metrics.activeUsers}
            change={12}
            isPositive={true}
            isLoading={isMetricsLoading}
          />
          <MetricCard
            title={t('teams')}
            value={metrics.totalTeams}
            change={0}
            isPositive={true}
            isLoading={isMetricsLoading}
          />
          <MetricCard
            title={t('api-calls')}
            value={metrics.apiCalls}
            change={24}
            isPositive={true}
            isLoading={isMetricsLoading}
          />
          <MetricCard
            title={t('events')}
            value={metrics.events}
            change={-5}
            isPositive={false}
            isLoading={isMetricsLoading}
          />
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{t('quick-actions')}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {teams?.length > 0 ? (
                <>
                  <QuickLink 
                    href={`/teams/${teams[0].slug}/members`}
                    title={t('manage-members')}
                    icon={<UserGroupIcon />}
                    glass
                  />
                  <QuickLink 
                    href={`/teams/${teams[0].slug}/api-keys`}
                    title={t('api-keys')}
                    icon={<KeyIcon />}
                    subtle
                  />
                  <QuickLink 
                    href={`/teams/${teams[0].slug}/audit-logs`}
                    title={t('audit-logs')}
                    icon={<DocumentMagnifyingGlassIcon />}
                    variant="ghost"
                  />
                  <QuickLink 
                    href={`/teams/${teams[0].slug}/billing`}
                    title={t('billing')}
                    icon={<CreditCardIcon />}
                    gradient
                  />
                </>
              ) : (
                <>
                  <QuickLink 
                    href="/teams?newTeam=true"
                    title={t('create-team')}
                    icon={<PlusCircleIcon />}
                    gradient
                  />
                  <QuickLink 
                    href="/settings/account"
                    title={t('account-settings')}
                    icon={<Cog6ToothIcon />}
                    glass
                  />
                </>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{t('recent-activity')}</h2>
            {isMetricsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <activity.icon className="h-4 w-4 text-foreground" />
                    </span>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('no-recent-activity')}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const MetricCard = ({ title, value, change, isPositive, isLoading }) => {
  return (
    <motion.div 
      className="rounded-lg border bg-card p-6 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium tracking-tight text-muted-foreground">{title}</h3>
        {!isLoading && (
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${isPositive ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
            {isPositive ? <ArrowUpIcon className="mr-1 h-3 w-3" /> : <ArrowDownIcon className="mr-1 h-3 w-3" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="h-9 bg-muted rounded animate-pulse w-1/2 mt-2"></div>
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </motion.div>
  );
};

const QuickLink = ({ href, title }) => {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-md border p-3 hover:bg-muted transition-colors"
    >
      <span className="text-sm font-medium">{title}</span>
      <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
    </Link>
  );
};

export async function getServerSideProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Dashboard;
