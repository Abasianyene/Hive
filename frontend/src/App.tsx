import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import HomePage from "./pages/HomePage";
import Videos from "./pages/Videos";
import Market from "./pages/Market";
import Hives from "./pages/Hives";
import Games from "./pages/Games";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Saved from "./pages/Saved";
import Pages from "./pages/Pages";
import Payment from "./pages/OrdersAndPayment";
import FundRaiser from "./pages/FundRaiser";
import AdCenter from "./pages/AdCenter";
import Birthday from "./pages/Birthday";
import Event from "./pages/Event";
import Memories from "./pages/Memories";
import Copilot from "./pages/Copilot";
import Messages from "./pages/Messages";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";
  if (hideLayout) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f0f2f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <SideBar />
        <main style={{ flex: 1, background: "#f0f2f5" }}>
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
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            {/* Add other routes as needed */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;