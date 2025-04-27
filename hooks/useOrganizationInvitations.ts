import useSWR from 'swr';
import type { OrganizationInvitationType } from 'models/organizationInvitation';

interface UseOrganizationInvitationsParams {
  slug: string;
  sentViaEmail: boolean;
}

export default function useOrganizationInvitations({
  slug,
  sentViaEmail,
}: UseOrganizationInvitationsParams) {
  const { data, error, mutate } = useSWR<{
    data: OrganizationInvitationType[];
  }>(`/api/organizations/${slug}/invitations?sentViaEmail=${sentViaEmail}`);

  return {
    invitations: data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
} 