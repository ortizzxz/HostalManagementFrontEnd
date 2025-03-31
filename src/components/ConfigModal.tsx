import { Bell, BellOff, Languages, Moon, Sun } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ConfigModal = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false); // Track modal visibility
  const [activeTab, setActiveTab] = useState("languages"); // Track active tab (default: languages)

  // Toggle the modal open and closed
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  // Function to change language
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  // Function to change theme
  const handleThemeChange = (theme) => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark"); // Remove dark class for light mode
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark"); // Add dark class for dark mode
      localStorage.setItem("theme", "dark");
    }
  };

  // Render different settings based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "languages":
        return (
          <div className="space-y-3">
            <button
              onClick={() => handleLanguageChange("en")}
              className="w-full px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center"
            >
              <Languages className="mr-2"/>
              {t("modal.english")}
            </button>
            <button
              onClick={() => handleLanguageChange("es")}
              className="w-full px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center"
            >
              <Languages className="mr-2"/>
              {t("modal.spanish")}
            </button>
          </div>
        );
      case "theme":
        return (
          <div className="space-y-3">
            <button
              className="w-full px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center"
              onClick={() => handleThemeChange("light")}
            >
              <Sun className="mr-2" />
              {t("modal.lightTheme")}
            </button>

            <button
              className="w-full px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center"
              onClick={() => handleThemeChange("dark")}
            >
              <Moon className="mr-2" />
              {t("modal.darkTheme")}
            </button>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center">
              <Bell className="mr-2" />
              {t("modal.enableNotifications")}
            </button>
            <button className="w-full px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center">
              <BellOff className="mr-2" />
              {t("modal.disableNotifications")}
            </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 ">
          <div className="bg-gray-800 dark:bg-gray-900 text-white rounded-lg w-1/3 p-6 border border-gray-900 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-4">
              {t("modal.settings")}
            </h3>

            {/* Tab Navigation */}
            <div className="flex border-b-2 border-gray-600 mb-4">
              <button
                onClick={() => setActiveTab("languages")}
                className={`px-4 py-2 w-1/3 text-center ${activeTab === "languages" ? "bg-gray-600" : "bg-gray-700"} rounded-tl-lg`}
              >
                {t("modal.languages")}
              </button>
              <button
                onClick={() => setActiveTab("theme")}
                className={`px-4 py-2 w-1/3 text-center ${activeTab === "theme" ? "bg-gray-600" : "bg-gray-700"}`}
              >
                {t("modal.theme")}
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`px-4 py-2 w-1/3 text-center ${activeTab === "notifications" ? "bg-gray-600" : "bg-gray-700"} rounded-tr-lg`}
              >
                {t("modal.notifications")}
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
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-2"
      >
        ⚙️
      </button>
    </>
  );
};

export default ConfigModal;
