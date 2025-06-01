import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import StudentSidebar from "./StudentSidebar";

const StudentDashboardLayout = () => {
  const { profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/student-login");
      return;
    }
    
    // Redirect to teacher dashboard if not a student
    if (profile && profile.role !== "student") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, profile, navigate]);

  // Show loading or redirect
  if (!isAuthenticated || !profile) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-mama-light">
      <StudentSidebar profile={profile} />
      <div className="flex-1 p-6">
        <Outlet /> {/* This is where nested student routes will be rendered */}
      </div>
    </div>
  );
};

export default StudentDashboardLayout; 