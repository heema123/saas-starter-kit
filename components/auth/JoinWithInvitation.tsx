import {
  Error,
  InputWithLabel,
  Loading,
  WithLoadingAndError,
} from '@/components/shared';
import {
  defaultHeaders,
  maxLengthPolicies,
  passwordPolicies,
} from '@/lib/common';
import { useFormik } from 'formik';
import useInvitation from 'hooks/useInvitation';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from '@/components/shared';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import * as Yup from 'yup';
import TogglePasswordVisibility from '../shared/TogglePasswordVisibility';
import { useRef, useState } from 'react';
import AgreeMessage from './AgreeMessage';
import GoogleReCAPTCHA from '../shared/GoogleReCAPTCHA';
import ReCAPTCHA from 'react-google-recaptcha';
import { motion } from 'framer-motion';

interface JoinWithInvitationProps {
  inviteToken: string;
  recaptchaSiteKey: string | null;
}

const JoinUserSchema = Yup.object().shape({
  name: Yup.string().required().max(maxLengthPolicies.name),
  password: Yup.string()
    .required()
    .min(passwordPolicies.minLength)
    .max(maxLengthPolicies.password),
  sentViaEmail: Yup.boolean().required(),
  email: Yup.string()
    .max(maxLengthPolicies.email)
    .when('sentViaEmail', {
      is: false,
      then: (schema) => schema.required().email().max(maxLengthPolicies.email),
    }),
});

const JoinWithInvitation = ({
  inviteToken,
  recaptchaSiteKey,
}: JoinWithInvitationProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const { isLoading, error, invitation } = useInvitation();
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handlePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      sentViaEmail: invitation?.sentViaEmail || true,
    },
    validationSchema: JoinUserSchema,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const response = await fetch('/api/auth/join', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({
          ...values,
          recaptchaToken,
          inviteToken,
        }),
      });

      const json = (await response.json()) as ApiResponse;

      recaptchaRef.current?.reset();

      if (!response.ok) {
        toast.error(json.error.message);
        return;
      }

      formik.resetForm();
      toast.success(t('successfully-joined'));
      router.push(`/auth/login?token=${inviteToken}`);
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error || !invitation) {
    return <Error message={error.message} />;
  }

  return (
    <WithLoadingAndError isLoading={isLoading} error={error}>
      <form className="space-y-4" onSubmit={formik.handleSubmit} dir={t('direction')}>
        <InputWithLabel
          type="text"
          label={t('name')}
          name="name"
          placeholder={t('your-name')}
          value={formik.values.name}
          error={formik.errors.name}
          onChange={formik.handleChange}
        />

        {invitation.sentViaEmail ? (
          <InputWithLabel
            type="email"
            label={t('email')}
            value={invitation.email!}
            disabled
          />
        ) : (
          <InputWithLabel
            type="email"
            label={t('email')}
            name="email"
            placeholder={t('email')}
            value={formik.values.email}
            error={formik.errors.email}
            onChange={formik.handleChange}
          />
        )}

        <div className="relative">
          <InputWithLabel
            type={isPasswordVisible ? 'text' : 'password'}
            label={t('password')}
            name="password"
            placeholder={t('password')}
            value={formik.values.password}
            error={formik.errors.password}
            onChange={formik.handleChange}
          />
          <TogglePasswordVisibility
            isPasswordVisible={isPasswordVisible}
            handlePasswordVisibility={handlePasswordVisibility}
          />
        </div>
        <GoogleReCAPTCHA
          recaptchaRef={recaptchaRef}
          onChange={setRecaptchaToken}
          siteKey={recaptchaSiteKey}
        />
        <motion.div 
          className="mt-6 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Button
            type="submit"
            variant="default"
            disabled={formik.isSubmitting || !formik.dirty}
            size="lg"
            className="py-5 font-medium w-full rounded-md"
          >
            {formik.isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                <span>{t('loading')}</span>
              </div>
            ) : (
              t('create-account')
            )}
          </Button>
          <AgreeMessage text={t('create-account')} />
        </motion.div>
      </form>
    </WithLoadingAndError>
  );
};

export default JoinWithInvitation;
