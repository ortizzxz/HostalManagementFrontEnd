import React, { useEffect, useState } from "react";
import { Switch } from "../ui/switch.tsx";
import { Label } from "../ui/label.tsx";

const HeaderWithActions = ({
  title,
  onCreate,
  onUpdate,
  onDelete,
  createLabel = "Create",
  updateLabel = "Update",
  deleteLabel = "Delete",
}) => {
  // Initialize state with value from localStorage or default to true
  const [showActions, setShowActions] = useState(() => {
    const saved = localStorage.getItem("showActions");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("showActions", JSON.stringify(showActions));
  }, [showActions]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center shadow-md dark:shadow-gray-800 mb-4 p-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-black dark:text-white space-y-4 md:space-y-0">
      {/* Title */}
      <h1 className="text-3xl font-bold">{title}</h1>

      {/* Buttons + Toggle Row */}
      <div className="flex items-center space-x-4">
        {showActions && (
          <>
            {onCreate && (
              <button
                onClick={onCreate}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl shadow transition duration-300"
              >
                {createLabel}
              </button>
            )}
            {onUpdate && (
              <button
                onClick={onUpdate}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-2xl shadow transition duration-300"
              >
                {updateLabel}
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-2xl shadow transition duration-300"
              >
                {deleteLabel}
              </button>
            )}
          </>
        )}

        {/* Single Toggle */}
        <div className="flex items-center space-x-1">
          <Switch
            id="action-toggle"
            checked={showActions}
            onCheckedChange={setShowActions}
          />
          <Label
            htmlFor="action-toggle"
            className="text-sm font-medium text-gray-800 dark:text-gray-200"
          ></Label>
        </div>
      </div>
    </div>
  );
};

export default HeaderWithActions;
