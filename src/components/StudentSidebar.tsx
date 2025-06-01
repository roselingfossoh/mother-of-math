import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BookCheck, 
  Upload, 
  Settings,
  LogOut,
  GraduationCap,
  Award,
  FileText
} from "lucide-react";
import { UserProfile } from "@/context/AuthContext";

interface StudentSidebarProps {
  profile: UserProfile;
}

const StudentSidebar = ({ profile }: StudentSidebarProps) => {
  const location = useLocation();
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard/student-dashboard",
      icon: <Home className="h-5 w-5" />,
      description: "Your personal dashboard"
    },
    {
      name: "My Assignments",
      href: "/dashboard/my-assignments",
      icon: <BookCheck className="h-5 w-5" />,
      description: "View and complete assignments"
    },
    {
      name: "Submit Work",
      href: "/dashboard/upload",
      icon: <Upload className="h-5 w-5" />,
      description: "Upload your completed work"
    },
    {
      name: "My Progress",
      href: "/dashboard/student-progress",
      icon: <Award className="h-5 w-5" />,
      description: "View your learning progress"
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      description: "Manage your account"
    }
  ];

  return (
    <div className="w-64 border-r border-border bg-gradient-to-b from-indigo-50 to-white flex flex-col h-screen">
      {/* Logo and App Name */}
      <div className="p-4 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
          M
        </div>
        <div>
          <span className="font-bold text-xl text-indigo-900">Math Mama</span>
          <div className="text-xs text-indigo-700">Student Portal</div>
        </div>
      </div>
      
      {/* Student Info Card */}
      <div className="mx-4 mb-6 p-3 bg-white rounded-lg shadow-sm border border-indigo-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">
            {profile?.full_name?.substring(0, 2).toUpperCase() || "ST"}
          </div>
          <div>
            <div className="font-medium text-sm">{profile?.full_name || "Student"}</div>
            <div className="text-xs text-muted-foreground">{profile?.grade_level || "Grade Level"}</div>
          </div>
        </div>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.href} to={item.href} className="block">
            <div
              className={cn(
                "flex items-center px-3 py-3 rounded-md transition-colors",
                location.pathname === item.href
                  ? "bg-indigo-100 text-indigo-900"
                  : "hover:bg-indigo-50 text-slate-700"
              )}
            >
              <div className={cn(
                "p-2 rounded-md mr-3",
                location.pathname === item.href
                  ? "bg-indigo-200 text-indigo-700"
                  : "bg-slate-100 text-slate-500"
              )}>
                {item.icon}
              </div>
              <div>
                <div className="font-medium text-sm">{item.name}</div>
                <div className="text-xs text-slate-500">{item.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </nav>
      
      {/* Help and Support */}
      <div className="p-4 border-t border-indigo-100">
        <Link to="/dashboard/help" className="flex items-center space-x-2 text-sm text-slate-600 hover:text-indigo-600">
          <FileText className="h-4 w-4" />
          <span>Help & Support</span>
        </Link>
        <Link to="/sign-out" className="flex items-center space-x-2 mt-3 text-sm text-slate-600 hover:text-indigo-600">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );
};

export default StudentSidebar;
