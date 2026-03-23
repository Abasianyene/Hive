import { Bookmark } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function Saved() {
  return (
    <FeaturePage
      title="Saved"
      description="Store posts, pages, and ideas that need a second pass later."
      highlights={[
        "Keep reviewable content separate from the primary feed.",
        "Use the page as the basis for bookmarks, collections, or reading lists.",
        "Give the route a real UI instead of leaving it as placeholder text.",
      ]}
      icon={Bookmark}
    />
  );
}

export default Saved;
