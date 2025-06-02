import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Card, CardContent } from "../../ui/card.js";
import { Loader2, Megaphone, Edit, FileText, Calendar, Save } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createAnnouncement } from "../../../api/anouncementApi.js";
import { useTranslation } from "react-i18next";

interface TenantDTO {
  id: number;
}

interface AnnouncementFormData {
  title: string;
  content: string;
  postDate: Date;
  expirationDate: Date | null;
}

type FormErrors = Partial<Record<keyof AnnouncementFormData, string>>;

const CreateAnnouncementForm: React.FC = () => {
  const tenantId = Number(localStorage.getItem("tenantId"));
  const { t } = useTranslation();
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: "",
    content: "",
    postDate: new Date(),
    expirationDate: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = t("error.title_required");
    else if (formData.title.length <= 4) newErrors.title = t("error.title_min_size");

    if (!formData.content.trim()) newErrors.content = t("error.content_required");
    else if (formData.content.length <= 15) newErrors.content = t("error.content_min_size");

    if (!formData.expirationDate) newErrors.expirationDate = t("error.expiration_required");

    setErrors(newErrors);
  }, [formData, t]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, expirationDate: date }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement>
  ) => {
    const name = e.currentTarget.getAttribute("name");
    if (name) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const getBorderClass = (field: keyof AnnouncementFormData) => {
    if (errors[field] && touched[field]) return "border-red-500";
    if (!errors[field] && touched[field]) return "border-green-500";
    return "border-gray-300";
  };

  const shouldShowError = (field: keyof AnnouncementFormData) =>
    errors[field] && touched[field];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      content: true,
      expirationDate: true,
    });
    if (!isValid) return;

    setLoading(true);
    setApiError(null);

    const tenant: TenantDTO = { id: tenantId };
    const announcementPayload = {
      ...formData,
      postDate: formData.postDate.toISOString(),
      expirationDate: formData.expirationDate!.toISOString(),
      tenant,
    };

    try {
      await createAnnouncement(announcementPayload);
      alert("📣 Announcement created successfully!");
      setFormData({
        title: "",
        content: "",
        postDate: new Date(),
        expirationDate: null,
      });
      setTouched({});
    } catch (error) {
      console.error("Error on creating announcement", error);
      setApiError("❌ Failed to create announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Card className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <h1 className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white text-center mb-6">
          <Megaphone className="w-6 h-6" />
          {t("announcement.create")}
        </h1>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label
                htmlFor="title"
                className="flex items-center gap-1 text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                <Edit className="w-4 h-4" />
                {t("announcement.title")}
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`p-3 rounded-md dark:bg-gray-900 focus:ring-2 focus:outline-none ${getBorderClass(
                  "title"
                )}`}
                placeholder={t("announcement.title_placeholder")}
              />
              {shouldShowError("title") && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <Label
                htmlFor="content"
                className="flex items-center gap-1 text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                <FileText className="w-4 h-4" />
                {t("announcement.content")}
              </Label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full h-28 p-3 rounded-md border dark:bg-gray-900 resize-none focus:ring-2 focus:outline-none ${getBorderClass(
                  "content"
                )}`}
                placeholder={t("announcement.content_placeholder")}
              />
              {shouldShowError("content") && (
                <p className="text-red-500 text-xs mt-1">{errors.content}</p>
              )}
            </div>

            {/* Expiration Date */}
            <div>
              <Label
                htmlFor="expirationDate"
                className="flex items-center gap-1 text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                <Calendar className="w-4 h-4" />
                {t("announcement.expiration_date")}
              </Label>
              <DatePicker
                id="expirationDate"
                selected={formData.expirationDate}
                onChange={handleDateChange}
                onBlur={handleBlur}
                name="expirationDate"
                className={`w-full p-3 border text-center rounded-md dark:bg-gray-900 text-black dark:text-white focus:ring-2 focus:outline-none ${getBorderClass(
                  "expirationDate"
                )}`}
                dateFormat="dd-MM-yyyy"
                minDate={new Date()}
                placeholderText={t("announcement.date_placeholder")}
              />
              {shouldShowError("expirationDate") && (
                <p className="text-red-500 text-xs mt-1">{errors.expirationDate}</p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <p className="text-red-500 text-sm text-center mt-3">{apiError}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3"
              disabled={loading || !isValid}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  {t("announcement.creating")}
                </>
              ) : (
                <>
                  <Save />
                  {t("announcement.create")}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAnnouncementForm;
