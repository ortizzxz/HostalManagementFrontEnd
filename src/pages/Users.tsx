import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api/userApi";
import { useTranslation } from "react-i18next";
import HeaderWithActions from "../components/ui/HeaderWithActions";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaUserAlt } from "react-icons/fa"; // Usamos iconos de react-icons
import FilterBar from "../components/ui/FilterBar";
import DeleteUserForm from "../components/forms/create/DeleteUserForm";
import { LoadingModal } from "../components/ui/LoadingModal";
import { useUser } from "../components/auth/UserContext";

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password?: string;
  rol?: string;
  tenantId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const Users = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [users, setUsers] = useState<User[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate(); // Inicializamos useNavigate
  const [searchTerm, setSearchTerm] = useState("");
  const [activateUserFilter, setActiveUserFilter] = useState(""); // State for custom filter
  const { user } = useUser();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (user?.rol === "admin" || user?.rol == "recepcion") {
      setHasAccess(true);
    }
  }, [user]);

  // Filter rooms based on search term and active filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activateUserFilter
      ? user.rol === activateUserFilter
      : true;
    return matchesSearch && matchesFilter;
  });

  // Define filter buttons
  const userFilterButtons = [
    { label: "Admin", value: "ADMIN" },
    { label: "Reception", value: "RECEPCION" },
    { label: "Janitors", value: "LIMPIEZA" },
    { label: "Maintenance", value: "MANTENIMIENTO" },
    { label: "Non Assigned", value: "UNKNOWN" },
    { label: "All", value: "" }, // No filter
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers(); // Llamada a la API
        // Filtramos el password
        const filteredUsers = data.map(
          ({ ...userWithoutPassword }: User) => userWithoutPassword
        ); // Only return the user properties excluding password
        setUsers(filteredUsers); // Establecemos los usuarios
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    navigate("/create-user");
  };

  const handleUpdateUser = (userId: number) => {
    navigate(`/update-user/${userId}`);
  };

  const handleDeleteUser = (id: number) => {
    const selectedUser = users.find((r) => r.id === id);
    if (selectedUser) {
      setUserToDelete(selectedUser);
      setShowDeleteModal(true);
    }
  };

  const handleGoToFinances = () => {
    navigate("/finances");
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id); // API call
        setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      } catch (err) {
        console.error("Error deleting user:", err);
      } finally {
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    }
  };

  if (loading) {
    return <LoadingModal />;
  }

  return (
    <>
      {!hasAccess ? (
        <div className="max-w-xl mx-auto mt-20 p-6 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded-xl shadow-md text-center border border-yellow-300 dark:border-yellow-600">
          <h2 className="text-2xl font-semibold mb-2">
            {t("common.access_denied")}
          </h2>
          <p className="text-sm">{t("common.no_permission")}</p>
        </div>
      ) : (
        <div className="text-black dark:text-white p-3">
          {/* Header con acciones */}
          <HeaderWithActions
            title={t("user.list")}
            onCreate={handleCreateUser}
            onExtra={handleGoToFinances}
            createLabel={t("user.create")}
            extraLabel={t("Finances")} // Label for the nav button
          />
          {/* Filter Bar */}
          <FilterBar
            placeholder={t("filterbar.search_placeholder")}
            value={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilter={activateUserFilter}
            onFilterChange={setActiveUserFilter}
            filterButtons={userFilterButtons} // Custom buttons
          />

          {/* Lista de usuarios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-400 dark:border-gray-200 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {/* Aquí movemos el icono al lado del nombre y rol */}
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl text-gray-800 dark:text-white mr-4">
                      <FaUserAlt />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {user.name} {user.lastname}
                      </h2>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {/* Aquí está el icono junto al rol */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">
                        {t("user.role")}:{" "}
                      </span>
                      <span className="ml-2 flex items-center">
                        {user.rol === "ADMIN" ? (
                          <FaUserShield className="text-red-500 mr-2" />
                        ) : (
                          <FaUserAlt className="text-blue-500 mr-2" />
                        )}
                        <span className="font-medium text-sm">
                          {user.rol
                            ? user.rol.charAt(0).toUpperCase() +
                              user.rol.slice(1).toLowerCase()
                            : "No Role"}
                        </span>
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-sm text-white focus:outline-none focus:ring-2 bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-700 dark:hover:bg-yellow-500 focus:ring-opacity-75 border border-transparent p-2 rounded-lg transition duration-200"
                        onClick={() => handleUpdateUser(user.id)} // Pass user.id
                      >
                        {t("user.update")}
                      </button>
                      <button
                        className="text-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 border border-transparent p-2 rounded-lg transition duration-200"
                        onClick={() => handleDeleteUser(user.id)} // Pass user.id
                      >
                        {t("user.delete")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DeleteUserForm
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDeleteUser}
            userName={userToDelete?.name ?? ""}
            userLastname={userToDelete?.lastname ?? ""}
          />
        </div>
      )}
    </>
  );
};

export default Users;
