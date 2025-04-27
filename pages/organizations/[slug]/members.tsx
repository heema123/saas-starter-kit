import { PendingInvitations } from '@/components/invitation';
import { Error, Loading } from '@/components/shared';
import { Members, OrganizationTab } from '@/components/organization';
import env from '@/lib/env';
import useOrganization from 'hooks/useOrganization';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const OrganizationMembers = ({ teamFeatures }) => {
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
      <OrganizationTab activeTab="members" organization={organization} teamFeatures={teamFeatures} />
      <div className="space-y-6">
        <Members organization={organization} />
        <PendingInvitations team={organization} />
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

export default OrganizationMembers; 