import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { loginUser } from "../../api/userApi"; // this handles token storage
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const location = useLocation();
  const routeState = location.state as { error?: string };
  const [error, setError] = useState<string | null>(routeState?.error || null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginUser(email, password); // token is stored inside loginUser
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (err) {
      setError(t('login.login_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-400"
      >
        <h2 className="text-2xl font-semibold mb-6">{t('login.login')}</h2>
        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            {t('login.email')}
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
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
             {t('login.password')}
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
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? t('login.wait') : t('login.enter')}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
