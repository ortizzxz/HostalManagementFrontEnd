import React, { useState } from "react";
import { createUser } from "../../api/userApi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Card, CardContent } from "../ui/card.js";
import { Loader2 } from "lucide-react";

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    rol: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.lastname.trim()) newErrors.lastname = "Lastname is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required.";
    }
    if (!formData.password.trim() || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!formData.rol.trim()) newErrors.rol = "Role is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setApiError(null);
    try {
      await createUser(formData);
      alert("User created successfully!");
      setFormData({ name: "", lastname: "", email: "", password: "", rol: "" });
    } catch (error) {
      setApiError("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Create New User
        </h1>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              {
                name: "name",
                label: "🧑 First Name",
                placeholder: "Enter first name",
              },
              {
                name: "lastname",
                label: "👤 Last Name",
                placeholder: "Enter last name",
              },
              {
                name: "email",
                label: "📧 Email",
                placeholder: "Enter email address",
              },
              {
                name: "password",
                label: "🔒 Password",
                placeholder: "Create a secure password",
              },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <Label
                  htmlFor={name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2"
                >
                  {label}
                </Label>
                <Input
                  type={name === "password" ? "password" : "text"}
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`dark:bg-gray-900 ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                  } border rounded-md p-2`}
                />
                {errors[name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                )}
              </div>
            ))}

            <div>
              <Label
                htmlFor="rol"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2"
              >
                Role
              </Label>
              <Select
                value={formData.rol}
                onValueChange={(value) =>
                  setFormData({ ...formData, rol: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Change role placeholder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="recepcion">Recepción</SelectItem>
                  <SelectItem value="limpieza">Limpieza</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="unknown">Sin Asignar</SelectItem>
                </SelectContent>
              </Select>
              {errors.rol && (
                <p className="text-red-500 text-xs mt-1">{errors.rol}</p>
              )}
            </div>

            {apiError && (
              <p className="text-red-500 text-sm text-center">{apiError}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Create User"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUserForm;
