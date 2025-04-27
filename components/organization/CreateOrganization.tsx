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
import { slugify } from '@/lib/common';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';

interface CreateOrganizationProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
}

const CreateOrganization = ({ visible, setVisible }: CreateOrganizationProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [creating, setCreating] = useState(false);
  const [organizationName, setOrganizationName] = useState('');

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setCreating(true);

    if (!organizationName) {
      return;
    }

    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({
          name: organizationName,
        }),
      });

      const json = (await response.json()) as ApiResponse;

      if (!response.ok) {
        toast.error(json.error.message);
        return;
      }

      toast.success(t('organization-created'));

      router.push(`/organizations/${slugify(organizationName)}/settings`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCreating(false);
      setVisible(false);
      setOrganizationName('');
    }
  };

  return (
    <Dialog modal open={visible} onOpenChange={setVisible}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('create-organization')}</DialogTitle>
          <DialogDescription>{t('create-organization-description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Input
                id="organizationName"
                placeholder={t('organization-name')}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="md" onClick={() => setVisible(false)}>
              {t('cancel')}
            </Button>
            <Button variant="default" size="md" type="submit" isLoading={creating}>
              {t('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganization; 