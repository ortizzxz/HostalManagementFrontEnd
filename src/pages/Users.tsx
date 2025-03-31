import React, { useEffect, useState } from "react";
import { getUsers } from "../api/userApi";
import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(); // Call to API function.
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    navigate("/create-user");
  };

  const handleUpdateUser = () => {
    console.log("Redirect to user update form or open modal");
  };

  const handleDeleteUser = () => {
    console.log("Handle user deletion logic");
  };

  return (
    <div className="text-black dark:text-white">
      {/* Header with actions */}
      <HeaderWithActions
        title={t("user.list")}
        onCreate={handleCreateUser}
        onUpdate={handleUpdateUser}
        onDelete={handleDeleteUser}
        createLabel={t("user.create")}
        updateLabel={t("user.update")}
        deleteLabel={t("user.delete")}
      />

      {/* User list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-default"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {user.name} {user.lastname}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {t("user.role")} -{" "}
                    {user.rol.charAt(0) + user.rol.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1>No users found.</h1>
        )}
      </div>
    </div>
  );
};

export default Users;
