import { Cake } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function Birthday() {
  return (
    <FeaturePage
      title="Birthdays"
      description="Keep track of upcoming milestones and make outreach easier."
      highlights={[
        "Collect birthday reminders for your network in one view.",
        "Pair reminders with messages or event planning later.",
        "Use this screen as a lightweight engagement calendar.",
      ]}
      icon={Cake}
    />
  );
}

export default Birthday;
