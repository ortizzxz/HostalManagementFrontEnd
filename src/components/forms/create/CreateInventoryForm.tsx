import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInventory, InventoryDTO } from "../../../api/inventoryApi";
import {
  FaBoxOpen,
  FaHashtag,
  FaExclamationTriangle,
} from "react-icons/fa";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

type FormData = Omit<InventoryDTO, "id" | "lastUpdate">;

const CreateInventoryForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    item: "",
    amount: 0,
    warningLevel: 0,
    tenant: Number(localStorage.getItem("tenantId")) || 0,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "item" ? value : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.item || !formData.amount || !formData.warningLevel) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await createInventory(formData);
      setSuccessMessage("Inventory item created successfully!");

      setTimeout(() => {
        navigate("/inventory");
      }, 1500);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage("Failed to create inventory item. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-5 border mt-4 border-gray-600 bg-white dark:bg-gray-900 rounded-xl shadow-xl relative">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white tracking-tight">
        Create Inventory Item
      </h2>

      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-5 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs">
          <XCircleIcon className="w-6 h-6 flex-shrink-0" />
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            aria-label="Close error"
            className="font-bold text-xl leading-none hover:text-red-600 dark:hover:text-red-400"
          >
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div className="fixed top-6 right-6 z-50 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-5 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs">
          <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 text-gray-800 dark:text-gray-200"
      >
        {/* Item Name */}
        <div>
          <label htmlFor="item" className="block mb-2 font-semibold">
            Item Name
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
              <FaBoxOpen className="w-5 h-5" />
            </div>
            <input
              id="item"
              name="item"
              type="text"
              value={formData.item}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block mb-2 font-semibold">
            Amount
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
              <FaHashtag className="w-5 h-5" />
            </div>
            <input
              id="amount"
              name="amount"
              type="number"
              min={0}
              value={formData.amount}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
        </div>

        {/* Warning Level */}
        <div>
          <label htmlFor="warningLevel" className="block mb-2 font-semibold">
            Warning Level
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-yellow-500">
              <FaExclamationTriangle className="w-5 h-5" />
            </div>
            <input
              id="warningLevel"
              name="warningLevel"
              type="number"
              min={0}
              value={formData.warningLevel}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 transition duration-200"
        >
          {loading ? "Creating..." : "Create Inventory Item"}
        </button>
      </form>
    </div>
  );
};

export default CreateInventoryForm;
