import { 
  Card as CardBase, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/lib/components/ui/card';
import { cn } from '@/lib/lib/utils';

interface CardTitleProps {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
}

interface CardProps {
  title?: string | CardTitleProps;
  children: React.ReactNode;
  extra?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const Card = (props: CardProps) => {
  const { title, children, extra, footer, className = '' } = props;

  let cardTitle = '';
  let subtitle = '';
  let titleExtra;

  if (typeof title === 'string') {
    cardTitle = title;
  } else if (title) {
    cardTitle = title.title;
    subtitle = title.subtitle || '';
    titleExtra = title.extra;
  }

  return (
    <CardBase className={cn('rounded', className)}>
      {(cardTitle || titleExtra || extra) && (
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            {cardTitle && <CardTitle>{cardTitle}</CardTitle>}
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
          </div>
          <div className="flex items-center">{titleExtra || extra}</div>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardBase>
  );
};

// Add necessary sub-components
Card.Body = CardContent;
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Footer = CardFooter;

export default Card;
