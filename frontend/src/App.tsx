import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Layout } from "@/components/Layout";
import Landing from "./pages/Landing";
import WorkerProfile from "./pages/WorkerProfile";
import WorkersList from "./pages/WorkersList";
import JobsList from "./pages/JobsList";
import CreateAttestation from "./pages/CreateAttestation";
import AttestationsList from "./pages/AttestationsList";
import PostJob from "./pages/PostJob";
import GenerateCV from "./pages/GenerateCV";
import NotFound from "./pages/NotFound";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployerJobs from "./pages/EmployerJobs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/profile" element={<WorkerProfile />} />
              <Route path="/workers" element={<WorkersList />} />
              <Route path="/jobs" element={<JobsList />} />
              <Route path="/jobs/new" element={<PostJob />} />
              <Route path="/attestations" element={<AttestationsList />} />
              <Route path="/attestations/new" element={<CreateAttestation />} />
              <Route path="/cv/generate" element={<GenerateCV />} />
              {/* Employer Routes */}
              <Route path="/employer" element={<EmployerDashboard />} />http://localhost:8080/employer
              <Route path="/employer/jobs" element={<EmployerJobs />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
