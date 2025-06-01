import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "./DashboardSidebar";
import StudentSidebar from "./StudentSidebar";

const exampleUser = {
  full_name: "Wobyeb Graphlain",
  email: "wobyeb@ebsaeafrica.org",
  role: "teacher"
};

const DashboardLayout = () => {
  const { profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in");
    }
  }, [isAuthenticated, navigate]);

  if (!profile) {
    return null;
  }

  const isStudent = profile.role === "student";

  return (
    <div className="flex min-h-screen bg-mama-light">
      {isStudent ? (
        <StudentSidebar profile={profile} />
      ) : (
        <DashboardSidebar profile={profile} />
      )}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
