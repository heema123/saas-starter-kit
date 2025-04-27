import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Button } from '@/components/shared';

const PricingSection = () => {
  const { t } = useTranslation('common');

  const plans = [
    {
      name: t('pricing-starter-name'),
      description: t('pricing-starter-description'),
      price: '$99',
      period: t('pricing-period-monthly'),
      features: [
        t('pricing-starter-feature-1'),
        t('pricing-starter-feature-2'),
        t('pricing-starter-feature-3'),
        t('pricing-starter-feature-4'),
        t('pricing-starter-feature-5')
      ],
      cta: t('pricing-starter-cta'),
      popular: false
    },
    {
      name: t('pricing-professional-name'),
      description: t('pricing-professional-description'),
      price: '$199',
      period: t('pricing-period-monthly'),
      features: [
        t('pricing-professional-feature-1'),
        t('pricing-professional-feature-2'),
        t('pricing-professional-feature-3'),
        t('pricing-professional-feature-4'),
        t('pricing-professional-feature-5'),
        t('pricing-professional-feature-6')
      ],
      cta: t('pricing-professional-cta'),
      popular: true
    },
    {
      name: t('pricing-enterprise-name'),
      description: t('pricing-enterprise-description'),
      price: t('pricing-enterprise-price'),
      period: '',
      features: [
        t('pricing-enterprise-feature-1'),
        t('pricing-enterprise-feature-2'),
        t('pricing-enterprise-feature-3'),
        t('pricing-enterprise-feature-4'),
        t('pricing-enterprise-feature-5'),
        t('pricing-enterprise-feature-6'),
        t('pricing-enterprise-feature-7')
      ],
      cta: t('pricing-enterprise-cta'),
      popular: false
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            {t('pricing')}
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            {t('pricing-subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg border ${
                plan.popular
                  ? 'border-primary shadow-md'
                  : 'border-border'
              } bg-card transition-all duration-200 hover:shadow-md`}
            >
              {plan.popular && (
                <div className="absolute right-0 top-0">
                  <div className="h-16 w-16 overflow-hidden">
                    <div className="absolute left-0 top-0 h-2 w-2 bg-primary"></div>
                    <div className="absolute -right-2 -top-2 h-4 w-20 origin-bottom-left rotate-45 bg-primary"></div>
                    <div className="absolute left-0 top-0 h-16 w-16 origin-top-right rotate-45 bg-primary"></div>
                    <div className="absolute right-1 top-[14px] z-10 -rotate-45 text-[10px] font-bold text-primary-foreground">
                      {t('popular')}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">/{plan.period}</span>
                  )}
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5 text-primary"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    asChild
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full"
                  >
                    <Link href="/auth/join">{plan.cta}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
