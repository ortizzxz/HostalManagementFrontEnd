import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getRooms, updateRoom } from "../../../api/roomApi";

interface TenantDTO {
  id: number;
}

// Define TypeScript interfaces for your data
export interface Room {
  id: number;
  number: string | number;
  type: string;
  capacity: string | number;
  baseRate: string | number;
  state: string;
  tenantDTO: TenantDTO; // Now tenant is a TenantDTO object
}

const UpdateRoomForm = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Omit<Room, "id">>({
    number: "",
    type: "",
    capacity: "",
    baseRate: "",
    state: "",
    tenantDTO: {
        id: 0,
    },
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
      await updateRoom(Number(id), {...room, tenantDTO: room.tenantDTO ?? null});
      navigate("/rooms");
    } catch (err) {
      console.error("Failed to update room", err);
    }
  };

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t("room.update")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">{t("room.creation.number")}</label>
          <input
            type="text"
            name="number"
            value={room.number}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">{t("room.creation.type")}</label>
          <input
            type="text"
            name="type"
            value={room.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">{t("room.creation.capacity")}</label>
          <input
            type="number"
            name="capacity"
            value={room.capacity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">{t("room.creation.baserate")}</label>
          <input
            type="number"
            name="baseRate"
            value={room.baseRate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">{t("room.status")}</label>
          <select
            name="state"
            value={room.state}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="DISPONIBLE">{t("room.state.available")}</option>
            <option value="OCUPADO">{t("room.state.busy")}</option>
            <option value="MANTENIMIENTO">{t("room.state.maintenance")}</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t("room.update")}
        </button>
      </form>
    </div>
  );
};

export default UpdateRoomForm;
