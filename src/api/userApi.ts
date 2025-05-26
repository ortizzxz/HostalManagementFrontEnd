import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Base URL for your API
// const API_URL = "http://localhost:8080/api/user";
// const AUTH_URL = "http://localhost:8080/api/auth"; // For authentication (login)
const API_URL = import.meta.env.VITE_API_USERS;
const AUTH_URL = import.meta.env.VITE_API_AUTH; // For authentication (login)

// TypeScript interface for User data
export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  role?: string; // Optional field
  tenantId?: number; // Assuming tenantId is part of the user data, optional if not required.
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UserDTO {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  rol: "ADMIN" | "RECEPCION" | "LIMPIEZA" | "MANTENIMIENTO" | "UNKNOWN"; // Extend with your actual enums
  tenant: number;
}

interface DecodedToken {
  sub: string;
  tenantId: number;
  rol: string;
  iat: number;
  exp: number;
}

// Centralized axios instance with token handling
const axiosInstance = axios.create();

// Interceptor to add JWT token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Properly handling error in case the request fails.
  }
);

// Get all users with proper typing, handling tenant information
export const getUsers = async (): Promise<UserDTO[]> => {
  try {
    const tenantId = Number(localStorage.getItem("tenantId"));
    const response = await axiosInstance.get<UserDTO[]>(API_URL, {
      params: { tenantId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Re-throw to let the caller handle it
  }
};

// Create a new user, passing tenant ID from the logged-in user context (if available)
export const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  const tenantId = localStorage.getItem("tenantId"); // Assuming tenant ID is stored in localStorage
  if (tenantId) {
    userData.tenantId = Number(tenantId); // Add tenant ID if it's available
  }

  try {
    const response = await axiosInstance.post<User>(API_URL, userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update a user with optional tenant information
export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  try {
    const response = await axiosInstance.put<User>(
      `${API_URL}/${id}`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, { email, password });
    const token = response.data;
    console.log("Token received:", token);

    if (token) {
      localStorage.setItem("token", token); // Store JWT

      // Decode token to extract tenantId
      const decoded: DecodedToken = jwtDecode(token);
      localStorage.setItem("tenantId", decoded.tenantId.toString()); // Store tenantId separately

      return { token, tenantId: decoded.tenantId };
    } else {
      console.error("No token found in response!");
      return null;
    }
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("tenantId");
  window.location.href = "/login"; // Or use React Router navigation
};
