import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import {
  sampleJobs,
  sampleAttestations,
  sampleWorkers,
} from "@/lib/sampleData";
import { Employer } from "@/types";
import {
  Briefcase,
  Users,
  FileText,
  Plus,
  Calendar,
  TrendingUp,
  Award,
  CheckCircle,
  BarChart3,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { currentUser, employer } = useApp();
  const currentEmployer = (currentUser || employer) as Employer;

  if (!currentEmployer) {
    return (
      <PageLayout title="Employer Dashboard">
        <div className="p-4 text-center text-muted-foreground">
          No employer data found
        </div>
      </PageLayout>
    );
  }

  // Jobs posted by this employer
  const employerJobs = sampleJobs.filter(
    (job) => job.employerId === currentEmployer.id,
  );
  const openJobs = employerJobs.filter((job) => job.status === "open");
  const closedJobs = employerJobs.filter((job) => job.status === "closed");

  // Attestations for this employer
  const employerAttestations = sampleAttestations.filter(
    (att) => att.employerId === currentEmployer.id,
  );
  const completedAttestations = employerAttestations.filter(
    (att) => att.status === "completed",
  );
  const pendingAttestations = employerAttestations.filter(
    (att) => att.status === "pending",
  );

  // Top-rated workers suggestion
  const topWorkers = sampleWorkers
    .filter((worker) => worker.isAvailable)
    .sort((a, b) => b.badges.length - a.badges.length)
    .slice(0, 3);

  // Mock metrics (replace later with real values)
  const totalApplications = employerJobs.reduce((sum) => sum + 5, 0);
  const satisfactionRate = "94%";

  const StatCard = ({
    icon,
    value,
    label,
    iconClassName,
  }: {
    icon: React.ReactNode;
    value: React.ReactNode;
    label: string;
    iconClassName?: string;
  }) => (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-4 text-center">
        <div className={`h-8 w-8 mx-auto mb-2 ${iconClassName ?? ""}`}>
          {icon}
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout title={`Welcome, ${currentEmployer.name}`}>
      <div className="px-4 py-6 space-y-6">
        {/* Header with CTA (matches EmployerJobs layout) */}
        <div className="flex flex-col sm:justify-between gap-4 animate-fade-up">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground flex sm:gap-2">
              <span className="inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Managing {currentEmployer.householdName}
              </span>
              <span className="hidden sm:inline text-muted-foreground/60">
                •
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {currentEmployer.location}
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto"
              onClick={() => navigate("/jobs/new")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => navigate("/workers")}
            >
              <Users className="h-4 w-4 mr-2" />
              Find Workers
            </Button>
          </div>
        </div>

        {/* Stats Overview (same visual language as EmployerJobs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up animation-delay-100">
          <StatCard
            icon={<Briefcase className="h-8 w-8 text-primary" />}
            value={openJobs.length}
            label="Active Jobs"
          />
          <StatCard
            icon={<FileText className="h-8 w-8 text-muted-foreground" />}
            value={totalApplications}
            label="Applications"
          />
          <StatCard
            icon={<CheckCircle className="h-8 w-8 text-success" />}
            value={completedAttestations.length}
            label="Successful Hires"
          />
        </div>

        {/* Secondary Stats (optional but still consistent) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up animation-delay-150">
          <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    {satisfactionRate}
                  </p>
                </div>
                <Award className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pending Attestations
                  </p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    {pendingAttestations.length}
                  </p>
                </div>
                <BarChart3 className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-up animation-delay-200">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button
                className="w-full flex items-center gap-2 justify-start min-w-0"
                onClick={() => navigate("/jobs/new")}
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span className="truncate">Post Job</span>
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center gap-2 justify-start min-w-0"
                onClick={() => navigate("/employer/jobs")}
              >
                <Briefcase className="h-4 w-4 shrink-0" />
                <span className="truncate">Manage Jobs</span>
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center gap-2 justify-start min-w-0"
                onClick={() => navigate("/workers")}
              >
                <Users className="h-4 w-4 shrink-0" />
                <span className="truncate">Browse Workers</span>
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center gap-2 justify-start min-w-0"
                onClick={() => navigate("/attestations")}
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate">Attestations</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="animate-fade-up animation-delay-300">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/employer/jobs")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {employerJobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      job.status === "open" ? "bg-success" : "bg-muted"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {job.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {job.status === "open" ? "Active" : "Closed"} • Posted{" "}
                      {format(job.createdAt, "MMM d, yyyy")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    Details
                  </Button>
                </div>
              ))}

              {employerJobs.length === 0 && (
                <div className="py-10 text-center text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-60" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Jobs Posted Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Get started by posting your first job opportunity.
                  </p>
                  <Button onClick={() => navigate("/jobs/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Job
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommended Workers */}
        {topWorkers.length > 0 && (
          <div className="animate-fade-up animation-delay-400">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recommended Workers
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Highly rated workers available for immediate hire
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                {topWorkers.map((worker) => (
                  <Card
                    key={worker.id}
                    className="hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/worker/${worker.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{worker.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {worker.location}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {worker.bio}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-sm font-medium text-foreground">
                          {worker.yearsExperience} years experience
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/15 text-success rounded-full text-xs font-medium">
                          <Award className="h-3 w-3" />
                          {worker.badges.length} badges
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
