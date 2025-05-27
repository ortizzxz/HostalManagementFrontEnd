import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";

const Guests = () => {
  const { t } = useTranslation();

  const handleCreateReservation = () => {
  };

  const handleUpdateReservation = () => {
  };

  return (
    <div className="text-black dark:text-white p-3">
      {/* Header with actions */}
      <HeaderWithActions
        title={t("guest.list")}
        onCreate={handleCreateReservation}
        onUpdate={handleUpdateReservation}
        updateLabel={t("guest.update")}
      />
    </div>
  );
};

export default Guests;
