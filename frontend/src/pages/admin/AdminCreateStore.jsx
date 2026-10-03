import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const AdminCreateStore = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        ownerEmail: ""
    });

    const [storeImage, setStoreImage] = useState(null);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        setStoreImage(file || null);

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const data = new FormData();

            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("address", formData.address);
            data.append("ownerEmail", formData.ownerEmail);

            if (storeImage) {
                data.append("storeImage", storeImage);
            }

            const response = await api.post(
                "/admin/stores/create-store",
                data
            );

            setSuccess(response.data.message);

            setFormData({
                name: "",
                email: "",
                address: "",
                ownerEmail: ""
            });

            setStoreImage(null);

            const imageInput = document.getElementById("storeImage");

            if (imageInput) {
                imageInput.value = "";
            }

        } catch (error) {
            console.error("Add Store Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to create store"
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
                        onClick={() => navigate("/admin/stores")}
                        className="mb-4 text-sm font-medium text-slate-600 transition hover:text-orange-500"
                    >
                        ← Back to Stores
                    </button>

                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Add Store
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        Create a new store and assign it to a store owner.
                    </p>

                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Store Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Store Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter store name"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />

                            <p className="mt-1 text-xs text-slate-400">
                                Must be between 20 and 60 characters.
                            </p>
                        </div>

                        {/* Store Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Store Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter store email"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Store Address
                            </label>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter store address"
                                rows="4"
                                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />

                            <p className="mt-1 text-xs text-slate-400">
                                Maximum 400 characters.
                            </p>
                        </div>

                        {/* Owner Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Store Owner Email
                            </label>

                            <input
                                type="email"
                                name="ownerEmail"
                                value={formData.ownerEmail}
                                onChange={handleChange}
                                placeholder="Enter store owner's email"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />

                            <p className="mt-1 text-xs text-slate-400">
                                The email must belong to an existing Store Owner account.
                            </p>
                        </div>

                        {/* Store Image */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Store Image
                            </label>

                            <input
                                id="storeImage"
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={handleImageChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 outline-none file:mr-4 file:rounded-md file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-orange-600 hover:file:bg-orange-100"
                            />

                            <p className="mt-1 text-xs text-slate-400">
                                JPG, JPEG, PNG or WEBP. Maximum size 5MB.
                            </p>

                            {storeImage && (
                                <p className="mt-2 text-sm text-slate-600">
                                    Selected: {storeImage.name}
                                </p>
                            )}
                        </div>

                        {/* Buttons + Backend Message */}
                        <div className="border-t border-slate-200 pt-5">

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/stores")}
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
                                        : "Create Store"}
                                </button>

                            </div>

                            {/* Backend Error */}
                            {error && (
                                <p className="mt-3 text-center text-sm font-medium text-red-500 sm:text-right">
                                    {error}
                                </p>
                            )}

                            {/* Success Message */}
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

export default AdminCreateStore;
