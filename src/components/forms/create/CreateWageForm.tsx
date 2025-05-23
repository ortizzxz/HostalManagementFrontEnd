import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../../api/userApi";
import { getWages, createWage } from "../../../api/wageApi";

import {
  UserIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export interface UserDTO {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  rol: "ADMIN" | "RECEPCION" | "LIMPIEZA" | "MANTENIMIENTO" | "UNKNOWN"; // Extend with your actual enums
  tenant: number;
}

export interface WageDTO {
  id?: number; // <-- make this optional
  userDTO: UserDTO;
  hourRate: number;
  weeklyHours: number;
  taxImposed: number;
  extraPayments: number;
}

const CreateWageForm = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [wages, setWages] = useState<WageDTO[]>([]);

  const [formData, setFormData] = useState({
    userId: 0,
    hourRate: 0,
    weeklyHours: 0,
    taxImposed: 0,
    extraPayments: 0,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userHasWageWarning, setUserHasWageWarning] = useState<string | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndWages = async () => {
      try {
        const users = await getUsers();
        setUsers(users);

        const wages = await getWages();
        setWages(wages);
      } catch (err) {
        console.error("Failed to load users or wages:", err);
      }
    };
    fetchUsersAndWages();
  }, []);

  useEffect(() => {
    if (formData.userId && wages.length > 0) {
      const existingWage = wages.find((w) => w.userDTO.id === formData.userId);
      if (existingWage) {
        setUserHasWageWarning(
          "Warning: This user already has a wage assigned."
        );
      } else {
        setUserHasWageWarning(null);
      }
    } else {
      setUserHasWageWarning(null);
    }
  }, [formData.userId, wages]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "userId" ? Number(value) : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);

    if (userHasWageWarning) {
      setErrorMessage("Cannot create a wage for a user who already has one.");
      return;
    }

    const payload = {
      userId: formData.userId,
      hourRate: formData.hourRate,
      weeklyHours: formData.weeklyHours,
      taxImposed: formData.taxImposed,
      extraPayments: formData.extraPayments,
    };

    try {
      await createWage(payload);
      setSuccessMessage("Wage created successfully!");
      setTimeout(() => {
        navigate("/finances");
      }, 1500);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage("Failed to create wage. Please try again.");
      }
      console.error(err);
    }
  };

  const InputWrapper = ({
    icon,
    children,
  }: {
    icon: JSX.Element;
    children: React.ReactNode;
  }) => (
    <div className="relative rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-75">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
        {icon}
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-5 border border-gray-600 bg-white dark:bg-gray-900 rounded-xl shadow-xl relative">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white tracking-tight">
        Create Wage
      </h2>

      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-5 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs">
          <XCircleIcon className="w-6 h-6 flex-shrink-0" />
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

      {successMessage && (
        <div className="fixed top-6 right-6 z-50 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-5 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs">
          <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 text-gray-800 dark:text-gray-200"
      >
        <div>
          <label htmlFor="userId" className="block mb-2 font-semibold">
            Select User
          </label>
          <InputWrapper icon={<UserIcon className="w-5 h-5" />}>
            <select
              id="userId"
              name="userId"
              onChange={handleChange}
              value={formData.userId || ""}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              required
            >
              <option value="">-- Select User --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.lastname}
                </option>
              ))}
            </select>
          </InputWrapper>
          {userHasWageWarning && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {userHasWageWarning}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="hourRate" className="block mb-2 font-semibold">
            Hourly Rate
          </label>
          <InputWrapper icon={<CurrencyDollarIcon className="w-5 h-5" />}>
            <input
              id="hourRate"
              name="hourRate"
              type="number"
              step="0.01"
              onChange={handleChange}
              value={formData.hourRate}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              required
            />
          </InputWrapper>
        </div>

        <div>
          <label htmlFor="weeklyHours" className="block mb-2 font-semibold">
            Weekly Hours
          </label>
          <InputWrapper icon={<ClockIcon className="w-5 h-5" />}>
            <input
              id="weeklyHours"
              name="weeklyHours"
              type="number"
              onChange={handleChange}
              value={formData.weeklyHours}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              required
            />
          </InputWrapper>
        </div>

        <div>
          <label htmlFor="taxImposed" className="block mb-2 font-semibold">
            Tax Imposed (%)
          </label>
          <InputWrapper icon={<DocumentTextIcon className="w-5 h-5" />}>
            <input
              id="taxImposed"
              name="taxImposed"
              type="number"
              step="0.01"
              onChange={handleChange}
              value={formData.taxImposed}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              required
            />
          </InputWrapper>
        </div>

        <div>
          <label htmlFor="extraPayments" className="block mb-2 font-semibold">
            Extra Payments
          </label>
          <InputWrapper icon={<CurrencyDollarIcon className="w-5 h-5" />}>
            <input
              id="extraPayments"
              name="extraPayments"
              type="number"
              step="0.01"
              onChange={handleChange}
              value={formData.extraPayments}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              required
            />
          </InputWrapper>
        </div>

        <button
          type="submit"
          disabled={!!userHasWageWarning}
          className={`flex justify-center items-center w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition-transform active:scale-95 ${
            userHasWageWarning ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <CurrencyDollarIcon className="w-5 h-5" />
          Save Wage
        </button>
      </form>
    </div>
  );
};

export default CreateWageForm;
