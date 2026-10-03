import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: "",
        role: ""
    });

    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("asc");

    const fetchUsers = async (searchFilters = filters) => {
        try {
            setLoading(true);

            const response = await api.get("/admin/users", {
                params: {
                    name: searchFilters.name,
                    email: searchFilters.email,
                    address: searchFilters.address,
                    role: searchFilters.role,
                    sortBy,
                    order
                }
            });

            setUsers(response.data.users || []);

        } catch (error) {
            console.error("Get Users Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [sortBy, order]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(filters);
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
                            User Management
                        </h2>

                        <p className="mt-2 text-sm text-slate-500 sm:text-base">
                            Manage administrators, users and store owners.
                        </p>
                    </div>

                    {/* Add User Button */}
                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = "/admin/users/create";
                        }}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 sm:w-auto"
                    >
                        <span className="text-lg leading-none">
                            +
                        </span>

                        Add User
                    </button>

                </div>

                {/* Filters */}
                <form
                    onSubmit={handleSearch}
                    className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">

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

                        <select
                            name="role"
                            value={filters.role}
                            onChange={handleFilterChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
                        >
                            <option value="">All Roles</option>

                            <option value="ADMIN">
                                Admin
                            </option>

                            <option value="USER">
                                Normal User
                            </option>

                            <option value="STORE_OWNER">
                                Store Owner
                            </option>
                        </select>

                        <button
                            type="submit"
                            className="w-full cursor-pointer rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                        >
                            Search
                        </button>

                    </div>
                </form>

                {/* Sorting */}
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-sm text-slate-500">
                        {users.length} user{users.length !== 1 ? "s" : ""} found
                    </p>

                    <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none sm:px-4"
                        >
                            <option value="name">
                                Sort by Name
                            </option>

                            <option value="email">
                                Sort by Email
                            </option>

                            <option value="address">
                                Sort by Address
                            </option>

                            <option value="role">
                                Sort by Role
                            </option>
                        </select>

                        <select
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none sm:px-4"
                        >
                            <option value="asc">
                                Ascending
                            </option>

                            <option value="desc">
                                Descending
                            </option>
                        </select>

                    </div>
                </div>

                {/* Users Table */}
                {loading ? (

                    <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-20">

                        <p className="text-slate-500">
                            Loading users...
                        </p>

                    </div>

                ) : users.length === 0 ? (

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-20 text-center">

                        <p className="text-lg font-semibold text-slate-700">
                            No users found
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search filters.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px]">

                                <thead className="border-b border-slate-200 bg-slate-50">

                                    <tr>

                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                                            Name
                                        </th>

                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                                            Email
                                        </th>

                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                                            Address
                                        </th>

                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                                            Role
                                        </th>

                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                                            Rating
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {users.map((user) => (

                                        <tr
                                            key={user.id}
                                            className="transition hover:bg-slate-50"
                                        >

                                            {/* Name */}
                                            <td className="px-4 py-4 sm:px-6 sm:py-5">

                                                <p className="font-semibold text-slate-800">
                                                    {user.name}
                                                </p>

                                            </td>

                                            {/* Email */}
                                            <td className="px-4 py-4 text-sm text-slate-600 sm:px-6 sm:py-5">
                                                {user.email}
                                            </td>

                                            {/* Address */}
                                            <td className="max-w-sm px-4 py-4 text-sm text-slate-600 sm:px-6 sm:py-5">
                                                {user.address}
                                            </td>

                                            {/* Role */}
                                            <td className="px-4 py-4 sm:px-6 sm:py-5">

                                                {user.role === "ADMIN" && (
                                                    <span className="whitespace-nowrap rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                                        Admin
                                                    </span>
                                                )}

                                                {user.role === "USER" && (
                                                    <span className="whitespace-nowrap rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                        Normal User
                                                    </span>
                                                )}

                                                {user.role === "STORE_OWNER" && (
                                                    <span className="whitespace-nowrap rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                                        Store Owner
                                                    </span>
                                                )}

                                            </td>

                                            {/* Rating */}
                                            <td className="px-4 py-4 sm:px-6 sm:py-5">

                                                {user.role === "STORE_OWNER" ? (

                                                    <span className="font-semibold text-orange-500">
                                                        {Number(user.rating || 0).toFixed(1)} ⭐
                                                    </span>

                                                ) : (

                                                    <span className="text-slate-300">
                                                        —
                                                    </span>

                                                )}

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

export default AdminUsers;

