import Link from 'next/link';
import classNames from 'classnames';
import { motion } from 'framer-motion';

export interface MenuItem {
  name: string;
  href: string;
  icon?: any;
  active?: boolean;
  items?: Omit<MenuItem, 'icon' | 'items'>[];
  className?: string;
}

export interface NavigationProps {
  activePathname: string | null;
}

interface NavigationItemsProps {
  menus: MenuItem[];
}

interface NavigationItemProps {
  menu: MenuItem;
  className?: string;
}

const NavigationItems = ({ menus }: NavigationItemsProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.ul 
      role="list" 
      className="flex flex-1 flex-col gap-1.5"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {menus.map((menu) => (
        <motion.li key={menu.name} variants={itemVariants}>
          <NavigationItem menu={menu} />
          {menu.items && menu.items.length > 0 && (
            <ul className="flex flex-col gap-1 mt-1 ml-3 pl-3 border-l border-border">
              {menu.items.map((subitem) => (
                <motion.li 
                  key={subitem.name}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.1 }}
                >
                  <NavigationItem menu={subitem} />
                </motion.li>
              ))}
            </ul>
          )}
        </motion.li>
      ))}
    </motion.ul>
  );
};

const NavigationItem = ({ menu, className }: NavigationItemProps) => {
  return (
    <Link
      href={menu.href}
      className={classNames(
        "group flex items-center rounded-md text-sm px-3 py-2 gap-3 transition-all duration-200",
        menu.active ? 
          "bg-primary/10 text-primary font-medium" : 
          "text-foreground hover:bg-muted",
        className
      )}
    >
      {menu.icon && (
        <menu.icon
          className={classNames(
            "h-5 w-5 shrink-0",
            menu.active ? 
              "text-primary" : 
              "text-muted-foreground group-hover:text-foreground transition-colors"
          )}
          aria-hidden="true"
        />
      )}
      <span>{menu.name}</span>
      {menu.active && (
        <motion.div
          className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
          layoutId="activeIndicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
};

export default NavigationItems;
