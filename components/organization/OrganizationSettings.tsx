import { defaultHeaders, slugify } from '@/lib/common';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/lib/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/lib/components/ui/form';
import { Input } from '@/lib/components/ui/input';
import type { ApiResponse } from 'types';
import toast from 'react-hot-toast';
import { Organization } from '@prisma/client';
import useOrganization from 'hooks/useOrganization';

// Make TypeScript happy
function isValidDomain(domain: string): boolean {
  const pattern = new RegExp(
    '^([a-zA-Z0-9][a-zA-Z0-9-_]*.)*[a-zA-Z0-9]*[a-zA-Z0-9-_]*[[a-zA-Z0-9]+$'
  );
  return pattern.test(domain);
}

interface OrganizationSettingsProps {
  organization: Organization;
}

const OrganizationSettings = ({ organization }: OrganizationSettingsProps) => {
  const { t } = useTranslation('common');
  const { mutateOrganization } = useOrganization();

  const FormSchema = z.object({
    name: z
      .string()
      .min(1, {
        message: t('organization-name-required'),
      })
      .max(32, {
        message: t('max-length-name', { length: 32 }),
      }),
    slug: z
      .string()
      .min(3, {
        message: t('slug-min-length'),
      })
      .max(32, {
        message: t('max-length-name', { length: 32 }),
      }),
    domain: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) {
            return true;
          }
          return isValidDomain(val);
        },
        { message: t('valid-domain') }
      ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: organization.name,
      slug: organization.slug,
      domain: organization.domain || '',
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const response = await fetch(`/api/organizations/${organization.slug}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify({
        name: data.name,
        slug: data.slug,
        domain: data.domain,
      }),
    });

    const json = (await response.json()) as ApiResponse;

    if (!response.ok) {
      toast.error(json.error.message);
      return;
    }

    toast.success(t('organization-updated'));
    mutateOrganization();
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-medium">{t('general')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('organization-settings-description')}
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 border border-border rounded-lg p-4 sm:p-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('organization-name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Acme Inc."
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (organization.slug === slugify(field.value)) {
                        form.setValue('slug', slugify(e.target.value));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('slug')}{' '}
                  <span className="text-sm text-muted-foreground">
                    {t('slug-editable')}
                  </span>
                </FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-1">
                    <p className="text-muted-foreground text-sm hidden sm:block">
                      {window.location.host}/organizations/
                    </p>
                    <Input
                      className="w-full sm:w-2/3"
                      placeholder="acme"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '-');
                        field.onChange(value);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('domain')}</FormLabel>
                <FormControl>
                  <Input placeholder="acme.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="sm" isLoading={form.formState.isSubmitting}>
            {t('save-changes')}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OrganizationSettings; 