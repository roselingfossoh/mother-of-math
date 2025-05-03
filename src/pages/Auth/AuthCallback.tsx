import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading, then redirect
    if (!isLoading) {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/sign-in");
      }
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-lg text-mama-purple">Signing you in...</span>
    </div>
  );
};

export default AuthCallback;
