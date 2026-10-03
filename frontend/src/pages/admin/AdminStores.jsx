import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const AdminStores = () => {
    const navigate = useNavigate();

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: ""
    });

    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("asc");

    const fetchStores = async (searchFilters = filters) => {
        try {
            setLoading(true);

            const response = await api.get("/admin/stores", {
                params: {
                    name: searchFilters.name,
                    email: searchFilters.email,
                    address: searchFilters.address,
                    sortBy,
                    order
                }
            });

            setStores(response.data.stores);
        } catch (error) {
            console.error("Get Stores Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [sortBy, order]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStores(filters);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                            Store Management
                        </h2>

                        <p className="mt-2 text-sm text-slate-500 sm:text-base">
                            Manage all stores registered on the platform.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/admin/stores/create")}
                        className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-orange-600 sm:w-auto cursor-pointer"
                    >
                        + Add Store
                    </button>

                </div>

                {/* Filters */}
                <form
                    onSubmit={handleSearch}
                    className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">

                        <input
                            type="text"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            placeholder="Search by name"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />

                        <input
                            type="text"
                            name="email"
                            value={filters.email}
                            onChange={handleFilterChange}
                            placeholder="Search by email"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />

                        <input
                            type="text"
                            name="address"
                            value={filters.address}
                            onChange={handleFilterChange}
                            placeholder="Search by address"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium cursor-pointer text-white transition hover:bg-slate-700"
                        >
                            Search
                        </button>

                    </div>
                </form>

                {/* Sorting */}
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-sm text-slate-500">
                        {stores.length} store{stores.length !== 1 ? "s" : ""} found
                    </p>

                    <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none sm:px-4"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="email">Sort by Email</option>
                            <option value="address">Sort by Address</option>
                            <option value="rating">Sort by Rating</option>
                        </select>

                        <select
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none sm:px-4"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>

                    </div>
                </div>

                {/* Store List */}
                {loading ? (
                    <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-20">
                        <p className="text-slate-500">
                            Loading stores...
                        </p>
                    </div>

                ) : stores.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-20 text-center">
                        <p className="text-lg font-semibold text-slate-700">
                            No stores found
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search filters.
                        </p>
                    </div>

                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[800px]">

                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                                            Store
                                        </th>

                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                                            Email
                                        </th>

                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                                            Address
                                        </th>

                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                                            Rating
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {stores.map((store) => (
                                        <tr
                                            key={store.id}
                                            className="transition hover:bg-slate-50"
                                        >

                                            <td className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center gap-3 sm:gap-4">

                                                    {store.image_url?.url ? (
                                                        <img
                                                            src={store.image_url.url}
                                                            alt={store.name}
                                                            className="h-10 w-10 rounded-lg object-cover sm:h-12 sm:w-12"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-lg sm:h-12 sm:w-12 sm:text-xl">
                                                            🏪
                                                        </div>
                                                    )}

                                                    <p className="font-semibold text-slate-800">
                                                        {store.name}
                                                    </p>

                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-slate-600 sm:px-6">
                                                {store.email}
                                            </td>

                                            <td className="max-w-xs px-4 py-4 text-sm text-slate-600 sm:px-6">
                                                {store.address}
                                            </td>

                                            <td className="px-4 py-4 sm:px-6">
                                                <span className="whitespace-nowrap font-semibold text-slate-800">
                                                    ⭐ {Number(store.rating).toFixed(1)}
                                                </span>
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default AdminStores;
