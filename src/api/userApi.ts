import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Base URL for your API
const API_URL = "http://localhost:8080/api/user";
const AUTH_URL = "http://localhost:8080/api/auth"; // For authentication (login)

// TypeScript interface for User data
interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role?: string; // Optional field
  tenantId?: number; // Assuming tenantId is part of the user data, optional if not required.
  createdAt?: Date;
  updatedAt?: Date;
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
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<User[]>(API_URL);
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
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// log in an user
export const loginUser = async (email, password) => {
  try {
    // const response = await axios.post(AUTH_URL + '/login', { email, password });
    const response = await axios.post(`${AUTH_URL}/login`, { email, password });
    console.log("Login response:", response); // Log the entire response to verify token
    const token = response.data;
    console.log("Token from response:", token); // Ensure the token is in response.data.token

    if (token) {
      localStorage.setItem("token", token); // Store the token in localStorage
    } else {
      console.error("No token found in response!");
    }

    return token;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
