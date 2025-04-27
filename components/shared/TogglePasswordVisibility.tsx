import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/lib/utils';
import { useTranslation } from 'next-i18next';

interface TogglePasswordVisibilityProps {
  isPasswordVisible: boolean;
  handlePasswordVisibility: () => void;
  className?: string;
}

const TogglePasswordVisibility = ({
  isPasswordVisible,
  handlePasswordVisibility,
  className,
}: TogglePasswordVisibilityProps) => {
  const { t } = useTranslation('common');
  const isRtl = t('direction') === 'rtl';
  
  return (
    <button
      onClick={handlePasswordVisibility}
      className={cn(
        "flex pointer items-center absolute p-1 rounded-full hover:bg-muted transition-colors z-10",
        isRtl ? "left-3 top-9" : "right-3 top-9",
        className
      )}
      type="button"
      aria-label={isPasswordVisible ? "Hide password" : "Show password"}
    >
      {!isPasswordVisible ? (
        <EyeIcon className="h-5 w-5 text-muted-foreground" />
      ) : (
        <EyeSlashIcon className="h-5 w-5 text-muted-foreground" />
      )}
    </button>
  );
};

export default TogglePasswordVisibility;
