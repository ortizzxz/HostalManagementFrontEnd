import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";


const Reservations = () => {
  const { t } = useTranslation();

  const handleCreateReservation = () => {
    console.log('Creando');
  }

  const handleUpdateReservation = () => {
    console.log('Actualizando');
  }
  
  const handleDeleteReservation = () => {
    console.log('Borrando');
  }

  return (
    <div className="text-black dark:text-white">
      {/* Header with actions */}
      <HeaderWithActions
        title={t("reservation.list")}
        onCreate={handleCreateReservation}
        onUpdate={handleUpdateReservation}
        onDelete={handleDeleteReservation}
        createLabel={t("reservation.create")}
        updateLabel={t("reservation.update")}
        deleteLabel={t("reservation.delete")}
      />
    </div>
  );
};

export default Reservations;
