import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BookOpen, 
  Upload, 
  BarChart, 
  Settings,
  LogOut,
  FileText, // For assignments
  Brain, // For analysis results
} from "lucide-react";

const StudentDashboardSidebar = ({ profile }) => {
  const location = useLocation();

  // Define navigation items for students
  const navItems = [
    {
      name: "Dashboard",
      href: "/student/dashboard", // Using a different base path for student dashboard
      icon: <Home className="h-5 w-5" />
    },
    {
      name: "Assignments",
      href: "/student/assignments", // Assuming a dedicated assignments page for students
      icon: <FileText className="h-5 w-5" />
    },
    {
      name: "My Analysis",
      href: "/student/analysis", // Assuming a page to view their uploaded work analysis
      icon: <Brain className="h-5 w-5" />
    },
    // Add other student-specific links here
    {
      name: "Settings",
      href: "/student/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <div className="w-64 border-r border-border bg-white flex flex-col h-screen">
      <div className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-mama-purple flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="font-bold text-xl text-foreground">Math Mama</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} to={item.href}>
            <div
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                location.pathname === item.href
                  ? "bg-mama-purple text-white font-medium"
                  : "hover:bg-mama-purple/10 text-muted-foreground"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
      {/* Optional: Add student profile info at the bottom */}
      {/* <div className="p-4 border-t border-border">
        <div className="mb-4 px-3">
          <div className="text-sm font-medium">{profile?.full_name}</div>
          <div className="text-xs text-muted-foreground">{profile?.email}</div>
          <div className="text-xs text-mama-purple mt-1 capitalize">{profile?.role}</div>
        </div>
      </div> */}
    </div>
  );
};

export default StudentDashboardSidebar; 