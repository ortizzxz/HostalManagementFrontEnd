import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getRooms, updateRoom } from "../../../api/roomApi";
import {
  Hash,
  Building2,
  Users,
  DollarSign,
  Settings,
  Loader2,
  Save,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface TenantDTO {
  id: number;
}

export interface Room {
  id: number;
  number: string | number;
  type: string;
  capacity: string | number;
  baseRate: string | number;
  state: string;
  tenant: TenantDTO;
}

const UpdateRoomForm = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Omit<Room, "id">>({
    number: "",
    type: "",
    capacity: "",
    baseRate: "",
    state: "",
    tenant: { id: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const allRooms = await getRooms();
        const targetRoom = allRooms.find((r) => r.id === Number(id));
        if (targetRoom) {
          const { id: _, ...roomWithoutId } = targetRoom;
          setRoom(roomWithoutId);
        }
      } catch (err) {
        console.error("Error fetching room:", err);
        setErrorMessage(t("room.fetch_error") || "Error fetching room data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await updateRoom(Number(id), { ...room, tenant: room.tenant ?? null });
      setSuccessMessage(t("room.update_success") || "Room updated successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/rooms");
      }, 2000);
    } catch (err) {
      console.error("Failed to update room", err);
      setErrorMessage(t("room.update_error") || "Failed to update room. Please try again.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <div className="relative">
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-5 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs animate-fade-in">
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-5 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs animate-fade-in">
          <XCircle className="w-6 h-6 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center mt-10">
          <Loader2 className="animate-spin mr-2" />
          {t("loading")}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-xl border">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            {t("room.update")}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Number */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
                <Hash className="w-5 h-5" />
                {t("room.creation.number")}
              </label>
              <input
                type="text"
                name="number"
                value={room.number}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:text-black"
              />
            </div>

            {/* Room Type */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
                <Building2 className="w-5 h-5" />
                {t("room.creation.type")}
              </label>
              <input
                type="text"
                name="type"
                value={room.type}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:text-black"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
                <Users className="w-5 h-5" />
                {t("room.creation.capacity")}
              </label>
              <input
                type="number"
                name="capacity"
                value={room.capacity}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:text-black"
              />
            </div>

            {/* Base Rate */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
                <DollarSign className="w-5 h-5" />
                {t("room.creation.baserate")}
              </label>
              <input
                type="number"
                name="baseRate"
                value={room.baseRate}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:text-black"
              />
            </div>

            {/* Room State */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
                <Settings className="w-5 h-5" />
                {t("room.status")}
              </label>
              <select
                name="state"
                value={room.state}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:text-black"
              >
                <option value="DISPONIBLE">{t("room.state.available")}</option>
                <option value="OCUPADO">{t("room.state.busy")}</option>
                <option value="MANTENIMIENTO">{t("room.state.maintenance")}</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              <Save className="w-5 h-5" />
              {t("room.update")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateRoomForm;
