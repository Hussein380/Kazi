import { useApp } from "@/context/AppContext";
import Landing from "./Landing";
import WorkerProfile from "./WorkerProfile";
import WorkersList from "./WorkersList";

export default function Index() {
  const { userRole } = useApp();

  // If no role selected, show landing
  if (!userRole) {
    return <Landing />;
  }

  // Show appropriate home based on role
  if (userRole === "employee") {
    return <WorkerProfile />;
  }

  return <WorkersList />;
}
