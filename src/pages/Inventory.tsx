import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InventoryDTO, getInventories } from "../api/inventoryApi";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import {
  FaEdit,
  FaTrashAlt,
  FaBoxOpen,
  FaExclamationTriangle,
} from "react-icons/fa";
import { CalendarDays } from "lucide-react";
import { LoadingModal } from "../components/ui/LoadingModal";

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await getInventories();
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleCreateInventory = () => {
    navigate("/create-inventory");
  };

  const handleEditInventory = (id: number) => {
    navigate(`/update-inventory/${id}`);
  };

  if (loading) {
    return <LoadingModal />;
  }

  return (
    <div className="text-black dark:text-white p-3">
      <HeaderWithActions
        title={t("inventory.list")}
        onCreate={handleCreateInventory}
        createLabel={t("inventory.add_item")}
      />

      <div className="overflow-x-auto shadow-md sm:rounded-lg mt-4">
        <table className="min-w-full text-left text-lg font-light">
          <thead className="border-b bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
            <tr>
              <th className="px-6 py-3">{t("inventory.item")}</th>
              <th className="px-6 py-3">{t("inventory.amount")}</th>
              <th className="px-6 py-3">{t("inventory.warning_level")}</th>
              <th className="px-6 py-3">{t("inventory.last_update")}</th>
              <th className="px-6 py-3">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((inv) => (
              <tr
                key={inv.id}
                className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 w-full"
              >
                <td className="px-6 py-4 whitespace-nowrap inline-flex gap-2 items-center">
                  <FaBoxOpen />
                  {inv.item}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">{inv.amount}</td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center gap-2">
                    <FaExclamationTriangle className="text-yellow-500" />
                    {inv.warningLevel}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap inline-flex gap-2 items-center">
                  <CalendarDays className="text-blue-500 " />
                  {inv.lastUpdate
                    ? new Date(inv.lastUpdate).toLocaleString("es-ES", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "N/A"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() =>
                        inv.id !== undefined && handleEditInventory(inv.id)
                      }
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
