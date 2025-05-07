import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "../ui/button.js";
import { Input } from "../ui/input.js";
import { Label } from "../ui/label.js";
import { Card, CardContent } from "../ui/card.js";
import { Loader2 } from "lucide-react";
import { createRoom } from "../../api/roomApi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// --- Form types ---
interface RoomFormData {
  number: string;
  type: string;
  capacity: string;
  baseRate: string;
  state: "DISPONIBLE";
}

type RoomFormErrors = Partial<Record<keyof RoomFormData, string>>;

// --- Component ---
const CreateRoomForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<RoomFormData>({
    number: "",
    type: "",
    capacity: "",
    baseRate: "",
    state: "DISPONIBLE",
  });

  const [errors, setErrors] = useState<RoomFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // --- Validation ---
  const validateForm = (): boolean => {
    const newErrors: RoomFormErrors = {};

    if (!formData.number.trim()) newErrors.number = "⚠️ Room number is required.";
    if (!formData.type.trim()) newErrors.type = "⚠️ Room type is required.";

    const capacityNum = Number(formData.capacity);
    if (!formData.capacity || isNaN(capacityNum) || capacityNum <= 0)
      newErrors.capacity = "⚠️ Valid capacity is required.";

    const baseRateNum = Number(formData.baseRate);
    if (!formData.baseRate || isNaN(baseRateNum) || baseRateNum <= 0)
      newErrors.baseRate = "⚠️ Valid base rate is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Handle input ---
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Submit handler ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError(null);

    const tenantId = Number(localStorage.getItem("tenantId"));

    try {
      await createRoom({
        number: formData.number.trim(),
        type: formData.type.trim(),
        capacity: Number(formData.capacity),
        baseRate: Number(formData.baseRate),
        state: formData.state,
        tenantDTO:{id: tenantId},
      });

      alert("🏨 Room created successfully!");
      setFormData({
        number: "",
        type: "",
        capacity: "",
        baseRate: "",
        state: "DISPONIBLE",
      });

      navigate("/rooms");
    } catch (error) {
      console.error("Error creating room:", error);
      setApiError("❌ Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          🛏️ {t("room.create")}
        </h1>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Room Number */}
            <div>
              <Label htmlFor="number" className="text-sm font-medium my-2 block">
                🔢 {t("room.creation.number")}
              </Label>
              <Input
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className={`p-2 dark:bg-gray-900 ${errors.number ? "border-red-500" : "border-gray-300"}`}
                placeholder="Room number"
              />
              {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
            </div>

            {/* Room Type */}
            <div>
              <Label htmlFor="type" className="text-sm font-medium my-2 block">
                🧾 {t("room.creation.type")}
              </Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`p-2 dark:bg-gray-900 ${errors.type ? "border-red-500" : "border-gray-300"}`}
                placeholder="Room type"
              />
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            {/* Capacity */}
            <div>
              <Label htmlFor="capacity" className="text-sm font-medium my-2 block">
                👥 {t("room.creation.capacity")}
              </Label>
              <Input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className={`p-2 dark:bg-gray-900 ${errors.capacity ? "border-red-500" : "border-gray-300"}`}
                placeholder="Capacity"
              />
              {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
            </div>

            {/* Base Rate */}
            <div>
              <Label htmlFor="baseRate" className="text-sm font-medium my-2 block">
                💰 {t("room.creation.price")}
              </Label>
              <Input
                type="number"
                id="baseRate"
                name="baseRate"
                value={formData.baseRate}
                onChange={handleChange}
                className={`p-2 dark:bg-gray-900 ${errors.baseRate ? "border-red-500" : "border-gray-300"}`}
                placeholder="Base rate"
              />
              {errors.baseRate && <p className="text-red-500 text-xs mt-1">{errors.baseRate}</p>}
            </div>

            {/* API Error */}
            {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : `🚪 ${t("room.creation.create")}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRoomForm;
