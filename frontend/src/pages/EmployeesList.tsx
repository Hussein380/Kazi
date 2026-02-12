import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getEmployees, Employee } from "@/lib/api";
import {
  MapPin,
  CheckCircle,
  ChevronRight,
  Briefcase,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function EmployeeCard({
  employee,
  onSelect,
}: {
  employee: Employee;
  onSelect: (emp: Employee) => void;
}) {
  const [showProfile, setShowProfile] = useState(false);

  const workTypesList = employee.workTypes?.join(", ") || "Not specified";

  return (
    <>
      <div
        onClick={() => setShowProfile(true)}
        className="bg-card rounded-xl p-4 shadow-soft border border-border cursor-pointer hover:border-primary/50 transition-all"
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-primary-foreground">
              {employee.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {employee.name}
            </h3>

            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{employee.county}</span>
            </div>

            {/* Work Types */}
            <div className="flex flex-wrap gap-1 mt-2">
              {employee.workTypes?.slice(0, 2).map((type) => (
                <span
                  key={type}
                  className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs font-medium"
                >
                  {type}
                </span>
              ))}
              {employee.workTypes && employee.workTypes.length > 2 && (
                <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                  +{employee.workTypes.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">
                  {employee.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {employee.county}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Contact Information
              </h4>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-foreground text-sm">{employee.phone}</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Phone Number
                </p>
              </div>
            </div>

            {/* Role and Type */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Professional Details
              </h4>
              <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
                <div>
                  <p className="text-foreground font-medium capitalize">
                    {employee.role}
                  </p>
                  <p className="text-muted-foreground text-xs">Account Type</p>
                </div>
                {employee.workTypes && employee.workTypes.length > 0 && (
                  <div>
                    <p className="text-foreground font-medium">
                      {workTypesList}
                    </p>
                    <p className="text-muted-foreground text-xs">Work Types</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action */}
            <Button
              variant="default"
              size="lg"
              className="w-full mt-4"
              onClick={() => {
                onSelect(employee);
                setShowProfile(false);
              }}
            >
              Create Attestation for {employee.name.split(" ")[0]}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function EmployeesList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch employees",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSelectEmployee = (employee: Employee) => {
    // Navigate to create attestation with employee data in state
    navigate("/attestations/create", {
      state: {
        selectedEmployee: employee,
      },
    });
  };

  return (
    <PageLayout title="Browse Employees">
      <div className="px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Available Employees
          </h2>
          <p className="text-muted-foreground mt-1">
            Select an employee to create an attestation for
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading employees...</p>
          </div>
        )}

        {!isLoading && employees.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium">No employees found</p>
            <p className="text-muted-foreground text-sm">
              Check back later when employees register
            </p>
          </div>
        )}

        {!isLoading && employees.length > 0 && (
          <div className="space-y-3">
            {employees.map((employee) => (
              <EmployeeCard
                key={employee.publicKey}
                employee={employee}
                onSelect={handleSelectEmployee}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
