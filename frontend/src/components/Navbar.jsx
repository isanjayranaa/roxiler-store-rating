import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/slices/authSlice";
import api from "../services/api";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");

            dispatch(logoutUser());
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const navigateTo = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    const isAdmin = user?.role === "ADMIN";
    const isUser = user?.role === "USER";
    const isStoreOwner = user?.role === "STORE_OWNER";

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <div
                        onClick={() => {
                            if (isAdmin) {
                                navigateTo("/admin/dashboard");
                            } else if (isStoreOwner) {
                                navigateTo("/owner/dashboard");
                            } else {
                                navigateTo("/user/dashboard");
                            }
                        }}
                        className="cursor-pointer text-2xl font-bold text-orange-500"
                    >
                        Roxiler
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden items-center gap-6 md:flex">

                        {/* ADMIN */}
                        {isAdmin && (
                            <>
                                <button
                                    onClick={() => navigateTo("/admin/dashboard")}
                                    className="text-sm cursor-pointer font-medium text-slate-700 hover:text-orange-500"
                                >
                                    Dashboard
                                </button>

                                <button
                                    onClick={() => navigateTo("/admin/users")}
                                    className="text-sm font-medium text-slate-700 cursor-pointer hover:text-orange-500"
                                >
                                    Users
                                </button>

                                <button
                                    onClick={() => navigateTo("/admin/stores")}
                                    className="text-sm cursor-pointer font-medium text-slate-700 hover:text-orange-500"
                                >
                                    Stores
                                </button>
                            </>
                        )}

                        {/* NORMAL USER */}
                        {isUser && (
                            <button
                                onClick={() => navigateTo("/user/dashboard")}
                                className="text-sm cursor-pointer font-medium text-slate-700 hover:text-orange-500"
                            >
                                Stores
                            </button>

                        )}

                        {/* STORE OWNER */}
                        {isStoreOwner && (
                            <button
                                onClick={() => navigateTo("/owner/dashboard")}
                                className="text-sm font-medium cursor-pointer text-slate-700 hover:text-orange-500"
                            >
                                Dashboard
                            </button>
                        )}

                        {/* CHANGE PASSWORD - COMMON FOR ALL ROLES */}
                        <button
                            onClick={() => navigateTo("/change-password")}
                            className="text-sm font-medium text-slate-700 cursor-pointer hover:text-orange-500"
                        >
                            Change Password
                        </button>

                        {/* User Info */}
                        <div className="flex items-center gap-4 border-l border-slate-200 pl-6">

                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-800">
                                    {user?.name}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {isAdmin
                                        ? "Administrator"
                                        : isStoreOwner
                                            ? "Store Owner"
                                            : "Normal User"}
                                </p>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition cursor-pointer hover:bg-slate-700"
                            >
                                Logout
                            </button>

                        </div>
                    </div>

                    {/* Mobile Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xl text-slate-700 md:hidden"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>

                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="border-t border-slate-200 bg-white py-4 md:hidden">

                        <div className="space-y-2">

                            {/* ADMIN MOBILE */}
                            {isAdmin && (
                                <>
                                    <button
                                        onClick={() => navigateTo("/admin/dashboard")}
                                        className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                                    >
                                        Dashboard
                                    </button>

                                    <button
                                        onClick={() => navigateTo("/admin/users")}
                                        className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                                    >
                                        Users
                                    </button>

                                    <button
                                        onClick={() => navigateTo("/admin/stores")}
                                        className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                                    >
                                        Stores
                                    </button>
                                </>
                            )}

                            {/* NORMAL USER MOBILE */}
                            {isUser && (
                                                                    <button
                                        onClick={() => navigateTo("/user/dashboard")}
                                        className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                                    >
                                        Stores
                                    </button>

                                                                )}

                            {/* STORE OWNER MOBILE */}
                            {isStoreOwner && (
                                <button
                                    onClick={() => navigateTo("/owner/dashboard")}
                                    className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                                >
                                    Dashboard
                                </button>
                            )}

                            {/* CHANGE PASSWORD - COMMON FOR ALL ROLES */}
                            <button
                                onClick={() => navigateTo("/change-password")}
                                className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                            >
                                Change Password
                            </button>

                            <div className="my-3 border-t border-slate-200"></div>

                            {/* User Info */}
                            <div className="px-4 py-2">
                                <p className="text-sm font-semibold text-slate-800">
                                    {user?.name}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {isAdmin
                                        ? "Administrator"
                                        : isStoreOwner
                                            ? "Store Owner"
                                            : "Normal User"}
                                </p>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white"
                            >
                                Logout
                            </button>

                        </div>

                    </div>
                )}

            </div>
        </nav>
    );
};

export default Navbar;