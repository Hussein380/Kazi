import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";
import { WORK_TYPE_CONFIG } from "@/lib/constants";
import { createAttestation } from "@/lib/api";
import { WorkType } from "@/types";
import {
  Calendar,
  User,
  Briefcase,
  FileText,
  CheckCircle,
  Shield,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";

export default function CreateAttestation() {
  const location = useLocation();
  const { selectedEmployee } = location.state;
  const { currentUser, publicKey, refreshUserProfile } = useApp();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    workerName: "",
    workerPhone: "",
    workType: "" as WorkType | "",
    startDate: "",
    endDate: "",
    description: "",
    employeePublicKey: "", // Will be populated from worker lookup
  });
  const [isSubmitted, setIsSubmitted] = useState(false);


  if (!currentUser || currentUser.role !== "employer") {
    return (
      <PageLayout title="Create Attestation">
        <div className="px-4 py-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-foreground font-medium">
            Only employers can create attestations
          </p>
        </div>
      </PageLayout>
    );
  }

  const handleSubmit = async () => {
    if (!publicKey) {
      setError("You must be logged in to create an attestation");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, we'll use the phone number as a simple lookup
      // In production, you'd have a proper employee lookup endpoint
      const response = await createAttestation(publicKey, {
        employee_pk: selectedEmployee.publicKey,
        workType: selectedEmployee.workTypes[0],
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
      });

      console.log("Attestation created:", response);
      setIsSubmitted(true);
      refreshUserProfile();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create attestation",
      );
      console.error("Error creating attestation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <PageLayout title="Attestation Created">
        <div className="px-4 py-12 text-center">
          <div className="h-20 w-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Attestation Sent!
          </h2>
          <p className="text-muted-foreground mb-6">
            {selectedEmployee.name} will receive a notification to confirm this
            work period. An NFT certification has been deployed to their
            account.
          </p>

          <div className="bg-card rounded-xl p-4 shadow-soft border border-border text-left mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-5 w-5 text-accent" />
              <span className="font-medium text-foreground">
                What happens next?
              </span>
            </div>
            <ol className="space-y-2 text-sm text-muted-foreground ml-8">
              <li>1. Record is stored on Stellar blockchain</li>
              <li>2. NFT certificate is minted for the worker</li>
              <li>3. Work history is updated on-chain</li>
              <li>4. Both parties receive verification confirmation</li>
            </ol>
          </div>

          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => {
              setIsSubmitted(false);
              setStep(1);
              setFormData({
                workerName: "",
                workerPhone: "",
                workType: "",
                startDate: "",
                endDate: "",
                description: "",
                employeePublicKey: "",
              });
            }}
          >
            Create Another Attestation
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Verify Work">
      <div className="px-4 py-6">
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="animate-fade-up space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Add a note (optional)
              </h2>
              <p className="text-sm text-muted-foreground">
                Share your experience
              </p>
            </div>
          </div>

          <Textarea
            placeholder="e.g. Excellent care for our children. Very reliable and professional."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="mb-4"
          />

          {/* Review Summary */}
          <div className="bg-secondary/50 rounded-xl p-4 mb-6">
            <h3 className="font-medium text-foreground mb-3">Review</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Worker</span>
                <span className="text-foreground font-medium">
                  {selectedEmployee.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Work Type</span>
                <span className="text-foreground font-medium">
                  {selectedEmployee.workTypes &&
                    WORK_TYPE_CONFIG[selectedEmployee.workTypes[0]].label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Period</span>
                <span className="text-foreground font-medium">
                  {formData.startDate &&
                    format(new Date(formData.startDate), "MMM yyyy")}{" "}
                  —{" "}
                  {formData.endDate &&
                    format(new Date(formData.endDate), "MMM yyyy")}
                </span>
              </div>
            </div>
          </div>

          {/* Blockchain notice */}
          <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20 mb-6">
            <Shield className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              This record will be permanently stored on the Stellar blockchain
              and an NFT certificate will be minted for the worker.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setStep(2)}
            >
              Back
            </Button>
            <Button
              variant="default"
              size="lg"
              className="flex-1"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Send Attestation"}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
