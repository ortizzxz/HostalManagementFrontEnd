import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { t } = useTranslation();
  
  const token = localStorage.getItem("token");

  const isTokenValid = () => {
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch {
      return false;
    }
  };

  if (!token || !isTokenValid()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ error: t('login.login_failed') }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
