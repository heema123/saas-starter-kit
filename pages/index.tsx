import Link from 'next/link';
import { type ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout } from 'types';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

import FAQSection from '@/components/defaultLanding/FAQSection';
import HeroSection from '@/components/defaultLanding/HeroSection';
import FeatureSection from '@/components/defaultLanding/FeatureSection';
import PricingSection from '@/components/defaultLanding/PricingSection';
import TestimonialsSection from '@/components/defaultLanding/TestimonialsSection';
import StatsSection from '@/components/defaultLanding/StatsSection';
import useTheme from 'hooks/useTheme';
import env from '@/lib/env';
import Head from 'next/head';
import { Button, LanguageSwitcher } from '@/components/shared';

const Home: NextPageWithLayout = () => {
  const { toggleTheme, selectedTheme } = useTheme();
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('lawgic-homepage-title')}</title>
        <meta name="description" content={t('lawgic-hero-description')} />
      </Head>

      <div dir={t('direction')} className="min-h-screen bg-gradient-to-b from-background to-muted/30 overflow-x-hidden">
        {/* Navbar */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
          <div className="container mx-auto flex h-16 items-center justify-between py-4 px-4 max-w-screen-xl">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary">
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-primary-foreground">L</div>
                </div>
                <span className="ml-2 text-xl font-bold">Lawgic</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {env.darkModeEnabled && (
                <button
                  className="rounded-full p-2 hover:bg-muted"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  <selectedTheme.icon className="h-5 w-5" />
                </button>
              )}
              <LanguageSwitcher />
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login">
                  {t('sign-in')}
                </Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link href="/auth/join">
                  {t('sign-up')}
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="overflow-x-hidden">
          <HeroSection />
          <StatsSection />
          <div className="mx-auto max-w-screen-xl px-4 py-10 relative">
            <div className="absolute right-0 -z-10 hidden h-[800px] w-[600px] rotate-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl lg:block"></div>
            <FeatureSection />
          </div>
          <TestimonialsSection />
          <div className="mx-auto max-w-screen-xl px-4 py-10 relative">
            <div className="absolute left-0 -z-10 hidden h-[600px] w-[600px] -rotate-12 rounded-full bg-gradient-to-tl from-primary/10 to-secondary/10 blur-3xl lg:block"></div>
            <PricingSection />
          </div>
          <FAQSection />
        </main>

        <footer className="border-t bg-muted/30 w-full">
          <div className="container mx-auto px-4 py-12 max-w-screen-xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Link href="/" className="flex items-center">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary">
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-primary-foreground">L</div>
                  </div>
                  <span className="ml-2 text-xl font-bold">Lawgic</span>
                </Link>
                <p className="mt-4 text-sm text-muted-foreground">
                  {t('lawgic-hero-description')}
                </p>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase">{t('features')}</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">{t('feature-0-title')}</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">{t('feature-1-title')}</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">{t('feature-2-title')}</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">{t('feature-3-title')}</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase">{t('company')}</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">{t('about-us')}</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">{t('contact')}</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">{t('privacy')}</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">{t('terms')}</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase">{t('support')}</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">{t('help-center')}</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">{t('documentation')}</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">{t('api')}</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t border-border/40 pt-8">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} Lawgic. {t('all-rights-reserved')}
                </p>
                <div className="flex gap-4">
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    <span className="sr-only">Facebook</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    <span className="sr-only">Twitter</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    <span className="sr-only">Instagram</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // Redirect to login page if landing page is disabled
  if (env.hideLandingPage) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: true,
      },
    };
  }

  const { locale } = context;

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Home;
