import { KeyRound, Languages, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "./auth/UserContext";
import { changePassword } from "../api/userApi";

const ConfigModal = () => {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const email = user ? user.email : "nomail@mail.com";
  const [isOpen, setIsOpen] = useState(false); // Track modal visibility
  const [activeTab, setActiveTab] = useState("languages"); // Track active tab (default: languages)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Initialize language and theme on app load
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLanguage);

    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [i18n]);

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);

      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Toggle modal visibility
  const toggleModal = () => setIsOpen((prev) => !prev);

  // Change language
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  // Change theme
  const handleThemeChange = (theme: "light" | "dark") => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const handleChangePassword = async () => {
    try {
      await changePassword(email, oldPassword, newPassword);  
      setPasswordMessage(t("modal.passwordSuccess"));
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setPasswordMessage(t("modal.passwordError"));
    }
  };

  // Helper for tab button classes
  const getTabClass = (tab: string) =>
    `px-4 py-2 w-1/3 text-center ${
      activeTab === tab ? "bg-gray-600" : "bg-gray-700"
    }`;

  // Render tab content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case "languages":
        return (
          <div className="space-y-3">
            <button
              onClick={() => handleLanguageChange("en")}
              className="w-full px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center"
            >
              <Languages className="mr-2" />
              {t("modal.english")}
            </button>
            <button
              onClick={() => handleLanguageChange("es")}
              className="w-full px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center"
            >
              <Languages className="mr-2" />
              {t("modal.spanish")}
            </button>
          </div>
        );
      case "theme":
        return (
          <div className="space-y-3">
            <button
              onClick={() => handleThemeChange("light")}
              className="w-full px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center"
            >
              <Sun className="mr-2" />
              {t("modal.lightTheme")}
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className="w-full px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center"
            >
              <Moon className="mr-2" />
              {t("modal.darkTheme")}
            </button>
          </div>
        );
      case "password":
        return (
          <div className="space-y-3">
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder={t("modal.oldPassword")}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-300"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("modal.newPassword")}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-300"
            />
            <button
              onClick={handleChangePassword}
              className="w-full px-4 py-2 bg-green-600 rounded hover:bg-green-700 flex items-center justify-center"
            >
              <KeyRound className="mr-2" />
              {t("modal.changePassword")}
            </button>
            {passwordMessage && (
              <div className="text-center text-sm mt-2">{passwordMessage}</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Modal - only show when isOpen is true */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-gray-800 dark:bg-gray-900 text-white rounded-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/3 p-6 border border-gray-900 dark:border-gray-600">
            <h3 id="modal-title" className="text-xl font-semibold mb-4">
              {t("modal.settings")}
            </h3>

            {/* Tab Navigation */}
            <div className="flex border-b-2 border-gray-600 mb-4">
              <button
                onClick={() => setActiveTab("languages")}
                className={getTabClass("languages") + " rounded-tl-lg"}
              >
                {t("modal.languages")}
              </button>
              <button
                onClick={() => setActiveTab("theme")}
                className={getTabClass("theme")}
              >
                {t("modal.theme")}
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={getTabClass("password") + " rounded-tr-lg"}
              >
                {t("modal.password")}
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-4">{renderTabContent()}</div>

            {/* Close Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {t("modal.close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Button to open the modal */}
      <button
        onClick={toggleModal}
        className="w-1/2  py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ⚙️
      </button>
    </>
  );
};

export default ConfigModal;
