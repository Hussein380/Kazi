import { PageLayout } from '@/components/layout/PageLayout';
import { WorkTypeIcon } from '@/components/icons/WorkTypeIcon';
import { Button } from '@/components/ui/button';
import { sampleJobs } from '@/lib/sampleData';
import { WORK_TYPE_CONFIG } from '@/lib/constants';
import { Job } from '@/types';
import { MapPin, Calendar, Home, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-soft border border-border">
      <div className="flex items-start gap-3">
        <WorkTypeIcon type={job.workType} size="md" />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{job.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{job.employerName}</p>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
            {job.isLiveIn && (
              <span className="flex items-center gap-1 text-xs text-accent font-medium">
                <Home className="h-3 w-3" />
                Live-in
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-foreground mt-3 line-clamp-2">
        {job.description}
      </p>

      {job.salary && (
        <div className="mt-3 px-3 py-2 bg-secondary/50 rounded-lg">
          <p className="text-sm font-medium text-foreground">{job.salary}</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          Posted {format(job.createdAt, 'MMM d')}
        </span>
        <Button variant="default" size="sm">
          Apply Now
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function JobsList() {
  const openJobs = sampleJobs.filter(j => j.status === 'open');

  return (
    <PageLayout title="Find Jobs">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {openJobs.length} open positions
          </p>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {openJobs.map((job, index) => (
            <div 
              key={job.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <JobCard job={job} />
            </div>
          ))}
        </div>

        {/* No jobs state */}
        {openJobs.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No open positions right now</p>
            <p className="text-sm text-muted-foreground mt-1">
              Check back soon for new opportunities
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
