import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const OwnerDashboard = () => {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        store: null,
        averageRating: 0,
        totalRatings: 0,
        users: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/owner/dashboard");

            setDashboard({
                store: response.data.store,
                averageRating: response.data.averageRating || 0,
                totalRatings: response.data.totalRatings || 0,
                users: response.data.users || []
            });

        } catch (error) {
            console.error("Owner Dashboard Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />

                <div className="flex min-h-[70vh] items-center justify-center">
                    <p className="text-sm text-slate-500">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                            Store Owner Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 sm:text-base">
                            Monitor your store ratings and customer activity.
                        </p>
                    </div>


                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                {/* Store Information */}
                {dashboard.store && (
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                            {dashboard.store.image_url?.url && (
                                <img
                                    src={dashboard.store.image_url.url}
                                    alt={dashboard.store.name}
                                    className="h-24 w-24 rounded-xl object-cover"
                                />
                            )}

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {dashboard.store.name}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {dashboard.store.email}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    {dashboard.store.address}
                                </p>
                            </div>

                        </div>

                    </div>
                )}

                {/* Statistics */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm font-medium text-slate-500">
                            Average Rating
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                            <span className="text-4xl font-bold text-slate-900">
                                {Number(dashboard.averageRating).toFixed(1)}
                            </span>

                            <span className="text-2xl text-yellow-500">
                                ★
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            Overall store rating
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm font-medium text-slate-500">
                            Total Ratings
                        </p>

                        <p className="mt-3 text-4xl font-bold text-slate-900">
                            {dashboard.totalRatings}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Users who rated your store
                        </p>
                    </div>

                </div>

                {/* Users */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                        <h2 className="text-lg font-bold text-slate-900">
                            Users Who Submitted Ratings
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Customers who have rated your store.
                        </p>
                    </div>

                    {dashboard.users.length === 0 ? (

                        <div className="px-5 py-16 text-center sm:px-6">
                            <p className="text-lg font-semibold text-slate-700">
                                No ratings yet
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Users who rate your store will appear here.
                            </p>
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[700px]">

                                <thead className="border-b border-slate-200 bg-slate-50">

                                    <tr>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                                            User
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                                            Email
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                                            Address
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                                            Rating
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {dashboard.users.map((user) => (

                                        <tr
                                            key={user.id}
                                            className="transition hover:bg-slate-50"
                                        >

                                            <td className="px-5 py-4 sm:px-6">

                                                <p className="font-semibold text-slate-800">
                                                    {user.name}
                                                </p>

                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600 sm:px-6">
                                                {user.email}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600 sm:px-6">
                                                {user.address}
                                            </td>

                                            <td className="px-5 py-4 sm:px-6">

                                                <div className="flex items-center gap-1">

                                                    <span className="font-semibold text-slate-800">
                                                        {user.rating}
                                                    </span>

                                                    <span className="text-yellow-500">
                                                        ★
                                                    </span>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
};

export default OwnerDashboard;