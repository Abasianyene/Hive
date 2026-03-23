import {
  Bookmark,
  Cake,
  Calendar,
  CircleHelp,
  Gamepad2,
  HandCoins,
  History,
  LayoutTemplate,
  LogOut,
  Megaphone,
  Settings,
  Sparkles,
  Store,
  UserRound,
  UsersRound,
  Video,
  WalletCards,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearStoredSession, getStoredSession } from "../lib/session";

const sidebarLinks = [
  { to: "/profile", icon: UserRound, label: "Profile" },
  { to: "/friends", icon: UsersRound, label: "Friends" },
  { to: "/hives", icon: UsersRound, label: "Hives" },
  { to: "/copilot", icon: Sparkles, label: "Copilot" },
  { to: "/saved", icon: Bookmark, label: "Saved" },
  { to: "/pages", icon: LayoutTemplate, label: "Pages" },
  { to: "/market", icon: Store, label: "Market" },
  { to: "/ordersAndPayments", icon: WalletCards, label: "Orders & Payments" },
  { to: "/fundraiser", icon: HandCoins, label: "Fundraiser" },
  { to: "/ads", icon: Megaphone, label: "Ad Center" },
  { to: "/birthday", icon: Cake, label: "Birthdays" },
  { to: "/event", icon: Calendar, label: "Events" },
  { to: "/memories", icon: History, label: "Memories" },
  { to: "/games", icon: Gamepad2, label: "Games" },
  { to: "/videos", icon: Video, label: "Videos" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/help", icon: CircleHelp, label: "Help" },
];

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = getStoredSession();

  const handleLogout = () => {
    clearStoredSession();
    navigate("/login");
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-profile-card">
        <div className="sidebar-profile-card__avatar">
          {session?.user.avatarUrl ? (
            <img src={session.user.avatarUrl} alt={session.user.username} />
          ) : (
            <UserRound size={24} />
          )}
        </div>
        <div>
          <strong>{session?.user.username || "Guest user"}</strong>
          <p>{session?.user.email || "Log in to unlock messaging and profile sync."}</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Sidebar navigation">
        <ul>
          {sidebarLinks.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;

            return (
              <li key={to}>
                <Link to={to} className={isActive ? "is-active" : ""}>
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button type="button" className="sidebar-logout" onClick={handleLogout}>
        <LogOut size={16} />
        <span>Log out</span>
      </button>
    </aside>
  );
}

export default SideBar;
