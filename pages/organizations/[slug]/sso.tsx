import { Error, Loading } from '@/components/shared';
import { OrganizationTab } from '@/components/organization';
import { ConnectionsWrapper } from '@boxyhq/react-ui/sso';
import useOrganization from 'hooks/useOrganization';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import toast from 'react-hot-toast';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import env from '@/lib/env';
import { BOXYHQ_UI_CSS } from '@/components/styles';

const OrganizationSSO = ({ teamFeatures, SPConfigURL }) => {
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
      <OrganizationTab activeTab="sso" organization={organization} teamFeatures={teamFeatures} />
      <ConnectionsWrapper
        urls={{
          spMetadata: SPConfigURL,
          get: `/api/organizations/${organization.slug}/sso`,
          post: `/api/organizations/${organization.slug}/sso`,
          patch: `/api/organizations/${organization.slug}/sso`,
          delete: `/api/organizations/${organization.slug}/sso`,
        }}
        successCallback={({
          operation,
          connectionIsSAML,
          connectionIsOIDC,
        }) => {
          const ssoType = connectionIsSAML
            ? 'SAML'
            : connectionIsOIDC
              ? 'OIDC'
              : '';
          if (operation === 'CREATE') {
            toast.success(`${ssoType} connection created successfully.`);
          } else if (operation === 'UPDATE') {
            toast.success(`${ssoType} connection updated successfully.`);
          } else if (operation === 'DELETE') {
            toast.success(`${ssoType} connection deleted successfully.`);
          } else if (operation === 'COPY') {
            toast.success(`Contents copied to clipboard`);
          }
        }}
        errorCallback={(errMessage) => toast.error(errMessage)}
        classNames={BOXYHQ_UI_CSS}
        componentProps={{
          connectionList: {
            cols: ['provider', 'type', 'status', 'actions'],
          },
          editOIDCConnection: { displayInfo: false },
          editSAMLConnection: { displayInfo: false },
        }}
      />
    </>
  );
};

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  if (!env.teamFeatures.sso) {
    return {
      notFound: true,
    };
  }

  const SPConfigURL = env.jackson.selfHosted
    ? `${env.jackson.externalUrl}/.well-known/saml-configuration`
    : '/well-known/saml-configuration';

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
      teamFeatures: env.teamFeatures,
      SPConfigURL,
    },
  };
}

export default OrganizationSSO; 