import { FileText } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function Pages() {
  return (
    <FeaturePage
      title="Pages"
      description="Use Pages for brands, creators, and organizations that need a public identity."
      highlights={[
        "Reserve space for page setup, management, and publishing tools.",
        "Treat pages differently from personal profiles and Hives.",
        "Present the route with the same production-ready shell as the rest of the app.",
      ]}
      icon={FileText}
    />
  );
}

export default Pages;
