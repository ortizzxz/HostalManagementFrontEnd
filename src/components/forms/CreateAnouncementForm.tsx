import React, { useState } from "react";
import { Button } from "../ui/button.js";
import { Input } from "../ui/input.js";
import { Label } from "../ui/label.js";
import { Card, CardContent } from "../ui/card.js";
import { Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createAnnouncement } from "../../api/anouncementApi"; // Make sure your backend API method is correct

const CreateAnouncementForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    postDate: new Date(), // Set current date for postDate
    expirationDate: null, // Expiration date is initially null
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.content.trim()) newErrors.content = "Content is required.";
    if (!formData.expirationDate)
      newErrors.expirationDate = "Expiration date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setApiError(null);
    try {
      await createAnnouncement(formData); // Make sure the API method is correct
      alert("Announcement created successfully!");
      setFormData({
        title: "",
        content: "",
        postDate: new Date(),
        expirationDate: null,
      });
    } catch (error) {
      setApiError("Failed to create announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Create New Announcement
        </h1>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <Label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2"
              >
                Title
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`border-white bg-gray-900 ${errors.title ? "border-red-500" : ""}`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Content Field */}
            <div>
              <Label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2"
              >
                Content
              </Label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className={`w-full h-24 p-2 bg-gray-900 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.content ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter announcement content"
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content}</p>
              )}
            </div>

            {/* Expiration Date Picker */}
            <div>
              <Label
                htmlFor="expirationDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2"
              >
                Expiration Date
              </Label>
              <DatePicker
                id="expirationDate"
                selected={formData.expirationDate}
                onChange={(date) =>
                  setFormData({ ...formData, expirationDate: date })
                }
                className={`w-full bg-gray-900 p-2 border text-white text-center ${
                  errors.expirationDate ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                dateFormat="dd.MM.yyyy"
                minDate={new Date()} // Prevent past dates from being selected
                placeholderText="Select expiration date"
              />
              {errors.expirationDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.expirationDate}
                </p>
              )}
            </div>

            {/* API Error Message */}
            {apiError && (
              <p className="text-red-500 text-sm text-center">{apiError}</p>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create Announcement"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAnouncementForm;
