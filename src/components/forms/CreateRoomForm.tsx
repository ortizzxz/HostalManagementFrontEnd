import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "../ui/button.js";
import { Input } from "../ui/input.js";
import { Label } from "../ui/label.js";
import { Card, CardContent } from "../ui/card.js";
import { Loader2, Hash, LayoutTemplate, Users, DollarSign } from "lucide-react";
import { createRoom } from "../../api/roomApi";
import { useTranslation } from "react-i18next";

interface RoomFormData {
  number: string;
  type: string;
  capacity: string;
  baseRate: string;
  state: "DISPONIBLE";
}

interface RoomFormErrors {
  number?: string;
  type?: string;
  capacity?: string;
  baseRate?: string;
}

const CreateRoomForm: React.FC = () => {
  const [formData, setFormData] = useState<RoomFormData>({
    number: "",
    type: "",
    capacity: "",
    baseRate: "",
    state: "DISPONIBLE",
  });

  const { t } = useTranslation();
  const [errors, setErrors] = useState<RoomFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: RoomFormErrors = {};

    if (!formData.number.trim()) newErrors.number = "Room number is required.";
    if (!formData.type.trim()) newErrors.type = "Room type is required.";

    const capacityNum = Number(formData.capacity);
    if (!formData.capacity || isNaN(capacityNum) || capacityNum <= 0) {
      newErrors.capacity = "Valid capacity is required.";
    }

    const baseRateNum = Number(formData.baseRate);
    if (!formData.baseRate || isNaN(baseRateNum) || baseRateNum <= 0) {
      newErrors.baseRate = "Valid base rate is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError(null);

    try {
      await createRoom({
        number: formData.number.trim(),
        type: formData.type.trim(),
        capacity: Number(formData.capacity),
        baseRate: Number(formData.baseRate),
        state: formData.state,
      });
      alert("🎉 Room created successfully!");
      setFormData({
        number: "",
        type: "",
        capacity: "",
        baseRate: "",
        state: "DISPONIBLE",
      });
    } catch (error) {
      console.error(error);
      setApiError("❌ Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          🏨 {t("room.create")}
        </h1>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Room Number */}
            <div>
              <Label htmlFor="number" className="text-gray-700 dark:text-gray-300 my-2 block">
                🔢 {t("room.creation.number")}
              </Label>
              <div className="relative">
                <Hash className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className={`pl-8 ${errors.number ? "border-red-500" : ""}`}
                  placeholder="Enter room number"
                />
              </div>
              {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
            </div>

            {/* Room Type */}
            <div>
              <Label htmlFor="type" className="text-gray-700 dark:text-gray-300 my-2 block">
                🛏️ {t("room.creation.type")}
              </Label>
              <div className="relative">
                <LayoutTemplate className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`pl-8 ${errors.type ? "border-red-500" : ""}`}
                  placeholder="Enter room type"
                />
              </div>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            {/* Capacity */}
            <div>
              <Label htmlFor="capacity" className="text-gray-700 dark:text-gray-300 my-2 block">
                👥 {t("room.creation.capacity")}
              </Label>
              <div className="relative">
                <Users className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className={`pl-8 ${errors.capacity ? "border-red-500" : ""}`}
                  placeholder="Enter capacity"
                />
              </div>
              {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
            </div>

            {/* Base Rate */}
            <div>
              <Label htmlFor="baseRate" className="text-gray-700 dark:text-gray-300 my-2 block">
                💰 {t("room.creation.price")}
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  id="baseRate"
                  name="baseRate"
                  value={formData.baseRate}
                  onChange={handleChange}
                  className={`pl-8 ${errors.baseRate ? "border-red-500" : ""}`}
                  placeholder="Enter base rate"
                />
              </div>
              {errors.baseRate && <p className="text-red-500 text-xs mt-1">{errors.baseRate}</p>}
            </div>

            {/* API Error */}
            {apiError && (
              <p className="text-red-500 text-sm text-center">{apiError}</p>
            )}

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
