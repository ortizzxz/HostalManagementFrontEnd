import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../../api/userApi";
import {
  createWage,
  UserDTO,
  WageCreateRequest,
  getWages,
  WageDTO,
} from "../../../api/wageApi";
import {
  UserIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

interface FormData {
  userId: number | "";
  hourRate: number | "";
  weeklyHours: number | "";
  taxImposed: number | "";
  extraPayments: number | "";
}

const CreateWageForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    hourRate: "",
    weeklyHours: "",
    taxImposed: "",
    extraPayments: "",
  });
  const [wages, setWages] = useState<WageDTO[]>([]);
  const [userHasWageWarning, setUserHasWageWarning] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // existing useEffect to fetch users...
  useEffect(() => {
    const fetchUsersAndWages = async () => {
      try {
        const users = await getUsers();
        setUsers(users);
        const wages = await getWages(); // fetch wages here
        setWages(wages);
      } catch (error) {
        setErrorMessage("Failed to load users or wages.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersAndWages();
  }, []);

  // modify handleChange to check for existing wage on user select
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [name]:
          value === ""
            ? ""
            : name === "userId"
            ? Number(value)
            : parseFloat(value),
      };

      // Check for existing wage if userId changed
      if (name === "userId" && value !== "") {
        const userIdNum = Number(value);
        const existingWage = wages.find((w) => w.userDTO.id === userIdNum);
        if (existingWage) {
          setUserHasWageWarning(
            "Warning: This user already has a wage assigned."
          );
        } else {
          setUserHasWageWarning(null);
        }
      } else if (name === "userId" && value === "") {
        setUserHasWageWarning(null);
      }

      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (userHasWageWarning) {
      setErrorMessage("Cannot create a wage for a user who already has one.");
      return;
    }

    // Validate inputs
    if (
      formData.userId === "" ||
      formData.hourRate === "" ||
      formData.weeklyHours === "" ||
      formData.taxImposed === "" ||
      formData.extraPayments === ""
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const selectedUser = users.find((user) => user.id === formData.userId);

      if (!selectedUser) {
        setErrorMessage("Selected user not found.");
        return;
      }

      const payload: WageCreateRequest = {
        userId: selectedUser.id,
        hourRate: formData.hourRate as number,
        weeklyHours: formData.weeklyHours as number,
        taxImposed: formData.taxImposed as number,
        extraPayments: formData.extraPayments as number,
      };

      await createWage(payload);
      setSuccessMessage("Wage created successfully!");

      setTimeout(() => {
        navigate("/finances");
      }, 1500);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage("Failed to create wage. Please try again.");
      }
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-10">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        <span className="ml-2 text-gray-700 dark:text-gray-300">
          Loading...
        </span>
      </div>
    );
  }

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
          <div className="relative rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-75">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <UserIcon className="w-5 h-5" />
            </div>
            <select
              id="userId"
              name="userId"
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              value={formData.userId || ""}
              required
            >
              <option value="">-- {t("wage.select_user")} --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.lastname}
                </option>
              ))}
            </select>
          </div>
          {userHasWageWarning && (
            <p className="mt-2 text-yellow-600 dark:text-yellow-400 flex items-center space-x-1">
              <XCircleIcon className="w-5 h-5" />
              <span>{userHasWageWarning}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="hourRate" className="block mb-2 font-semibold">
            Hourly Rate
          </label>
          <div className="relative rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-75">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <CurrencyDollarIcon className="w-5 h-5" />
            </div>
            <input
              id="hourRate"
              name="hourRate"
              type="number"
              step="0.01"
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              value={formData.hourRate || ""}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="weeklyHours" className="block mb-2 font-semibold">
            Weekly Hours
          </label>
          <div className="relative rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-75">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <ClockIcon className="w-5 h-5" />
            </div>
            <input
              id="weeklyHours"
              name="weeklyHours"
              type="number"
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              value={formData.weeklyHours || ""}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="taxImposed" className="block mb-2 font-semibold">
            Tax Imposed (%)
          </label>
          <div className="relative rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-75">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <DocumentTextIcon className="w-5 h-5" />
            </div>
            <input
              id="taxImposed"
              name="taxImposed"
              type="number"
              step="0.01"
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              value={formData.taxImposed || ""}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="extraPayments" className="block mb-2 font-semibold">
            Extra Payments
          </label>
          <div className="relative rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-75">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <CurrencyDollarIcon className="w-5 h-5" />
            </div>
            <input
              id="extraPayments"
              name="extraPayments"
              type="number"
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              value={formData.extraPayments || ""}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 transition duration-200"
        >
          Create Wage
        </button>
      </form>
    </div>
  );
};

export default CreateWageForm;
