import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useTranslation } from 'next-i18next';
import { Button, Input } from '@/components/shared';

import type { ApiResponse } from 'types';
import { Card } from '@/components/shared';
import { defaultHeaders } from '@/lib/common';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { updateAccountSchema } from '@/lib/zod';

const UpdateName = ({ user }: { user: Partial<User> }) => {
  const { t } = useTranslation('common');
  const { update } = useSession();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: user.name,
    },
    validateOnBlur: false,
    enableReinitialize: true,
    validate: (values) => {
      try {
        updateAccountSchema.parse(values);
      } catch (error: any) {
        return error.formErrors.fieldErrors;
      }
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const json = (await response.json()) as ApiResponse;
        toast.error(json.error.message);
        return;
      }

      await update({
        name: values.name,
      });

      router.replace('/settings/account');
      toast.success(t('successfully-updated'));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card 
        title={{
          title: t('name'),
          subtitle: t('name-appearance')
        }}
        footer={
          <Button
            type="submit"
            variant="default"
            disabled={!formik.dirty || !formik.isValid}
            className={formik.isSubmitting ? "opacity-70 pointer-events-none" : ""}
          >
            {formik.isSubmitting ? t('saving') : t('save-changes')}
          </Button>
        }
      >
        <Input
          type="text"
          name="name"
          placeholder={t('your-name')}
          value={formik.values.name}
          onChange={formik.handleChange}
          className="w-full max-w-md"
          required
        />
      </Card>
    </form>
  );
};

export default UpdateName;
