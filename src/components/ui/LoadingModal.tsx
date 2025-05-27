import { useTranslation } from "react-i18next";

export const LoadingModal = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-800 dark:text-white text-lg font-medium">
          {t("common.loading")}
        </p>
      </div>
    </div>
  );
};
