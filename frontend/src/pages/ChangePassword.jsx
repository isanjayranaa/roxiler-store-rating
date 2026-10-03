import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const ChangePassword = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
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

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New password and confirm password do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await api.put(
                "/auth/change-password",
                {
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }
            );

            setSuccess(
                response.data.message ||
                "Password updated successfully"
            );

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {
            console.error("Change Password Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to update password"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

                <div className="mb-6">

                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 text-sm font-medium text-slate-600 transition hover:text-orange-500"
                    >
                        ← Back
                    </button>

                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Change Password
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        Update your account password securely.
                    </p>

                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Current Password
                            </label>

                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                                
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                New Password
                            </label>

                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />

                            <p className="mt-1 text-xs text-slate-400">
                                8–16 characters, including one uppercase letter and one special character.
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />
                        </div>

                        <div className="border-t border-slate-200 pt-5">

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
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
                                        ? "Updating..."
                                        : "Update Password"}
                                </button>

                            </div>

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

export default ChangePassword;