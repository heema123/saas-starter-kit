import { defaultHeaders } from '@/lib/common';
import { Button } from '@/lib/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/lib/components/ui/dialog';
import { Input } from '@/lib/components/ui/input';
import { Organization } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';

interface RemoveOrganizationProps {
  organization: Organization;
  allowDelete: boolean;
}

const RemoveOrganization = ({
  organization,
  allowDelete,
}: RemoveOrganizationProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [removing, setRemoving] = useState(false);

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setRemoving(true);

    try {
      const response = await fetch(
        `/api/organizations/${organization.slug}`,
        {
          method: 'DELETE',
          headers: defaultHeaders,
        }
      );

      if (!response.ok) {
        const json = (await response.json()) as ApiResponse;
        throw new Error(json.error.message);
      }

      toast.success(t('organization-deleted-successfully'));
      router.push('/organizations');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-medium">{t('danger-zone')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('danger-zone-description')}
        </p>
      </div>

      <div className="rounded-lg border border-destructive p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
          <div className="space-y-2">
            <h2 className="text-base font-medium">
              {t('delete-organization')}
            </h2>
            <div className="text-sm text-muted-foreground">
              <p>{t('delete-organization-description')}</p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="md"
            disabled={!allowDelete}
            onClick={() => {
              setVisible(true);
            }}
          >
            {allowDelete
              ? t('delete-organization')
              : t('delete-organization-disabled')}
          </Button>
        </div>
      </div>

      <Dialog open={visible} onOpenChange={setVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('delete-organization')}</DialogTitle>
            <DialogDescription>
              {t('delete-organization-confirmation', {
                name: organization.name,
              })}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Input
                  id="organizationName"
                  placeholder={t('confirm-organization-name')}
                  onChange={(e) => setValue(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {t('delete-organization-input-desc')}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                size="md"
                onClick={() => setVisible(false)}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="destructive"
                size="md"
                type="submit"
                isLoading={removing}
                disabled={value !== organization.name}
              >
                {t('delete-organization')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RemoveOrganization; 