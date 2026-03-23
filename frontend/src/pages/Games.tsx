import { Gamepad2 } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function Games() {
  return (
    <FeaturePage
      title="Games"
      description="Reserve a polished surface for lightweight engagement and social play."
      highlights={[
        "Keep room for mini-games, challenges, or leaderboard concepts.",
        "Use the same visual system as the rest of the app instead of a plain placeholder.",
        "Make the route safe to ship now even before gameplay features land.",
      ]}
      icon={Gamepad2}
    />
  );
}

export default Games;
