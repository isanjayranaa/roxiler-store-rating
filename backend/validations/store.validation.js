export const validateStore = ({
    name,
    email,
    address,
    ownerEmail
}) => {

    if (!name || !name.trim()) {
        return "Store name is required";
    }

    if (name.trim().length > 60) {
        return "Store name should below 60 characters";
    }

    if (!email || !email.trim()) {
        return "Store email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        return "Invalid store email format";
    }

    if (!address || !address.trim()) {
        return "Store address is required";
    }

    if (address.trim().length > 400) {
        return "Store address must not exceed 400 characters";
    }

    if (!ownerEmail || !ownerEmail.trim()) {
        return "Store owner email is required";
    }

    if (!emailRegex.test(ownerEmail.trim())) {
        return "Invalid store owner email format";
    }

    return null;
};