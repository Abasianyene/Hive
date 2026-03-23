import {
  Gamepad2,
  Home,
  MessageCircleMore,
  MonitorPlay,
  Search,
  Sparkles,
  Store,
  UserCircle2,
  UsersRound,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/bee-hive.png";
import { getStoredSession } from "../lib/session";

const primaryLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/videos", label: "Videos", icon: MonitorPlay },
  { to: "/market", label: "Market", icon: Store },
  { to: "/hives", label: "Hives", icon: UsersRound },
  { to: "/games", label: "Games", icon: Gamepad2 },
];

function Header() {
  const location = useLocation();
  const session = getStoredSession();

  return (
    <header className="site-header">
      <div className="site-header__brand">
        <div className="site-header__brand-mark">
          <img src={logo} alt="Hive logo" />
        </div>
        <div className="site-header__brand-copy">
          <span>Hive</span>
          <small>Community operating system</small>
        </div>
      </div>

      <div className="site-header__search">
        <Search size={18} />
        <input type="text" placeholder="Search people, spaces, updates" aria-label="Search Hive" />
      </div>

      <nav className="site-header__nav" aria-label="Primary navigation">
        {primaryLinks.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;

          return (
            <Link
              key={to}
              to={to}
              className={`site-header__nav-link${isActive ? " is-active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="site-header__actions">
        <div className="site-header__status">
          <span className="site-header__status-dot" />
          <span>Live workspace</span>
        </div>
        <Link to="/copilot" className="header-action-button">
          <Sparkles size={18} />
          <span>Copilot</span>
        </Link>
        <Link to="/messages" className="header-icon-button" aria-label="Messages">
          <MessageCircleMore size={18} />
        </Link>
        <Link to="/profile" className="header-profile-chip">
          {session?.user.avatarUrl ? (
            <img src={session.user.avatarUrl} alt={session.user.username} />
          ) : (
            <UserCircle2 size={24} />
          )}
          <span>{session?.user.username || "Guest"}</span>
        </Link>
      </div>
    </header>
  );
}

export default Header;
