import { useAuth } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import OnboardingForm from "./OnboardingForm";

export default function FirstTimer() {
  const { user } = useAuth();

  if (user?.onboarded) {
    return <Dashboard />;
  }

  return <OnboardingForm />;
}
