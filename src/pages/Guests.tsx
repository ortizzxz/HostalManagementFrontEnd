import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";

const Guests = () => {
  const { t } = useTranslation();

  const handleCreateReservation = () => {
    console.log("Creando");
  };

  const handleUpdateReservation = () => {
    console.log("Actualizando");
  };

  const handleDeleteReservation = () => {
    console.log("Borrando");
  };

  return (
    <div className="text-black dark:text-white">
      {/* Header with actions */}
      <HeaderWithActions
        title={t("guest.list")}
        onCreate={handleCreateReservation}
        onUpdate={handleUpdateReservation}
        onDelete={handleDeleteReservation}
        updateLabel={t("guest.update")}
        deleteLabel={t("guest.delete")}
      />
    </div>
  );
};

export default Guests;
