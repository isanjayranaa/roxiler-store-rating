import { validatePassword } from "./password.validation.js";

export const validateRegister = ({
    name,
    email,
    password,
    address
}) => {

    if (!name || !name.trim()) {
        return "Name is required";
    }

    if (name.trim().length > 60) {
        return "Name should below 60 characters";
    }

    if (!email || !email.trim()) {
        return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        return "Invalid email format";
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
        return passwordError;
    }

    if (!address || !address.trim()) {
        return "Address is required";
    }

    if (address.trim().length > 400) {
        return "Address must not exceed 400 characters";
    }

    return null;
};


export const validateLogin = ({ email, password }) => {

    if (!email || !email.trim()) {
        return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        return "Invalid email format";
    }

    if (!password) {
        return "Password is required";
    }

    return null;
};