import { Store } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function Market() {
  return (
    <FeaturePage
      title="Buzz-Market"
      description="A cleaner shell for catalog, commerce, and creator storefront ideas."
      highlights={[
        "Use the page for listings, featured drops, or promotional placements.",
        "Keep future checkout and fulfillment work separate from the feed.",
        "Ship a coherent market surface now instead of a dead-end placeholder.",
      ]}
      icon={Store}
    />
  );
}

export default Market;
