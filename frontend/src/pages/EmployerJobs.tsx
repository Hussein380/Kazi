import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { sampleJobs } from '@/lib/sampleData';
import { Employer, Job } from '@/types';
import { 
  Briefcase, 
  Plus, 
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function EmployerJobs() {
  const navigate = useNavigate();
  const { currentUser, employer } = useApp();
  const currentEmployer = (currentUser || employer) as Employer;
  
  if (!currentEmployer) {
    return (
      <PageLayout title="My Jobs">
        <div className="p-4 text-center text-muted-foreground">
          No employer data found
        </div>
      </PageLayout>
    );
  }

  // Get jobs posted by this employer
  const employerJobs = sampleJobs.filter(job => job.employerId === currentEmployer.id);
  const openJobs = employerJobs.filter(job => job.status === 'open');
  const closedJobs = employerJobs.filter(job => job.status === 'closed');

  const JobCard = ({ job }: { job: Job }) => (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{job.title}</CardTitle>
          <div className="flex items-center gap-2">
            {job.status === 'open' ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/15 text-success rounded-full text-xs font-medium">
                <CheckCircle className="h-3 w-3" />
                Open
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                <XCircle className="h-3 w-3" />
                Closed
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{job.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Posted {format(job.createdAt, 'MMM d, yyyy')}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-2 text-sm text-foreground font-medium">
              <span>💰</span>
              <span>{job.salary}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            View Details
          </Button>
          {job.status === 'open' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/jobs/${job.id}/edit`)}
            >
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout title="My Job Postings">
      <div className="px-4 py-6 space-y-6">
        {/* Header with CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Job Management</h2>
            <p className="text-muted-foreground">
              Manage all your job postings and applications
            </p>
          </div>
          <Button 
            className="w-full sm:w-auto"
            onClick={() => navigate('/jobs/new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up animation-delay-100">
          <Card>
            <CardContent className="p-4 text-center">
              <Briefcase className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{employerJobs.length}</p>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{openJobs.length}</p>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{closedJobs.length}</p>
              <p className="text-sm text-muted-foreground">Closed Jobs</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Jobs */}
        {openJobs.length > 0 && (
          <div className="animate-fade-up animation-delay-200">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Active Job Postings ({openJobs.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {openJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Closed Jobs */}
        {closedJobs.length > 0 && (
          <div className="animate-fade-up animation-delay-300">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-muted-foreground" />
              Closed Job Postings ({closedJobs.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {closedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {employerJobs.length === 0 && (
          <Card className="animate-fade-up animation-delay-200">
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Job Postings Yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by posting your first job opportunity
              </p>
              <Button 
                onClick={() => navigate('/jobs/new')}
                className="mx-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Job
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}