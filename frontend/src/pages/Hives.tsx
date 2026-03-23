import { Hexagon } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function Hives() {
  return (
    <FeaturePage
      title="Hives"
      description="Community spaces, teams, and topical rooms belong here."
      highlights={[
        "Use Hives as containers for sub-communities and focused conversations.",
        "Prepare the route for membership, moderation, and role features later.",
        "Keep the route visually aligned with the rest of the authenticated app.",
      ]}
      icon={Hexagon}
    />
  );
}

export default Hives;
