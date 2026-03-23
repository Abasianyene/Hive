import { Archive } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function Memories() {
  return (
    <FeaturePage
      title="Memories"
      description="Archive past highlights, anniversaries, and resurfaced content in one route."
      highlights={[
        "Use the route for timeline resurfacing or year-in-review moments.",
        "Pair memory cards with comments or reactions later if needed.",
        "Keep archived content discoverable without cluttering the main feed.",
      ]}
      icon={Archive}
    />
  );
}

export default Memories;
