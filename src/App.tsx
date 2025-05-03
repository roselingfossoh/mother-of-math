import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import AuthSuccess from "./pages/Auth/AuthSuccess";
import DashboardLayout from "./components/DashboardLayout";
import Overview from "./pages/Dashboard/Overview";
import Statistics from "./pages/Dashboard/Statistics";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/Auth/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Index />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/auth-success" element={<AuthSuccess />} />
            
            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="statistics" element={<Statistics />} />
              {/* More dashboard routes to be added later */}
              <Route path="upload" element={<Index />} />
              <Route path="lessons" element={<Index />} />
              <Route path="students" element={<Index />} />
              <Route path="settings" element={<Index />} />
            </Route>
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
