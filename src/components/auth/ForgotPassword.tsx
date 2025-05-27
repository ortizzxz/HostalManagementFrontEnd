import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { sendPasswordResetEmail } from "../../api/userApi";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await sendPasswordResetEmail(email);
      setMessage(t("login.reset_email_sent"));
    } catch (err) {
      setError(t("login.reset_email_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <form
        onSubmit={handleSubmit}
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
        <h2 className="text-2xl font-semibold mb-6">
          {t("login.forgot_password")}
        </h2>
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
        {message && <p className="text-green-500 mt-2 text-sm">{message}</p>}
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? t("login.wait") : t("login.send_reset_link")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full mt-2"
          onClick={() => navigate("/login")}
        >
          {t("login.back_to_login")}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
