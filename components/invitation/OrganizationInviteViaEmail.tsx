import React from 'react';
import * as Yup from 'yup';
import { mutate } from 'swr';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/shared';
import { useTranslation } from 'next-i18next';

import type { ApiResponse } from 'types';
import { defaultHeaders, maxLengthPolicies } from '@/lib/common';
import { availableRoles } from '@/lib/permissions';
import type { Organization } from '@prisma/client';

interface OrganizationInviteViaEmailProps {
  organization: Organization;
  setVisible: (visible: boolean) => void;
}

const OrganizationInviteViaEmail = ({ setVisible, organization }: OrganizationInviteViaEmailProps) => {
  const { t } = useTranslation('common');

  const FormValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .max(maxLengthPolicies.email)
      .required(t('require-email')),
    role: Yup.string()
      .required(t('required-role'))
      .oneOf(availableRoles.map((r) => r.id)),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      role: availableRoles[0].id,
      sentViaEmail: true,
    },
    validationSchema: FormValidationSchema,
    onSubmit: async (values) => {
      const response = await fetch(`/api/organizations/${organization.slug}/invitations`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const result = (await response.json()) as ApiResponse;
        toast.error(result.error.message);
        return;
      }

      toast.success(t('invitation-sent'));
      mutate(`/api/organizations/${organization.slug}/invitations?sentViaEmail=true`);
      setVisible(false);
      formik.resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} method="POST" className="pb-6">
      <h3 className="font-medium text-[14px] pb-2">{t('invite-via-email')}</h3>
      <div className="flex gap-1">
        <Input
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          placeholder="jackson@boxyhq.com"
          required
          className="text-sm w-1/2"
          type="email"
        />
        <select
          className="select-bordered select rounded"
          name="role"
          onChange={formik.handleChange}
          value={formik.values.role}
          required
        >
          {availableRoles.map((role) => (
            <option value={role.id} key={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        <Button
          type="submit"
          color="primary"
          loading={formik.isSubmitting}
          disabled={!formik.isValid || !formik.dirty}
          className="flex-grow"
        >
          {t('send-invite')}
        </Button>
      </div>
    </form>
  );
};

export default OrganizationInviteViaEmail; 