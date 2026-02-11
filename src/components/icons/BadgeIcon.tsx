import { BadgeType } from '@/types';
import { BADGE_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface BadgeIconProps {
  type: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function BadgeIcon({ type, size = 'md', showLabel = false, className }: BadgeIconProps) {
  const config = BADGE_CONFIG[type];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const colorClasses = {
    bronze: 'bg-badge-bronze/20 text-badge-bronze border-badge-bronze/40',
    silver: 'bg-badge-silver/20 text-badge-silver border-badge-silver/40',
    gold: 'bg-badge-gold/20 text-badge-gold border-badge-gold/40',
  };

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div 
        className={cn(
          'rounded-full border-2 flex items-center justify-center',
          sizeClasses[size],
          colorClasses[config.color]
        )}
      >
        <Icon className={iconSizeClasses[size]} />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground text-center">
          {config.label}
        </span>
      )}
    </div>
  );
}
