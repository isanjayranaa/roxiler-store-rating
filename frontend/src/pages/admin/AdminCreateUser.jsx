import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const AdminCreateUser = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await api.post(
                "/admin/create-users",
                formData
            );

            setSuccess(response.data.message);

            setFormData({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "USER"
            });

        } catch (error) {
            console.error("Add User Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to create user"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

                {/* Header */}
                <div className="mb-6">

                    <button
                        onClick={() => navigate("/admin/users")}
                        className="mb-4 text-sm font-medium text-slate-600 transition hover:text-orange-500"
                    >
                        ← Back to Users
                    </button>

                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Add User
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        Create a new administrator or normal user.
                    </p>

                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />

                            <p className="mt-1 text-xs text-slate-400">
                                Must be between 20 and 60 characters.
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />

                            <p className="mt-1 text-xs text-slate-400">
                                8–16 characters, including one uppercase letter and one special character.
                            </p>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                                
                                rows="4"
                                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />

                            <p className="mt-1 text-xs text-slate-400">
                                Maximum 400 characters.
                            </p>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Role
                            </label>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            >
                                <option value="USER">
                                    Normal User
                                </option>

                                <option value="ADMIN">
                                    Administrator
                                </option>
                            </select>
                        </div>

                        {/* Buttons + Message */}
                        <div className="border-t border-slate-200 pt-5">

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/users")}
                                    className="w-full rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-lg bg-orange-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto cursor-pointer"
                                >
                                    {loading
                                        ? "Creating..."
                                        : "Create User"}
                                </button>

                            </div>

                            {/* Backend Message */}
                            {error && (
                                <p className="mt-3 text-center text-sm font-medium text-red-500 sm:text-right">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="mt-3 text-center text-sm font-medium text-green-600 sm:text-right">
                                    {success}
                                </p>
                            )}

                        </div>

                    </form>

                </div>

            </main>
        </div>
    );
};

export default AdminCreateUser;