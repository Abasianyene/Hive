import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { getStoredSession } from "./lib/session";
import AdCenter from "./pages/AdCenter";
import Birthday from "./pages/Birthday";
import Copilot from "./pages/Copilot";
import Event from "./pages/Event";
import ForgotPassword from "./pages/Forgot-Password";
import Friends from "./pages/Friends";
import FundRaiser from "./pages/FundRaiser";
import Games from "./pages/Games";
import Help from "./pages/Help";
import Hives from "./pages/Hives";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Market from "./pages/Market";
import Memories from "./pages/Memories";
import Messages from "./pages/Messages";
import Payment from "./pages/OrdersAndPayment";
import Pages from "./pages/Pages";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Saved from "./pages/Saved";
import Settings from "./pages/Settings";
import Videos from "./pages/Videos";

const authRoutes = new Set(["/login", "/register", "/forgot-password"]);

function App() {
  const location = useLocation();
  const hideLayout = authRoutes.has(location.pathname);
  const session = getStoredSession();

  if (hideLayout) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Header />
      <div className="app-content">
        <SideBar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/market" element={<Market />} />
            <Route path="/hives" element={<Hives />} />
            <Route path="/games" element={<Games />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/pages" element={<Pages />} />
            <Route path="/ordersAndPayments" element={<Payment />} />
            <Route path="/fundraiser" element={<FundRaiser />} />
            <Route path="/ads" element={<AdCenter />} />
            <Route path="/birthday" element={<Birthday />} />
            <Route path="/event" element={<Event />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/copilot" element={<Copilot />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
