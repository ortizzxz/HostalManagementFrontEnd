import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom";


const Reservations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCreateReservation = () => {
    navigate("/create-reservation");
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
