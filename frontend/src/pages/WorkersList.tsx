import { PageLayout } from '@/components/layout/PageLayout';
import { WorkTypeIcon } from '@/components/icons/WorkTypeIcon';
import { BadgeIcon } from '@/components/icons/BadgeIcon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { sampleWorkers } from '@/lib/sampleData';
import { WORK_TYPE_CONFIG } from '@/lib/constants';
import { Worker } from '@/types';
import { MapPin, CheckCircle, ChevronRight, Star, Calendar, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function WorkerCard({ worker }: { worker: Worker }) {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div 
        onClick={() => setShowProfile(true)}
        className="bg-card rounded-xl p-4 shadow-soft border border-border cursor-pointer hover:border-primary/50 transition-all"
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-primary-foreground">
              {worker.name.charAt(0)}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">{worker.name}</h3>
              {worker.badges.length > 0 && (
                <Star className="h-4 w-4 text-badge-gold flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{worker.location}</span>
            </div>

            {/* Work Types */}
            <div className="flex flex-wrap gap-1 mt-2">
              {worker.workTypes.slice(0, 2).map((type) => (
                <span 
                  key={type}
                  className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs font-medium"
                >
                  {WORK_TYPE_CONFIG[type].label}
                </span>
              ))}
              {worker.workTypes.length > 2 && (
                <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                  +{worker.workTypes.length - 2}
                </span>
              )}
            </div>

            {/* Badges preview */}
            {worker.badges.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                {worker.badges.slice(0, 3).map((badge) => (
                  <BadgeIcon key={badge.id} type={badge.type} size="sm" />
                ))}
              </div>
            )}
          </div>

          {/* Availability & Arrow */}
          <div className="flex flex-col items-end gap-2">
            {worker.isAvailable && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/15 text-success rounded-full text-xs font-medium">
                <CheckCircle className="h-3 w-3" />
                Available
              </span>
            )}
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Experience */}
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {worker.yearsExperience} years experience • {worker.badges.length} verified badges
          </p>
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">
                  {worker.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{worker.name}</h3>
                <p className="text-sm text-muted-foreground">{worker.location}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {/* Job Description */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                About {worker.name}
              </h4>
              <p className="text-foreground text-sm">{worker.bio}</p>
            </div>

            {/* Experience */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Professional Experience
              </h4>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-foreground font-medium">{worker.yearsExperience} years of experience</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Specialized in {worker.workTypes.map(type => WORK_TYPE_CONFIG[type].label).join(', ')}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {worker.badges.map((badge) => (
                    <BadgeIcon key={badge.id} type={badge.type} size="sm" />
                  ))}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              {worker.isAvailable ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success/15 text-success rounded-full text-sm font-medium">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Available for work
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm font-medium">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Currently employed
                </span>
              )}
              <Button onClick={() => navigate(`/worker/${worker.id}`)}>
                View Full Profile
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function WorkersList() {
  return (
    <PageLayout title="Find Workers">
      <div className="px-4 py-6">
        {/* Search hint */}
        <div className="bg-secondary/50 rounded-xl p-4 mb-4">
          <p className="text-sm text-muted-foreground">
            Browse trusted domestic workers with verified experience and professional badges.
          </p>
        </div>

        {/* Workers List */}
        <div className="space-y-3">
          {sampleWorkers.map((worker, index) => (
            <div 
              key={worker.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <WorkerCard worker={worker} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
          <p className="text-sm text-foreground mb-3">
            Want to verify work for someone you employ?
          </p>
          <Button variant="trust" className="w-full">
            Create Work Attestation
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
