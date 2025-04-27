import { defaultHeaders } from '@/lib/common';
import { Organization } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import type { ApiResponse } from 'types';

const useOrganization = () => {
  const router = useRouter();
  const slug = router.query.slug as string;

  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/organizations/${slug}` : null,
    async (url) => {
      const resp = await fetch(url, {
        headers: defaultHeaders,
      });
      const json = (await resp.json()) as ApiResponse<Organization>;

      if (!resp.ok) {
        throw new Error(json.error.message);
      }

      return json.data;
    }
  );

  return {
    organization: data,
    isLoading,
    isError: error,
    mutateOrganization: mutate,
  };
};

export default useOrganization; 