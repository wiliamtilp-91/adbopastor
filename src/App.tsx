import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import Calendar from "./pages/Calendar";
import LiveServices from "./pages/LiveServices";
import Retreat from "./pages/Retreat";
import Announcements from "./pages/Announcements";
import Gallery from "./pages/Gallery";
import BibleStudies from "./pages/BibleStudies";
import PrayerTestimonies from "./pages/PrayerTestimonies";
import WhatsAppButton from "./components/WhatsAppButton";
import NotFound from "./pages/NotFound";
import HomeWorship from "./pages/HomeWorship";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/live-services" element={<LiveServices />} />
          <Route path="/retreat" element={<Retreat />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/bible-studies" element={<BibleStudies />} />
          <Route path="/prayer-testimonies" element={<PrayerTestimonies />} />
          <Route path="/home-worship" element={<HomeWorship />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
