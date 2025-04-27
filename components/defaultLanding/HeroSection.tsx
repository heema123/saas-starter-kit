import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Button } from '@/components/shared';
import { 
  ShieldCheckIcon, 
  ClockIcon, 
  SparklesIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

const HeroSection = () => {
  const { t } = useTranslation('common');
  
  // Feature icons mapping
  const featureIcons = {
    0: <ShieldCheckIcon className="h-6 w-6 text-white" />,
    1: <ClockIcon className="h-6 w-6 text-white" />,
    2: <SparklesIcon className="h-6 w-6 text-white" />,
    3: <DocumentTextIcon className="h-6 w-6 text-white" />
  };

  // Feature background colors
  const featureColors = {
    0: "bg-primary",
    1: "bg-green-500",
    2: "bg-blue-500",
    3: "bg-amber-500"
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-24 -left-24 h-[300px] w-[300px] rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 h-[300px] w-[300px] rounded-full bg-secondary/10 blur-3xl"></div>
      
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="grid items-center gap-12 py-20 md:grid-cols-2 lg:py-32">
          <div className="flex flex-col items-start">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              {t('lawgic-hero-badge')}
            </span>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {t('lawgic-hero-title')}
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              {t('lawgic-hero-description')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/auth/join" className="px-8">
                  {t('get-started')}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/login" className="px-8">
                  {t('sign-in')}
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="inline-block h-10 w-10 overflow-hidden rounded-full border-2 border-background">
                    <div className={`h-full w-full bg-gradient-to-br from-primary-${i * 100} to-primary`}></div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">500+</span> {t('law-firms')} {t('already-using')}
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-12 top-1/3 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="relative z-10 overflow-hidden rounded-2xl border shadow-xl bg-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20"></div>
              <div className="relative h-full w-full p-4">
                <div className="grid h-full grid-cols-2 gap-4">
                  {/* Enhanced feature cards with icons and better descriptions */}
                  <div className="flex flex-col gap-4">
                    <div className="aspect-video rounded-lg bg-card shadow-lg p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="flex h-full flex-col justify-between">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${featureColors[0]}`}>
                            {featureIcons[0]}
                          </div>
                          <h3 className="font-semibold">{t('feature-0-title')}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{t('feature-0-description')}</p>
                      </div>
                    </div>
                    <div className="aspect-square rounded-lg bg-card shadow-lg p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="flex h-full flex-col justify-between">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${featureColors[1]}`}>
                            {featureIcons[1]}
                          </div>
                          <h3 className="font-semibold">{t('feature-1-title')}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{t('feature-1-description')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="aspect-square rounded-lg bg-card shadow-lg p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="flex h-full flex-col justify-between">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${featureColors[2]}`}>
                            {featureIcons[2]}
                          </div>
                          <h3 className="font-semibold">{t('feature-2-title')}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{t('feature-2-description')}</p>
                      </div>
                    </div>
                    <div className="aspect-video rounded-lg bg-card shadow-lg p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="flex h-full flex-col justify-between">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${featureColors[3]}`}>
                            {featureIcons[3]}
                          </div>
                          <h3 className="font-semibold">{t('feature-3-title')}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{t('feature-3-description')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
