import { PageLayout } from '@/components/layout/PageLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { sampleAttestations } from '@/lib/sampleData';
import { WORK_TYPE_CONFIG } from '@/lib/constants';
import { WorkTypeIcon } from '@/components/icons/WorkTypeIcon';
import { Attestation } from '@/types';
import { 
  Calendar, 
  ExternalLink, 
  CheckCircle, 
  XCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

function AttestationCard({ attestation, isWorker }: { attestation: Attestation; isWorker: boolean }) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-soft border border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <WorkTypeIcon type={attestation.workType} size="sm" />
          <div>
            <p className="font-medium text-foreground">
              {WORK_TYPE_CONFIG[attestation.workType].label}
            </p>
            <p className="text-sm text-muted-foreground">
              {attestation.employerName}
            </p>
          </div>
        </div>
        <StatusBadge status={attestation.status} />
      </div>

      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
        <Calendar className="h-3.5 w-3.5" />
        <span>
          {format(attestation.startDate, 'MMM d, yyyy')} — {format(attestation.endDate, 'MMM d, yyyy')}
        </span>
      </div>

      {attestation.description && (
        <p className="text-sm text-foreground bg-secondary/50 rounded-lg p-3 mb-3">
          "{attestation.description}"
        </p>
      )}

      {/* Actions for pending attestations */}
      {attestation.status === 'pending' && isWorker && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          <Button variant="success" size="sm" className="flex-1">
            <CheckCircle className="h-4 w-4" />
            Confirm
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
        </div>
      )}

      {/* Stellar link for completed */}
      {attestation.stellarTxHash && (
        <button className="flex items-center gap-1.5 text-sm text-accent hover:underline mt-2">
          <ExternalLink className="h-3.5 w-3.5" />
          View on Stellar Explorer
        </button>
      )}
    </div>
  );
}

export default function AttestationsList() {
  const { userRole } = useApp();
  const isWorker = userRole === 'worker';
  
  // Filter based on role (in real app, would filter by user ID)
  const attestations = sampleAttestations;
  
  const pendingAttestations = attestations.filter(a => a.status === 'pending');
  const completedAttestations = attestations.filter(a => a.status === 'completed' || a.status === 'confirmed');

  return (
    <PageLayout title={isWorker ? 'Work History' : 'Attestations'}>
      <div className="px-4 py-6">
        {/* Pending Section */}
        {pendingAttestations.length > 0 && (
          <div className="mb-6 animate-fade-up">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-pending" />
              <h2 className="text-lg font-semibold text-foreground">
                Pending Confirmation
              </h2>
            </div>
            <div className="space-y-3">
              {pendingAttestations.map((attestation) => (
                <AttestationCard 
                  key={attestation.id} 
                  attestation={attestation} 
                  isWorker={isWorker}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Section */}
        <div className="animate-fade-up animation-delay-100">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <h2 className="text-lg font-semibold text-foreground">
              Verified History
            </h2>
          </div>
          <div className="space-y-3">
            {completedAttestations.map((attestation) => (
              <AttestationCard 
                key={attestation.id} 
                attestation={attestation} 
                isWorker={isWorker}
              />
            ))}
          </div>
        </div>

        {/* Empty state */}
        {attestations.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No work history yet</p>
            {!isWorker && (
              <Button variant="default" className="mt-4">
                Create First Attestation
              </Button>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
