import { Link, useNavigate } from "react-router-dom";
import { Worker } from "@/types";
import { PageLayout } from "@/components/layout/PageLayout";
import { WorkTypeIcon } from "@/components/icons/WorkTypeIcon";
import { BadgeIcon } from "@/components/icons/BadgeIcon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { sampleAttestations } from "@/lib/sampleData";
import { WORK_TYPE_CONFIG } from "@/lib/constants";
import {
  MapPin,
  Calendar,
  Share2,
  Edit,
  ExternalLink,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { Key } from "react";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";

export default function WorkerProfile() {
  const navigate = useNavigate();
  const { currentUser, workers } = useApp();

  console.log(currentUser);
  // Use the first worker (Mary Wanjiku) if no currentUser is set
  const worker = (currentUser || workers[0]) as Worker;

  if (!worker) {
    return (
      <PageLayout title="Profile">
        <div className="p-4 text-center text-muted-foreground">
          No profile found
        </div>
      </PageLayout>
    );
  }

  const attestations = sampleAttestations.filter(
    (a) => a.workerId === worker.id,
  );
  const completedCount = attestations.filter(
    (a) => a.status === "completed",
  ).length;
  const pendingCount = attestations.filter(
    (a) => a.status === "pending",
  ).length;

  return (
    <PageLayout title="My Profile">
      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border animate-fade-up">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">
                  {worker.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">
                  {worker.name}
                </h2>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{worker.location}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Edit className="h-5 w-5" />
            </Button>
          </div>

          {/* Availability */}
          {/* <div className="flex items-center gap-2 mb-4">
            {worker.isAvailable ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success/15 text-success rounded-full text-sm font-medium border border-success/30">
                <CheckCircle className="h-3.5 w-3.5" />
                Available for work
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm font-medium">
                <Clock className="h-3.5 w-3.5" />
                Currently employed
              </span>
            )}
          </div> */}

          {/* Bio */}
          <p className="text-foreground">{worker.bio}</p>

          {/* Work Types */}
          <div className="mt-4 flex flex-wrap gap-2">
            {worker.workTypes?.map((type: Key) => (
              <span
                key={type}
                className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium"
              >
                {WORK_TYPE_CONFIG[type].label}
              </span>
            ))}
          </div>

          {/* Share Button */}
          <Button variant="outline" className="w-full mt-4" size="lg">
            <Share2 className="h-4 w-4" />
            Share Profile
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up animation-delay-100">
          <div className="bg-card rounded-xl p-4 text-center shadow-soft border border-border">
            <p className="text-2xl font-bold text-primary">---</p>
            <p className="text-xs text-muted-foreground mt-1">Years</p>
          </div>
          <div className="bg-card rounded-xl p-4 text-center shadow-soft border border-border">
            <p className="text-2xl font-bold ">
              {" "}
              {worker.profile?.workHistory?.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Verified Jobs</p>
          </div>
          <div className="bg-card rounded-xl p-4 text-center shadow-soft border border-border">
            <p className="text-2xl font-bold text-foreground">
              {worker.profile.workHistory?.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Badges</p>
          </div>
        </div>

        {/* Badges */}
        {worker.badges?.length > 0 && (
          <div className="animate-fade-up animation-delay-200">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Earned Badges
            </h3>
            <div className="bg-card rounded-xl p-4 shadow-soft border border-border">
              <div className="space-y-4">
                {currentUser.profile.workHistory.length}
                {/* {currentUser.profile.workHistory.map(
                  (badge: {
                    id: Key;
                    type: string;
                    name:
                      | string
                      | number
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal;
                    description:
                      | string
                      | number
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal;
                    earnedAt: string | number | Date;
                  }) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
                    >
                      <BadgeIcon type={badge.type} size="md" />
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {badge.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {badge.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Earned {new Date(badge.earnedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ),
                )} */}
              </div>
            </div>
          </div>
        )}

        {/* Work History */}
        <div className="animate-fade-up animation-delay-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">
              Work History
            </h3>
            {pendingCount > 0 && (
              <span className="text-xs bg-pending/15 text-pending px-2 py-1 rounded-full font-medium">
                {pendingCount} pending
              </span>
            )}
          </div>
          <div className="space-y-3">
            {currentUser.profile?.workHistory.map((h) => (
              <div
                key={h.id}
                className="bg-card rounded-xl p-4 shadow-soft border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {/* <WorkTypeIcon type={attestation.workType} size="sm" /> */}
                    <div className="overflow-wrap text-wrap">
                      <p className="font-medium text-foreground text-wrap overflow-auto">
                        {h.position.toUpperCase()} at{" "}
                        <span>
                          {h.employer.slice(0, 6)}...
                          {h.employer.slice(
                            h.employer.length - 6,
                            h.employer.length,
                          )}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {/* {attestation.employerName} */}
                      </p>
                    </div>
                  </div>
                  {/* <StatusBadge status={attestation.status} /> */}
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {format(h.startDate, "MMM yyyy")} —{" "}
                    {format(h.endDate, "MMM yyyy")}
                  </span>
                </div>

                <div className="mt-4 py-4 font-semibold italic text-xl">
                  " {h.description} "
                </div>

                {h.nftResult && (
                  <Link
                    to={`https://testnet.stellarchain.io/transactions/${h.nftResult.transactionHash}`}
                    target="_blank"
                  >
                    <button className="flex items-center gap-1 mt-2 hover:underline">
                      <ExternalLink className="h-3 w-3" />
                      Verify on Stellar
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Generate CV Button */}
        <Button
          variant="warm"
          size="xl"
          className="w-full animate-fade-up animation-delay-300"
          onClick={() => navigate("/cv/generate")}
        >
          <Sparkles className="h-5 w-5" />
          Generate AI CV
        </Button>
      </div>
    </PageLayout>
  );
}
