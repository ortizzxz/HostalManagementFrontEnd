import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="p-3">
      <button className="mr-2 p-2 bg-gray-800 text-white rounded" onClick={() => changeLanguage("en")}>
        🇬🇧 EN
      </button>
      <button className="p-2 bg-gray-800 text-white rounded" onClick={() => changeLanguage("es")}>
        🇪🇸 ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;
