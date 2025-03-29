import React, { useEffect, useState } from "react";
import { getUsers } from "../api/userApi"; 
import { useTranslation } from "react-i18next";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();

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

  return (
    <div className="min-h-screen py-8 px-4 text-black dark:text-white">
      <h1 className="text-3xl font-bold text-center mb-8">{t("user.list")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-whitedark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-default"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{user.name} {user.lastname}</h2>
                <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {t("user.role")} - {user.rol.charAt(0) + user.rol.slice(1).toLowerCase()}
                </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Users;
