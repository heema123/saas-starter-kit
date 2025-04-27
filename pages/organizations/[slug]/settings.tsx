import { Error, Loading } from '@/components/shared';
import { AccessControl } from '@/components/shared/AccessControl';
import { OrganizationSettings, RemoveOrganization, OrganizationTab } from '@/components/organization';
import env from '@/lib/env';
import useOrganization from 'hooks/useOrganization';
import type { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { TeamFeature } from 'types';

const Settings = ({ teamFeatures }: { teamFeatures: TeamFeature }) => {
  const { t } = useTranslation('common');
  const { isLoading, isError, organization } = useOrganization();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!organization) {
    return <Error message={t('organization-not-found')} />;
  }

  return (
    <>
      <OrganizationTab activeTab="settings" organization={organization} teamFeatures={teamFeatures} />
      <div className="space-y-6">
        <OrganizationSettings organization={organization} />
        <AccessControl resource="organization" actions={['delete']}>
          <RemoveOrganization organization={organization} allowDelete={teamFeatures.deleteTeam} />
        </AccessControl>
      </div>
    </>
  );
};

export const getServerSideProps = async ({
  locale = 'en',
}: GetServerSidePropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      teamFeatures: {
        sso: env.teamFeatures.sso,
        dsync: env.teamFeatures.dsync,
        auditLog: env.teamFeatures.auditLog,
        webhook: env.teamFeatures.webhook,
        apiKey: env.teamFeatures.apiKey,
        payments: env.teamFeatures.payments,
        deleteTeam: env.teamFeatures.deleteTeam,
      },
    },
  };
};

export default Settings; 