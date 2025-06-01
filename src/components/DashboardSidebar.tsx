import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BookOpen, 
  Upload, 
  BarChart, 
  Settings, 
  LogOut,
  Users,
  ClipboardList,
  GraduationCap,
  BookCheck,
  UserCircle,
  UsersRound,
  UserPlus
} from "lucide-react";

const DashboardSidebar = ({ profile }) => {
  const location = useLocation();
  const isTeacher = profile?.role === "teacher";
  const isParent = profile?.role === "parent";

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />
    },
    ...(isTeacher ? [
      {
        name: "Student Management",
        href: "/dashboard/students",
        icon: <Users className="h-5 w-5" />
      },
      {
        name: "Student Accounts",
        href: "/dashboard/student-accounts",
        icon: <UserPlus className="h-5 w-5" />
      },
      {
        name: "Assignments",
        href: "/dashboard/assignments",
        icon: <ClipboardList className="h-5 w-5" />
      },
      {
        name: "Lesson Plans",
        href: "/dashboard/lessons",
        icon: <BookOpen className="h-5 w-5" />
      },
      {
        name: "Upload Work",
        href: "/dashboard/upload",
        icon: <Upload className="h-5 w-5" />
      }
    ] : isParent ? [
      {
        name: "Parent Dashboard",
        href: "/dashboard/parent",
        icon: <UserCircle className="h-5 w-5" />
      },
      {
        name: "Children",
        href: "/dashboard/parent",
        icon: <UsersRound className="h-5 w-5" />
      }
    ] : [
      // Student only sees assignments and upload functionality
      {
        name: "My Assignments",
        href: "/dashboard/my-assignments",
        icon: <BookCheck className="h-5 w-5" />
      },
      {
        name: "Upload Work",
        href: "/dashboard/upload",
        icon: <Upload className="h-5 w-5" />
      }
    ]),
    // Settings is visible to everyone
    {
      name: "Settings",
      href: "/dashboard/settings",
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
      <div className="p-4 border-t border-border">
        <div className="mb-4 px-3">
          <div className="text-sm font-medium">{profile?.full_name || "User"}</div>
          <div className="text-xs text-muted-foreground">{profile?.email || "user@example.com"}</div>
          <div className="text-xs text-mama-purple mt-1 capitalize">{profile?.role || "user"}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
