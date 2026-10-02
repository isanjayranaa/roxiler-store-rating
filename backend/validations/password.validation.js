export const validatePassword = (password) => {

    if (!password) {
        return "New password is required";
    }

    if (password.length < 8 || password.length > 16) {
        return "Password must be between 8 and 16 characters";
    }

    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "Password must contain at least one special character";
    }

    return null;
};