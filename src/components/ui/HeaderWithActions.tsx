import React from "react";

const HeaderWithActions = ({
  title,
  onCreate,
  onUpdate,
  onDelete,
  createLabel = "Create",
  updateLabel = "Update",
  deleteLabel = "Delete",
}) => {
  return (
    <div className="flex justify-between items-center shadow-md dark:shadow-gray-800 mb-2 p-3 bg-gray-100 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600">
      {/* Title */}
      <h1 className="text-3xl font-bold">{title}</h1>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {/* Create Button */}
        {onCreate && (
          <button
            onClick={onCreate}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            {createLabel}
          </button>
        )}

        {/* Update Button */}
        {onUpdate && (
          <button
            onClick={onUpdate}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            {updateLabel}
          </button>
        )}

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            {deleteLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderWithActions;
