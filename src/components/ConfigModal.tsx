import { Bell, BellOff, Languages, Moon, Sun } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const ConfigModal = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false); // Track modal visibility
  const [activeTab, setActiveTab] = useState("languages"); // Track active tab (default: languages)

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
    const handleKeyDown = (event) => {
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
  const toggleModal = () => setIsOpen(!isOpen);

  // Change language
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  // Change theme
  const handleThemeChange = (theme) => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  // Helper for tab button classes
  const getTabClass = (tab) =>
    `px-4 py-2 w-1/3 text-center ${
      activeTab === tab ? "bg-gray-600" : "bg-gray-700"
    }`;

  // Render tab content
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
              <button onClick={() => setActiveTab("theme")} className={getTabClass("theme")}>
                {t("modal.theme")}
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={getTabClass("notifications") + " rounded-tr-lg"}
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
