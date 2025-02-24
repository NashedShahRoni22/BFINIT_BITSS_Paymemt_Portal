import { Navigate } from "react-router";

export default function PrivateRoute({ children }) {
  const accessToken = localStorage.getItem("bfinitBlogAccessToken");

  return accessToken ? children : <Navigate to="/" />;
}
