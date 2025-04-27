import { Button } from '@/lib/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/lib/components/ui/dialog';
import { useTranslation } from 'next-i18next';

interface ModalProps {
  open: boolean;
  close: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  showClose?: boolean;
}

const Modal = ({ 
  open, 
  close, 
  children, 
  title,
  description,
  footer,
  showClose = true
}: ModalProps) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        
        <div className="py-2">{children}</div>
        
        {(footer || showClose) && (
          <DialogFooter className="sm:justify-between">
            {footer}
            {showClose && (
              <Button variant="outline" onClick={close}>
                {t('close')}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
