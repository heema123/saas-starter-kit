import { copyToClipboard } from '@/lib/common';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import { Button } from '@/lib/components/ui/button';
import { toast } from 'react-hot-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/lib/components/ui/tooltip';
import { cn } from '@/lib/lib/utils';

interface CopyToClipboardProps {
  value?: string;
  text?: string;
  className?: string;
}

const CopyToClipboardButton = ({ 
  value, 
  text, 
  className 
}: CopyToClipboardProps) => {
  const { t } = useTranslation('common');
  const textToCopy = text || value || '';

  const handleCopy = () => {
    copyToClipboard(textToCopy);
    toast.success(t('copied-to-clipboard'));
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("p-0 h-auto", className)}
            onClick={handleCopy}
          >
            <ClipboardDocumentIcon className="w-5 h-5 text-muted-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('copy-to-clipboard')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyToClipboardButton;
