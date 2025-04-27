import { useTranslation } from 'next-i18next';
import features from './data/features.json';

const FeatureIcons = {
  0: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 21a8 8 0 0 0-16 0" />
      <circle cx="10" cy="8" r="5" />
      <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
    </svg>
  ),
  1: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
      <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" />
      <path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" />
    </svg>
  ),
  2: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  3: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 7h10" />
      <path d="M7 12h10" />
      <path d="M7 17h10" />
    </svg>
  ),
  4: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M8 3v18" />
      <path d="M16 3v18" />
      <path d="M3 8h18" />
      <path d="M3 16h18" />
    </svg>
  ),
  5: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m2 12 10-10" />
      <path d="m12 2 10 10" />
      <path d="M12 2v10" />
    </svg>
  ),
  default: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="16" />
      <line x1="8" x2="16" y1="12" y2="12" />
    </svg>
  ),
};

const FeatureSection = () => {
  const { t } = useTranslation('common');
  
  const displayedFeatures = features.slice(0, 6);
  
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          {t('lawgic-features-title')}
        </h2>
        <p className="mb-12 text-lg text-muted-foreground">
          {t('lawgic-features-subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {displayedFeatures.map((feature, index) => {
          const Icon = FeatureIcons[index] || FeatureIcons.default;
          
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md"
            >
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 opacity-0 transition-all duration-300 group-hover:opacity-100"></div>
              
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              
              <h3 className="mb-2 text-xl font-semibold">
                {t(`feature-${index}-title`, { defaultValue: feature.name })}
              </h3>
              
              <p className="text-muted-foreground">
                {t(`feature-${index}-description`, { defaultValue: feature.description })}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureSection;
