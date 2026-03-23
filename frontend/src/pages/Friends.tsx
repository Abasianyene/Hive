import { Users } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function Friends() {
  return (
    <FeaturePage
      title="Friends"
      description="Review your network and make future connection features easy to expand."
      highlights={[
        "Use this space for relationship management and people discovery.",
        "Surface shared interests, activity, and follow-up opportunities.",
        "Keep the route polished now so deeper social graph work has a clean base.",
      ]}
      icon={Users}
    />
  );
}

export default Friends;
