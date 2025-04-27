import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState, useRef, useEffect } from 'react';
import { setCookie } from 'cookies-next';

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useTranslation('common');
  const { pathname, asPath, query, locale } = router;

  // Debug logs
  useEffect(() => {
    console.log('Language Switcher - Current pathname:', pathname);
    console.log('Language Switcher - Current asPath:', asPath);
    console.log('Language Switcher - Current query:', query);
    console.log('Language Switcher - Current locale:', locale);
  }, [pathname, asPath, query, locale]);

  // Available locales
  const locales = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handler to log link click
  const handleLinkClick = (localeCode: string) => {
    console.log('Language Switcher - Link clicked for locale:', localeCode);
    console.log('Language Switcher - Link href:', { pathname, query });
    console.log('Language Switcher - Link as:', asPath);
    
    // Set a custom session storage flag to identify language change in next request
    sessionStorage.setItem('languageChange', 'true');
    
    // Also set a cookie to ensure the server picks it up
    setCookie('languageChange', 'true', { maxAge: 10 }); // Short-lived cookie
    
    setIsOpen(false);
  };

  // Custom link handler with Router instead of Link component
  const handleLocaleChange = (localeCode: string) => {
    console.log('Using custom locale change handler for:', localeCode);
    handleLinkClick(localeCode);
    
    // The key fix: use router.replace with { locale: localeCode } to properly handle i18n routes
    // This keeps the user on the same page but changes the locale
    router.push(
      { pathname, query },
      undefined,
      { locale: localeCode, scroll: false }
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center rounded-full border p-2 text-sm font-medium hover:bg-muted"
        aria-label={t('switch-language')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">{t('switch-language')}</span>
        {locale === 'ar' ? 'AR' : 'EN'}
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 z-50 min-w-[100px] overflow-hidden rounded-md border bg-card p-1 shadow-md">
          <div className="py-1">
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => handleLocaleChange(loc.code)}
                className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground ${loc.code === locale ? 'bg-muted font-medium' : ''}`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 