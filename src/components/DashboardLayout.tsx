import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";

const exampleUser = {
  full_name: "Wobyeb Graphlain",
  email: "wobyeb@ebsaeafrica.org",
  role: "teacher"
};

const DashboardLayout = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get example user from localStorage or fallback
    const stored = localStorage.getItem("exampleUser");
    setUser(stored ? JSON.parse(stored) : exampleUser);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-mama-light">
      <DashboardSidebar profile={user} />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
