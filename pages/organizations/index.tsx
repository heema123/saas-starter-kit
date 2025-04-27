import { Organizations } from '@/components/organization';
import { WithAuth } from '@/lib/auth';
import type { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps = async ({
  locale = 'en',
}: GetServerSidePropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

const OrganizationsPage = () => {
  const { t } = useTranslation('common');

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('organizations')}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t('organizations-description')}
        </p>
      </div>
      <Organizations />
    </div>
  );
};

export default WithAuth(OrganizationsPage); 