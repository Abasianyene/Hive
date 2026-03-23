import { HandCoins } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function FundRaiser() {
  return (
    <FeaturePage
      title="Fundraiser"
      description="Organize causes, campaign goals, and fundraising notes without leaving the app shell."
      highlights={[
        "Capture funding targets, owners, and campaign timelines.",
        "Prepare the page for future donation and payment integrations.",
        "Keep community initiatives visible next to content and messaging.",
      ]}
      icon={HandCoins}
    />
  );
}

export default FundRaiser;
