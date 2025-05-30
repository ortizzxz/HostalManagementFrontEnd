import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getInventories,
  InventoryDTO,
  updateInventory,
} from "../../../api/inventoryApi";

import {
  AlertTriangle,
  Loader2,
  Package,
  Hash,
  Bell,
  Save,
  PackageCheck,
  CheckCircleIcon,
} from "lucide-react";

const UpdateInventoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<Partial<InventoryDTO>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventories = await getInventories();
        const selected = inventories.find((i) => i.id === Number(id));
        if (!selected) {
          setError("Inventory item not found");
          return;
        }
        setInventory(selected);
      } catch (err) {
        console.error(err);
        setError("Failed to load inventory item");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInventory((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "warningLevel" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(null);
    try {
      if (
        id &&
        inventory.item &&
        inventory.amount !== undefined &&
        inventory.warningLevel !== undefined
      ) {
        const updatedData: InventoryDTO = {
          id: Number(id),
          tenant: Number(localStorage.getItem("tenantId")),
          item: inventory.item,
          amount: inventory.amount,
          warningLevel: inventory.warningLevel,
          lastUpdate: new Date(),
        };

        await updateInventory(Number(id), updatedData);
        setSuccessMessage("Inventory item updated successfully!");

        setTimeout(() => {
          navigate("/inventory");
        }, 1500); // Delay before navigating
      } else {
        setError("Please complete all fields.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update inventory item");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-10">
        <Loader2 className="animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center mt-10 text-red-600">
        <AlertTriangle className="mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border">
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-5 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs">
          <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white flex items-center justify-center gap-2">
        <PackageCheck className="w-6 h-6" />
        Update Inventory Item
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Item name */}
        <div>
          <label className="flex items-center gap-2 font-medium mb-1 text-gray-700 dark:text-gray-200">
            <Package className="w-5 h-5" />
            Item Name
          </label>
          <input
            type="text"
            name="item"
            value={inventory.item || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg dark:text-black"
            placeholder="Enter item name"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="flex items-center gap-2 font-medium mb-1 text-gray-700 dark:text-gray-200">
            <Hash className="w-5 h-5" />
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={inventory.amount || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg dark:text-black"
            placeholder="Enter amount"
            required
          />
        </div>

        {/* Warning Level */}
        <div>
          <label className="flex items-center gap-2 font-medium mb-1 text-gray-700 dark:text-gray-200">
            <Bell className="w-5 h-5" />
            Warning Level
          </label>
          <input
            type="number"
            name="warningLevel"
            value={inventory.warningLevel || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg dark:text-black"
            placeholder="Enter warning level"
            required
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateInventoryForm;
