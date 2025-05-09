import React from "react";
import { Label } from "../ui/label.tsx";
import { useUser } from "../../components/auth/UserContext.tsx"; // make sure path is correct
import { FaPlus } from "react-icons/fa"; // Icons for actions
import { Bolt } from "lucide-react";

interface HeaderWithActionsProps {
  title: string;
  onCreate?: () => void;
  onUpdate?: (id: number) => void;
  onExtra?: () => void;
  createLabel?: string;
  updateLabel?: string;
  extraLabel?: string;
  showFilter?: boolean;
}

const HeaderWithActions: React.FC<HeaderWithActionsProps> = ({
  title,
  onCreate,
  onUpdate,
  onExtra,
  createLabel = "Create",
  updateLabel = "Update",
  extraLabel = "Finances",
}) => {
  const { user } = useUser();
  const isAdmin = user?.rol === "admin";

  const actionButtons = [
    {
      condition: onCreate,
      callback: onCreate,
      label: <span className="inline-flex items-center gap-2"><FaPlus />{createLabel}</span>,
      idRequired: false,
      color:
        "bg-blue-500 dark:bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-600",
    },
    {
      condition: onUpdate,
      callback: onUpdate,
      label: <span className="inline-flex items-center gap-2"><Bolt />{updateLabel}</span>,
      idRequired: true,
      color:
        "bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-700 dark:hover:bg-yellow-500",
    },
    {
      condition: onExtra,
      callback: onExtra,
      label: extraLabel,
      idRequired: false,
      color:
        "bg-indigo-500 dark:bg-indigo-700 hover:bg-indigo-600 dark:hover:bg-indigo-500",
    },
  ].filter((btn) => btn.condition);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center shadow-md dark:shadow-gray-800 mb-4 p-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-black dark:text-white space-y-4 md:space-y-0">
      <h1 className="text-3xl font-bold">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Show buttons only if user is admin */}
        {isAdmin && actionButtons.length > 0 && (
          <div className="flex gap-2">
            {actionButtons.map((btn, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  if (btn.callback) {
                    if (btn.idRequired) {
                      (btn.callback as (id: number) => void)(123); // Replace with actual logic
                    } else {
                      (btn.callback as () => void)();
                    }
                  }
                }}
                className={`${btn.color} text-white font-semibold py-2 px-4 rounded-2xl shadow transition duration-300`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-1">
          <Label
            htmlFor="action-toggle"
            className="text-sm font-medium text-gray-800 dark:text-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderWithActions;
