import React, { useState } from "react";
import { createUser } from "../../../api/userApi.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select.js";
import { Card, CardContent } from "../../ui/card.js";
import { Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { redirect } from "react-router-dom";

interface MyJwtPayload {
  tenantId?: string | number;
}

type FormFields = {
  name: string;
  lastname: string;
  email: string;
  password: string;
  repeatPassword: string;
  rol: string;
  tenant: number;
};

const CreateUserForm = () => {
  const token = localStorage.getItem("token") || "";
  let tenantId = 0;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = jwtDecode<MyJwtPayload>(token);
    tenantId = Number(decoded.tenantId) || 0;
  } catch (err) {
    console.error("Invalid token", err);
  }

  const [formData, setFormData] = useState<FormFields>({
    name: "",
    lastname: "",
    email: "",
    password: "",
    repeatPassword: "",
    rol: "",
    tenant: tenantId,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Single field validation
  const validateField = (
    name: keyof FormFields,
    value: string,
    formData: FormFields
  ): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "⚠️ Name is required.";
        break;
      case "lastname":
        if (!value.trim()) return "⚠️ Lastname is required.";
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) return "⚠️ Valid email is required.";
        break;
      case "password":
        if (value.length < 8)
          return "⚠️ Password must be at least 8 characters.";
        break;
      case "repeatPassword":
        if (value !== formData.password) return "⚠️ Passwords do not match.";
        break;
      case "rol":
        if (!value.trim()) return "⚠️ Role is required.";
        break;
    }
    return undefined;
  };

  // Full form validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    (Object.keys(formData) as (keyof FormFields)[]).forEach((key) => {
      if (key === "tenant") return;
      const error = validateField(key, formData[key], formData);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes with live validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      // Validate current field
      const currentError = validateField(
        name as keyof FormFields,
        value,
        newFormData
      );

      // Validate password match if changing password fields
      let repeatPasswordError: string | undefined;
      if (name === "password" || name === "repeatPassword") {
        const otherField = name === "password" ? "repeatPassword" : "password";
        repeatPasswordError = validateField(
          otherField,
          newFormData[otherField],
          newFormData
        );
      }

      setErrors((prevErrors) => {
        // Start with previous errors, but as a shallow copy
        const updatedErrors = { ...prevErrors };

        // Handle current field
        if (currentError) {
          updatedErrors[name] = currentError;
        } else {
          delete updatedErrors[name];
        }

        // Handle repeatPassword or password match error
        if (name === "password" || name === "repeatPassword") {
          const otherField =
            name === "password" ? "repeatPassword" : "password";
          if (repeatPasswordError) {
            updatedErrors[otherField] = repeatPasswordError;
          } else {
            delete updatedErrors[otherField];
          }
        }

        return updatedErrors;
      });

      return newFormData;
    });
  };

  // Handle select changes
  const handleSelectChange = (value: string) => {
    setFormData((prev) => {
      const newFormData = { ...prev, rol: value };
      setErrors((prevErrors) => {
        const error = validateField("rol", value, newFormData);
        const updatedErrors = { ...prevErrors };
        if (error) {
          updatedErrors.rol = error;
        } else {
          delete updatedErrors.rol;
        }
        return updatedErrors;
      });
      return newFormData;
    });
  };

  type FieldName = keyof Omit<FormFields, "tenant">;

  const fields: { name: FieldName; label: string; placeholder: string }[] = [
    { name: "name", label: "🧑 First Name", placeholder: "Enter first name" },
    { name: "lastname", label: "👤 Last Name", placeholder: "Enter last name" },
    { name: "email", label: "📧 Email", placeholder: "Enter email address" },
    {
      name: "password",
      label: "🔒 Password",
      placeholder: "Create a secure password",
    },
    {
      name: "repeatPassword",
      label: "🔁 Repeat Password",
      placeholder: "Confirm your password",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setApiError(null);
    try {
      const { repeatPassword, ...userData } = formData;
      await createUser(userData);
      alert("User created successfully!");
      setFormData({
        name: "",
        lastname: "",
        email: "",
        password: "",
        repeatPassword: "",
        rol: "",
        tenant: tenantId,
      });
      setErrors({});
    } catch (error) {
      setApiError("❌ Failed to create user. Please try again.");
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
            {fields.map(({ name, label, placeholder }) => (
              <div key={name}>
                <Label
                  htmlFor={name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2"
                >
                  {label}
                </Label>
                <Input
                  type={
                    name === "password" || name === "repeatPassword"
                      ? "password"
                      : "text"
                  }
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
              <Select value={formData.rol} onValueChange={handleSelectChange}>
                <SelectTrigger className={errors.rol ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a role" />
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
