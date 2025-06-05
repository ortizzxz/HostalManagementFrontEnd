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
import { jwtDecode } from "jwt-decode";
import { redirect, useNavigate } from "react-router-dom";
import { Loader2, User, AtSign, Lock, Repeat, CheckCircle, XCircle } from "lucide-react"; // Icons
import { useTranslation } from "react-i18next";

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
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  let tenantId = 0;
  const { t } = useTranslation();
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Single field validation
  const validateField = (
    name: keyof FormFields,
    value: string,
    formData: FormFields
  ): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return t("error.name_req");
        break;
      case "lastname":
        if (!value.trim()) return t("error.lastname_req");
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) return t("error.email_req");
        break;
      case "password":
        if (value.length < 8) return t("error.password_lenght");
        break;
      case "repeatPassword":
        if (value !== formData.password) return t("error.password_match");
        break;
      case "rol":
        if (!value.trim()) return t("error.role_req");
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
        const updatedErrors = { ...prevErrors };

        if (currentError) {
          updatedErrors[name] = currentError;
        } else {
          delete updatedErrors[name];
        }

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

  const fields: {
    name: keyof Omit<FormFields, "tenant">;
    label: React.ReactNode;
    placeholder: string;
  }[] = [
    {
      name: "name",
      label: (
        <>
          <User className="inline-block mr-1 w-4 h-4" />
          {t("user.firstname")}
        </>
      ),
      placeholder: t("user.name_placeholder"),
    },
    {
      name: "lastname",
      label: (
        <>
          <User className="inline-block mr-1 w-4 h-4" />
          {t("user.lastname")}
        </>
      ),
      placeholder: t("user.lastname_placeholder"),
    },
    {
      name: "email",
      label: (
        <>
          <AtSign className="inline-block mr-1 w-4 h-4" />
          {t("user.email")}
        </>
      ),
      placeholder: t("user.email_placeholder"),
    },
    {
      name: "password",
      label: (
        <>
          <Lock className="inline-block mr-1 w-4 h-4" />
          {t("user.password")}
        </>
      ),
      placeholder: t("user.create_password_placeholder"),
    },
    {
      name: "repeatPassword",
      label: (
        <>
          <Repeat className="inline-block mr-1 w-4 h-4" />
          {t("user.repeat_password")}
        </>
      ),
      placeholder: t("user.confirm_password_placeholder"),
    },
  ];

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const { repeatPassword, ...userData } = formData;
      await createUser(userData);
      setSuccessMessage(t("user.created_successfully"));
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

      setTimeout(() => {
        navigate("/users-overview");
      }, 1500);
    } catch (error: any) {
      const message = error.response.data.message;
      console.log(message)
      if(message.includes("email in use")){
        setErrorMessage(t("user.email_in_use"));
      }else{
        setErrorMessage(t("user.failed_creation"));
      }
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
                    <SelectValue placeholder={t("user.select_role")} />
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Create User"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateUserForm;
