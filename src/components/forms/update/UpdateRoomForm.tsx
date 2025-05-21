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
  tenantDTO: TenantDTO;
}

const UpdateRoomForm = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Omit<Room, "id">>({
    number: "",
    type: "",
    capacity: "",
    baseRate: "",
    state: "",
    tenantDTO: { id: 0 },
  });
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateRoom(Number(id), { ...room, tenantDTO: room.tenantDTO ?? null });
      navigate("/rooms");
    } catch (err) {
      console.error("Failed to update room", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-10">
        <Loader2 className="animate-spin mr-2" />
        {t("loading")}
      </div>
    );
  }

  return (
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
  );
};

export default UpdateRoomForm;
