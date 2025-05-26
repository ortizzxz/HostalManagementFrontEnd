import { useState, useEffect } from "react";
import { getWages, WageDTO } from "../api/wageApi";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom"; // For navigation
import {
  FaEdit,
  FaTrashAlt,
  FaDollarSign,
  FaClock,
  FaUserLock,
  FaEuroSign,
} from "react-icons/fa";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

const Finances = () => {
  const [wages, setWages] = useState<WageDTO[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch all wages (possibly filtering by tenantId if needed)
  useEffect(() => {
    const fetchWages = async () => {
      try {
        const data = await getWages(); // API call to fetch wages
        setWages(data);
      } catch (error) {
        console.error("Error fetching wages:", error);
      }
    };
    fetchWages();
  }, []);

  const handleGoBack = () => {
    navigate("/users-overview"); // Navigate to Users page
  };

  const handleCreateWage = () => {
    navigate("/create-wage"); // Navigate to Create Wage form
  };

  const handleEditWage = (id: number) => {
    navigate(`/update-wage/${id}`);
  };

  return (
    <div className="text-black dark:text-white">
      {/* Header with actions */}
      <HeaderWithActions
        title={t("finances.list")}
        onCreate={handleCreateWage}
        onExtra={handleGoBack}
        createLabel={t("finances.create_wage")}
        extraLabel={t("finances.back")}
      />

      {/* Wages Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg mt-4">
        <table className="min-w-full text-left text-lg font-light">
          <thead className="border-b bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
            <tr>
              <th className="px-6 py-3">{t("finances.employee")}</th>
              <th className="px-6 py-3">{t("finances.role")}</th>
              <th className="px-6 py-3">{t("finances.hourly_rate")}</th>
              <th className="px-6 py-3">{t("finances.weekly_hours")}</th>
              <th className="px-6 py-3">{t("finances.tax_imposed")}</th>
              <th className="px-6 py-3">{t("finances.extra_payments")}</th>
              <th className="px-6 py-3">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {wages.map((wage) => (
              <tr
                key={wage.id}
                className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
              >
                {/* Employee */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center gap-2">
                    <User />
                    <span>
                      {wage.userDTO.name} {wage.userDTO.lastname}
                    </span>
                  </div>
                </td>

                {/* Role Formatted to UpperCase*/}
                <td className="px-6 py-4 inline-flex gap-2 items-center">
                  <FaUserLock />
                  {wage.userDTO.rol.slice(0, 1)}
                  {wage.userDTO.rol.slice(1).toLowerCase()}
                </td>

                {/* Hourly Rate */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <FaDollarSign className="text-green-500" />
                    {wage.hourRate.toFixed(2)}
                  </span>
                </td>

                {/* Weekly Hours */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <FaClock className="text-blue-500" />
                    {wage.weeklyHours} Hrs
                  </span>
                </td>

                {/* Tax Imposed */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <FaEuroSign className="text-red-500" />
                    {wage.taxImposed.toFixed(2)} %
                  </span>
                </td>

                {/* Extra Payments */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <FaEuroSign className="text-yellow-500" />
                    {wage.extraPayments.toFixed(2)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() =>
                        wage.id !== undefined && handleEditWage(wage.id)
                      }
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finances;
