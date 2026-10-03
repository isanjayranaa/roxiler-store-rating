import api from "../../services/api";

export const loginUser = async (data) => {
    try {
        const response = await api.post("/auth/login", data);

        return response.data;
    } catch (error) {
        console.error("Login Error:", error);

        throw error;
    }
};

export const registerUser = async (data) => {
    try {
        const response = await api.post("/auth/register", data);

        return response.data;
    } catch (error) {
        console.error("Register Error:", error);

        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get("/auth/me");

        return response.data;
    } catch (error) {
        console.error("Get Current User Error:", error);

        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await api.post("/auth/logout");

        return response.data;
    } catch (error) {
        console.error("Logout Error:", error);

        throw error;
    }
};