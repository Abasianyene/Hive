import { Settings2 } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function Settings() {
  return (
    <FeaturePage
      title="Settings"
      description="Keep account, privacy, and platform preferences in a predictable place."
      highlights={[
        "Use the route for notification, appearance, and security settings.",
        "Pair it with profile management without mixing concerns.",
        "Ship a coherent settings surface now and expand controls incrementally.",
      ]}
      icon={Settings2}
    />
  );
}

export default Settings;
