import React, { useEffect, useState } from "react";
import { Switch } from "../ui/switch.tsx";
import { Label } from "../ui/label.tsx";

interface HeaderWithActionsProps {
  title: string;
  onCreate?: () => void;
  onUpdate?: (id: number) => void;
  onDelete?: (id: number) => void;
  createLabel?: string;
  updateLabel?: string;
  deleteLabel?: string;
}

const HeaderWithActions: React.FC<HeaderWithActionsProps> = ({
  title,
  onCreate,
  onUpdate,
  onDelete,
  createLabel = "Create",
  updateLabel = "Update",
  deleteLabel = "Delete",
}) => {
  const [showActions, setShowActions] = useState(() => {
    const saved = localStorage.getItem("showActions");
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("showActions", JSON.stringify(showActions));
  }, [showActions]);

  // Create an array of action buttons to render
  const actionButtons = [
    {
      condition: onCreate,
      callback: onCreate,
      label: createLabel,
      color:
        "bg-blue-500 dark:bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-600",
    },
    {
      condition: onUpdate,
      callback: onUpdate,
      label: updateLabel,
      color:
        "bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-700 dark:hover:bg-yellow-500",
    },
    {
      condition: onDelete,
      callback: onDelete,
      label: deleteLabel,
      color:
        "bg-red-500 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600",
    },
  ].filter((btn) => btn.condition);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center shadow-md dark:shadow-gray-800 mb-4 p-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-black dark:text-white space-y-4 md:space-y-0">
      <h1 className="text-3xl font-bold">{title}</h1>

      <div className="flex items-center gap-4">
        {showActions && actionButtons.length > 0 && (
          <div className="flex gap-2">
            {actionButtons.map((btn, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default behavior if needed
                  if (btn.callback) {
                    // Check if the callback is defined before invoking it
                    if (btn.callback.length === 1) {
                      btn.callback(123); // Pass a default id or any other parameter if needed
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
          <Switch
            id="action-toggle"
            checked={showActions}
            onCheckedChange={setShowActions}
          />
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
