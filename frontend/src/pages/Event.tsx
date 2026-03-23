import { CalendarDays } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function Event() {
  return (
    <FeaturePage
      title="Events"
      description="Coordinate launches, meetups, and internal timelines from one dashboard."
      highlights={[
        "Capture event ideas, dates, and owner assignments quickly.",
        "Use it as the staging area for RSVP or reminder features later.",
        "Keep event planning visible alongside the rest of the product.",
      ]}
      icon={CalendarDays}
    />
  );
}

export default Event;
