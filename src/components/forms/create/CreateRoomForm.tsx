import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Card, CardContent } from "../../ui/card.js";
import { Loader2 } from "lucide-react";
import { createRoom } from "../../../api/roomApi.js";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface RoomFormData {
  number: string;
  type: string;
  capacity: string;
  baseRate: string;
  state: "DISPONIBLE";
}

type RoomFormErrors = Partial<Record<keyof RoomFormData, string>>;

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

  // --- Single field validation ---
  const validateField = (name: keyof RoomFormData, value: string): string | undefined => {
    switch (name) {
      case "number":
        if (!value.trim()) return "⚠️ Room number is required.";
        break;
      case "type":
        if (!value.trim()) return "⚠️ Room type is required.";
        if (value.trim().length <= 4 ) return "⚠️ Room Type should be self-explanatory.";
        break;
      case "capacity":
        if (!value || isNaN(Number(value)))
        return "⚠️ Valid capacity is required.";
        if (Number(value) <= 0 || Number(value) > 20)
        return "⚠️ Capacity not allowed (1 - 20).";
        break;
      case "baseRate":
        if (!value || isNaN(Number(value)) || Number(value) <= 0 )
          return "⚠️ Valid base rate is required.";
        break;
      default:
        return undefined;
    }
    return undefined;
  };

  // --- Validate all fields ---
  const validateForm = (): boolean => {
    const newErrors: RoomFormErrors = {};
    (Object.keys(formData) as (keyof RoomFormData)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Live validation on input change ---
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate this field only
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name as keyof RoomFormData, value),
    }));
  };

  // --- Submit handler ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError(null);

    const tenantId = Number(localStorage.getItem("tenantId"));

    try {
      console.log('Tenant ID: ', tenantId);
      await createRoom({
        number: formData.number.trim(),
        type: formData.type.trim(),
        capacity: Number(formData.capacity),
        baseRate: Number(formData.baseRate),
        state: formData.state,
        tenant: { id: tenantId },
      });

      alert("🏨 Room created successfully!");
      setFormData({
        number: "",
        type: "",
        capacity: "",
        baseRate: "",
        state: "DISPONIBLE",
      });
      setErrors({});
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
