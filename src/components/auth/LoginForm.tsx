import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { loginUser } from "../../api/userApi";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const state = location.state as { error?: string };
    if (state?.error) {
      setError(state.error);
      // Clear the error from history after showing it once
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginUser(email, password);
      navigate("/dashboard");
      window.location.reload();
    } catch (err) {
      setError(t("login.login_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-400"
      >
        {/* Logo Section */}
        <div className="text-center mb-6">
          <img
            src="/images/eh_logo.png"
            alt="Logo"
            className="w-48 h-auto mx-auto"
          />
        </div>
        <h2 className="text-2xl font-semibold mb-6">{t("login.login")}</h2>
        <div>
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
          >
            {t("login.email")}
          </Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mt-4">
          <Label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
          >
            {t("login.password")}
          </Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mt-2 text-right">
          <button
            type="button"
            className="text-blue-600 hover:underline text-sm"
            onClick={() => navigate("/forgot-password")}
          >
            {t("login.forgot_password")}
          </button>
        </div>

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? t("login.logging") : t("login.enter")}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
