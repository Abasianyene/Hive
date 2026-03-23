import { LifeBuoy } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function Help() {
  return (
    <FeaturePage
      title="Help"
      description="Support, onboarding, and troubleshooting should have a clear place in the product."
      highlights={[
        "Point users toward account, messaging, and deployment guidance.",
        "Use this route for documentation, FAQs, and support entry points.",
        "The page is now styled consistently instead of returning plain text.",
      ]}
      icon={LifeBuoy}
    />
  );
}

export default Help;
