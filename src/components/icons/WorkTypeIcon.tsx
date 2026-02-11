import { WorkType } from '@/types';
import { WORK_TYPE_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface WorkTypeIconProps {
  type: WorkType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function WorkTypeIcon({ type, size = 'md', showLabel = false, className }: WorkTypeIconProps) {
  const config = WORK_TYPE_CONFIG[type];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="rounded-lg bg-secondary p-2">
        <Icon className={cn(sizeClasses[size], 'text-primary')} />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-foreground">{config.label}</span>
      )}
    </div>
  );
}
