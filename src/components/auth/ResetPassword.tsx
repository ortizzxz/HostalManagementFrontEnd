import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const AUTH_URL = import.meta.env.VITE_API_AUTH_RECOVER;

const ResetPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    try {
      const response = await axios.post(`${AUTH_URL}${token}`, { password });
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(t("auth.expired_token"));
      }
    } catch (err) {
      setError(t("auth.expired_token"));
    }
  };

  if (!token)
    return <div className="text-center text-red-600">{t("auth.invalid")}</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <img
            src="/images/eh_logo.png"
            alt="Logo"
            className="w-48 h-auto mx-auto"
          />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          {t("auth.reset_password")}
        </h2>
        {success ? (
          <div className="text-green-600 text-center">
            {t("auth.succesful_reset")}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder={t("auth.new_password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder={t("auth.confirm_password")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {t("auth.set_password")}
            </button>
            {error && (
              <div className="text-red-600 text-sm text-center mt-2">
                {error}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
