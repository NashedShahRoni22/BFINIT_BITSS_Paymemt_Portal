import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // Show nothing or a loader while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/" />;
}
