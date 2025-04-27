import { useTranslation } from 'next-i18next';

const StatsSection = () => {
  const { t } = useTranslation('common');

  const stats = [
    {
      value: '10,000+',
      label: t('stats-clients'),
      description: t('stats-clients-desc'),
    },
    {
      value: '500+',
      label: t('stats-firms'),
      description: t('stats-firms-desc'),
    },
    {
      value: '95%',
      label: t('stats-satisfaction'),
      description: t('stats-satisfaction-desc'),
    },
    {
      value: '24/7',
      label: t('stats-support'),
      description: t('stats-support-desc'),
    },
  ];

  return (
    <section className="border-y bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-lg bg-card p-6 text-center shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="mb-2 text-3xl font-bold text-primary lg:text-4xl">{stat.value}</div>
              <div className="mb-1 text-sm font-semibold uppercase tracking-wider">{stat.label}</div>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 