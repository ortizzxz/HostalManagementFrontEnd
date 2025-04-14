import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom";

const Rooms = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCreateReservation = () => {
    navigate("/create-room");
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
        title={t("room.list")}
        onCreate={handleCreateReservation}
        onUpdate={handleUpdateReservation}
        onDelete={handleDeleteReservation}
        createLabel={t("room.create")}
        updateLabel={t("room.update")}
        deleteLabel={t("room.delete")}
      />
    </div>
  );  };
  
  export default Rooms;
  