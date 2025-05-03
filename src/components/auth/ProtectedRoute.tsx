import { jwtDecode } from "jwt-decode";
import { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

// Type for the decoded JWT token
interface DecodedToken {
  exp: number;  // Expiration time in seconds
  [key: string]: unknown;  // Any additional fields you may have in your token
}

interface ProtectedRouteProps {
  children: JSX.Element;  // The children prop should be a single JSX element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { t } = useTranslation();

  const token = localStorage.getItem("token");

  const isTokenValid = (): boolean => {
    if (!token) return false;
    try {
      const decoded: DecodedToken = jwtDecode(token); // Properly type the decoded token
      const now = Date.now() / 1000;  // Current time in seconds
      return decoded.exp > now;  // Check if the token is expired
    } catch (error) {
      console.error("Error decoding the token:", error);
      return false;
    }
  };

  if (!token || !isTokenValid()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ error: t("login.login_failed") }}
      />
    );
  }

  return children;  // If valid, return the children components
};

export default ProtectedRoute;
