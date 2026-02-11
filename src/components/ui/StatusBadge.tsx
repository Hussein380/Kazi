import { AttestationStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, XCircle, Award } from 'lucide-react';

interface StatusBadgeProps {
  status: AttestationStatus;
  className?: string;
}

const statusConfig: Record<AttestationStatus, {
  label: string;
  icon: typeof Clock;
  className: string;
}> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-pending/15 text-pending border-pending/30',
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle,
    className: 'bg-success/15 text-success border-success/30',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-destructive/15 text-destructive border-destructive/30',
  },
  completed: {
    label: 'Completed',
    icon: Award,
    className: 'bg-accent/15 text-accent border-accent/30',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
