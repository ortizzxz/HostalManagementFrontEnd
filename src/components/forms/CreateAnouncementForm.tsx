import React, { useState } from "react";
import { Button } from "../ui/button.js";
import { Input } from "../ui/input.js";
import { Label } from "../ui/label.js";
import { Card, CardContent } from "../ui/card.js";
import { Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createAnnouncement } from "../../api/anouncementApi";

// 🔐 Define types
type AnnouncementForm = {
  title: string;
  content: string;
  postDate: Date;
  expirationDate: Date | null;
  tenantId: number;
};

type FormErrors = Partial<Record<keyof AnnouncementForm, string>>;

const CreateAnouncementForm = () => {
  const [formData, setFormData] = useState<AnnouncementForm>({
    title: "",
    content: "",
    postDate: new Date(),
    expirationDate: null,
    tenantId: Number(localStorage.getItem("tenantId"))| 0
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null); // ✅ allow string or null

  // ✅ Validate form fields
  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "⚠️ Title is required.";
    if (!formData.content.trim()) newErrors.content = "⚠️ Content is required.";
    if (!formData.expirationDate)
      newErrors.expirationDate = "⚠️ Expiration date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setApiError(null);

    // Ensure expirationDate is a valid Date or string
    const announcementData = {
      ...formData,
      expirationDate: formData.expirationDate ?? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // two weeks from now
    };

    try {
      await createAnnouncement(announcementData);
      alert("📣 Announcement created successfully!");
      setFormData({
        title: "",
        content: "",
        postDate: new Date(),
        expirationDate: null, // Resetting expirationDate
        tenantId: Number(localStorage.getItem("tenantId"))| 0
      });
    } catch (error) {
      console.log("Error creating announcement: ", error);
      setApiError("❌ Failed to create announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center  p-4">
      <Card className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          📢 Create New Announcement
        </h1>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 my-2 block"
              >
                📝 Title
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`border rounded-md p-2 dark:bg-gray-900 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Change Title Placeholder"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <Label
                htmlFor="content"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 my-2 block"
              >
                ✏️ Content
              </Label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className={`w-full h-24 p-2 border rounded-md p-2 dark:bg-gray-900  shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.content ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Change Announcement Placeholder"
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content}</p>
              )}
            </div>

            {/* Expiration Date */}
            <div>
              <Label
                htmlFor="expirationDate"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 my-2 block "
              >
                📅 Expiration Date
              </Label>
              <DatePicker
                id="expirationDate"
                selected={formData.expirationDate}
                onChange={(date: Date | null) =>
                  setFormData({ ...formData, expirationDate: date })
                }
                className={`w-full border dark:bg-gray-900  p-2 border text-black dark:text-white text-center ${
                  errors.expirationDate ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                dateFormat="dd-MM-yyyy"
                minDate={new Date()}
                placeholderText="01/01/2025"
              />
              {errors.expirationDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.expirationDate}
                </p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <p className="text-red-500 text-sm text-center">{apiError}</p>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "🚀 Create Announcement"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAnouncementForm;
