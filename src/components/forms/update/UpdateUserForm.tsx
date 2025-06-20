import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUsers, updateUser, User } from "../../../api/userApi";
import {
  User as UserIcon,
  Mail,
  Save,
  Loader2,
  AlertTriangle,
  UserRoundCheck,
} from "lucide-react";
import { useUser } from "../../auth/UserContext";

const UpdateUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.rol === "admin") {
      setIsAdmin(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await getUsers();
        const selectedUser = users.find((u) => u.id === Number(id));
        if (!selectedUser) {
          setError("User not found");
          return;
        }
        setCurrentUser(selectedUser);
      } catch (err) {
        setError("Failed to fetch user: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (id && currentUser) {
        // Crea el objeto a enviar
        const userData: Partial<User> = {
          id: currentUser.id,
          name: currentUser.name,
          lastname: currentUser.lastname,
          email: currentUser.email,
          rol: currentUser.rol,
          tenant: currentUser.tenant
        };

        // Solo incluir la contraseña si es admin y se ha proporcionado
        if (isAdmin && currentUser.password?.trim()) {
          userData.password = currentUser.password;
        }

        await updateUser(id, userData);
        navigate("/users-overview");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-10">
        <Loader2 className="animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center mt-10 text-red-600">
        <AlertTriangle className="mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg border">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white flex items-center justify-center gap-2">
        <UserRoundCheck className="w-6 h-6" />
        Update User
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
            <UserIcon className="w-5 h-5" />
            Name
          </label>
          <input
            type="text"
            name="name"
            value={currentUser.name || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg dark:text-black"
            placeholder="Enter first name"
          />
        </div>

        {/* Lastname */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
            <UserIcon className="w-5 h-5" />
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            value={currentUser.lastname || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg dark:text-black"
            placeholder="Enter last name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
            <Mail className="w-5 h-5" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={currentUser.email || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg dark:text-black"
            placeholder="Enter email"
          />
        </div>

        {isAdmin && (
          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-1">
              <Mail className="w-5 h-5" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={currentUser.password || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:text-black"
              placeholder="Enter password"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateUserForm;
