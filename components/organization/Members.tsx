import { defaultHeaders } from '@/lib/common';
import { useTranslation } from 'next-i18next';
import { Table } from '@/components/shared/table/Table';
import { useRouter } from 'next/router';
import { LetterAvatar, WithLoadingAndError } from '@/components/shared';
import { useState } from 'react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import type { ApiResponse } from 'types';
import { Role } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { Button } from '@/lib/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/lib/components/ui/tooltip';
import useCanAccess from 'hooks/useCanAccess';
import RolePill from '../shared/RolePill';

// Create a type interface instead of importing from Prisma
interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
}

interface MembersProps {
  organization: Organization;
}

const Members = ({ organization }: MembersProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [toRemoveMember, setToRemoveMember] = useState<string | null>(null);
  const { data: session } = useSession();
  const { canAccess } = useCanAccess();

  // Get the organization members
  const { data, error, isLoading, mutate } = useSWR(
    `/api/organizations/${organization.slug}/members`,
    async (url) => {
      const resp = await fetch(url, {
        headers: defaultHeaders,
      });
      const json = (await resp.json()) as ApiResponse;

      if (!resp.ok) {
        throw new Error(json.error.message);
      }

      return json.data;
    }
  );

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      await fetch(`/api/organizations/${organization.slug}/members`, {
        method: 'DELETE',
        headers: defaultHeaders,
        body: JSON.stringify({
          memberId: toRemoveMember,
        }),
      });

      toast.success(t('member-removed-successfully'));
      setToRemoveMember(null);
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateMember = async (memberId: string, role: Role) => {
    try {
      await fetch(`/api/organizations/${organization.slug}/members`, {
        method: 'PATCH',
        headers: defaultHeaders,
        body: JSON.stringify({
          memberId,
          role,
        }),
      });

      toast.success(t('role-updated-successfully'));
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <WithLoadingAndError isLoading={isLoading} error={error}>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium">{t('members')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('members-description')}
            </p>
          </div>
          {canAccess('organization_member', ['create']) && (
            <Button
              variant="default"
              size="md"
              onClick={() =>
                router.push(
                  `/organizations/${organization.slug}/invitations/create`
                )
              }
            >
              {t('invite-people')}
            </Button>
          )}
        </div>
        <div className="space-y-3">
          <div className="border border-border shadow rounded-lg">
            <Table
              cols={[t('name'), t('role'), t('joined'), t('actions')]}
              body={
                data
                  ? data.map((member: any) => {
                      return {
                        id: member.id,
                        cells: [
                          {
                            wrap: true,
                            element: (
                              <div className="flex items-center justify-start space-x-2">
                                <LetterAvatar name={member.name} />
                                <div className="truncate">
                                  <p className="text-sm font-medium truncate">
                                    {member.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {member.email}
                                  </p>
                                </div>
                              </div>
                            ),
                          },
                          {
                            wrap: true,
                            element: (
                              <div className="flex items-center space-x-1">
                                <RolePill role={member.role} />

                                {session?.user.id === member.userId ? (
                                  <span className="text-xs text-muted-foreground">
                                    (You)
                                  </span>
                                ) : null}
                              </div>
                            ),
                          },
                          {
                            wrap: true,
                            text: new Date(member.createdAt).toDateString(),
                          },
                          session?.user.id === member.userId
                            ? {
                                wrap: true,
                                element: (
                                  <div className="flex w-full justify-end">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              disabled
                                            >
                                              {t('remove')}
                                            </Button>
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{t('cant-remove-yourself')}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                ),
                              }
                            : {
                                wrap: true,
                                buttons: [
                                  {
                                    color: 'ghost',
                                    text: t('remove'),
                                    disabled: !canAccess('organization_member', [
                                      'delete',
                                    ]),
                                    onClick: () =>
                                      setToRemoveMember(member.userId),
                                  },
                                ],
                              },
                        ],
                      };
                    })
                  : []
              }
            />
          </div>
          <div className="px-4 py-3 text-right sm:px-0">
            <Button
              size="md"
              variant="default"
              onClick={() =>
                router.push(
                  `/organizations/${organization.slug}/invitations/create`
                )
              }
            >
              {t('invite-people')}
            </Button>
          </div>
        </div>
      </div>
      <ConfirmationDialog
        visible={!!toRemoveMember}
        title={t('remove-member')}
        description={t('remove-member-description')}
        confirmText={t('remove')}
        onConfirm={onSubmit}
        onCancel={() => setToRemoveMember(null)}
      />
    </WithLoadingAndError>
  );
};

export default Members; 