import { Megaphone } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function AdCenter() {
  return (
    <FeaturePage
      title="Ad Center"
      description="Plan paid reach, manage campaign ideas, and keep creative work organized."
      highlights={[
        "Track campaign ideas before they move into production spend.",
        "Group audience, budget, and creative notes in one place.",
        "Use this area as the handoff surface for future analytics work.",
      ]}
      icon={Megaphone}
    />
  );
}

export default AdCenter;
