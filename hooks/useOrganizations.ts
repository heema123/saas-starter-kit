import { defaultHeaders } from '@/lib/common';
import useSWR from 'swr';
import type { ApiResponse } from 'types';

interface UseOrganizationsResponse {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  defaultRole: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    members: number;
  };
}

const useOrganizations = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/organizations',
    async (url) => {
      const resp = await fetch(url, {
        headers: defaultHeaders,
      });
      const json = (await resp.json()) as ApiResponse<UseOrganizationsResponse[]>;

      if (!resp.ok) {
        throw new Error(json.error.message);
      }

      return json.data;
    }
  );

  return {
    organizations: data || [],
    isLoading,
    isError: error,
    mutateOrganizations: mutate,
  };
};

export default useOrganizations; 