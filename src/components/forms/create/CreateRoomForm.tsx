import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Card, CardContent } from "../../ui/card.js";
import {
  Loader2,
  DoorOpen,
  Hash,
  ScrollText,
  Users,
  DollarSign,
  XCircle,
  CheckCircle,
} from "lucide-react";
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
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [successMessage, setSuccessMessage] = useState<string | null>("");

  const validateField = (
    name: keyof RoomFormData,
    value: string
  ): string | undefined => {
    switch (name) {
      case "number":
        if (!value.trim()) return "⚠️ Room number is required.";
        break;
      case "type":
        if (!value.trim()) return "⚠️ Room type is required.";
        if (value.trim().length <= 4)
          return "⚠️ Room Type should be self-explanatory.";
        break;
      case "capacity":
        if (!value || isNaN(Number(value)))
          return "⚠️ Valid capacity is required.";
        if (Number(value) <= 0 || Number(value) > 20)
          return "⚠️ Capacity not allowed (1 - 20).";
        break;
      case "baseRate":
        if (!value || isNaN(Number(value)) || Number(value) <= 0)
          return "⚠️ Valid base rate is required.";
        break;
      default:
        return undefined;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: RoomFormErrors = {};
    (Object.keys(formData) as (keyof RoomFormData)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name as keyof RoomFormData, value),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const tenantId = Number(localStorage.getItem("tenantId"));

    try {
      await createRoom({
        number: formData.number.trim(),
        type: formData.type.trim(),
        capacity: Number(formData.capacity),
        baseRate: Number(formData.baseRate),
        state: formData.state,
        tenant: { id: tenantId },
      });

      setSuccessMessage(t("room.success"));
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
      setSuccessMessage(t("room.fail"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
         {/* Floating notifications */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-5 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs">
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            aria-label="Close success message"
            className="font-bold text-xl leading-none hover:text-green-600 dark:hover:text-green-400"
          >
            ×
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-5 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs">
          <XCircle className="w-6 h-6 flex-shrink-0" />
          <span className="flex-grow">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            aria-label="Close error message"
            className="font-bold text-xl leading-none hover:text-red-600 dark:hover:text-red-400"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center flex items-center justify-center gap-2">
            <DoorOpen className="w-6 h-6" />
            {t("room.create")}
          </h1>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Room Number */}
              <div>
                <Label
                  htmlFor="number"
                  className="text-sm font-medium my-2 block flex items-center gap-2"
                >
                  <Hash className="w-4 h-4" />
                  {t("room.creation.number")}
                </Label>
                <Input
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className={`p-2 dark:bg-gray-900 ${
                    errors.number ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Room number"
                />
                {errors.number && (
                  <p className="text-red-500 text-xs mt-1">{errors.number}</p>
                )}
              </div>

              {/* Room Type */}
              <div>
                <Label
                  htmlFor="type"
                  className="text-sm font-medium my-2 block flex items-center gap-2"
                >
                  <ScrollText className="w-4 h-4" />
                  {t("room.creation.type")}
                </Label>
                <Input
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`p-2 dark:bg-gray-900 ${
                    errors.type ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Room type"
                />
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                )}
              </div>

              {/* Capacity */}
              <div>
                <Label
                  htmlFor="capacity"
                  className="text-sm font-medium my-2 block flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  {t("room.creation.capacity")}
                </Label>
                <Input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className={`p-2 dark:bg-gray-900 ${
                    errors.capacity ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Capacity"
                />
                {errors.capacity && (
                  <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>
                )}
              </div>

              {/* Base Rate */}
              <div>
                <Label
                  htmlFor="baseRate"
                  className="text-sm font-medium my-2 block flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  {t("room.creation.price")}
                </Label>
                <Input
                  type="number"
                  id="baseRate"
                  name="baseRate"
                  value={formData.baseRate}
                  onChange={handleChange}
                  className={`p-2 dark:bg-gray-900 ${
                    errors.baseRate ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Base rate"
                />
                {errors.baseRate && (
                  <p className="text-red-500 text-xs mt-1">{errors.baseRate}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <DoorOpen className="w-4 h-4" />
                )}
                {t("room.creation.create")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateRoomForm;
