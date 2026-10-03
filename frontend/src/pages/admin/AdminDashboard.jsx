import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0
    });

    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get("/admin/dashboard");

                setStats({
                    totalUsers: response.data.totalUsers,
                    totalStores: response.data.totalStores,
                    totalRatings: response.data.totalRatings
                });
            } catch (error) {
                console.error("Dashboard Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-slate-500">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Navbar */}
            <Navbar />

            {/* Content */}
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                <div className="mb-6 sm:mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Admin Dashboard
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        Overview of your Roxiler store rating system.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">

                    {/* Users */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Users
                                </p>

                                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                                    {stats.totalUsers}
                                </h3>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl sm:h-12 sm:w-12 sm:text-2xl">
                                👥
                            </div>

                        </div>

                        <button
                            onClick={() => navigate("/admin/users")}
                            className="mt-5 text-sm font-medium text-orange-500 cursor-pointer   hover:text-orange-600"
                        >
                            View Users →
                        </button>
                    </div>

                    {/* Stores */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Stores
                                </p>

                                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                                    {stats.totalStores}
                                </h3>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl sm:h-12 sm:w-12 sm:text-2xl">
                                🏪
                            </div>

                        </div>

                        <button
                            onClick={() => navigate("/admin/stores")}
                            className="mt-5 text-sm font-medium text-orange-500 cursor-pointer hover:text-orange-600"
                        >
                            View Stores →
                        </button>
                    </div>

                    {/* Ratings */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Ratings
                                </p>

                                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                                    {stats.totalRatings}
                                </h3>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-xl sm:h-12 sm:w-12 sm:text-2xl">
                                ⭐
                            </div>

                        </div>

                        <p className="mt-5 text-sm text-slate-500">
                            Ratings submitted by users
                        </p>
                    </div>

                </div>

            </main>
        </div>
    );
};

export default AdminDashboard;
