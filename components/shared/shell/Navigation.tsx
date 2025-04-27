import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import OrganizationNavigation from './OrganizationNavigation';
import UserNavigation from './UserNavigation';

const Navigation = () => {
  const { asPath, isReady, query } = useRouter();
  const [activePathname, setActivePathname] = useState<null | string>(null);

  const { slug } = query as { slug: string };

  useEffect(() => {
    if (isReady && asPath) {
      const activePathname = new URL(asPath, location.href).pathname;
      setActivePathname(activePathname);
    }
  }, [asPath, isReady]);

  const NavigationContent = () => {
    if (slug && asPath.includes('/organizations/')) {
      return <OrganizationNavigation activePathname={activePathname} slug={slug} />;
    } else {
      return <UserNavigation activePathname={activePathname} />;
    }
  };

  return (
    <nav className="flex flex-1 flex-col">
      <NavigationContent />
    </nav>
  );
};

export default Navigation;
