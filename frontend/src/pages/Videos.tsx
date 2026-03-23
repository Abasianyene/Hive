import { Clapperboard } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function Videos() {
  return (
    <FeaturePage
      title="Videos"
      description="A cleaner home for video discovery, watch queues, and creator media."
      highlights={[
        "Keep long-form and short-form media separate from the main feed.",
        "Use the route for playback, playlists, or featured channels later.",
        "The page now looks intentional and matches the authenticated shell.",
      ]}
      icon={Clapperboard}
    />
  );
}

export default Videos;
