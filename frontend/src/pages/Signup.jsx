import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import api from "../services/api";

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


   const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
        const response = await api.post(
            "/auth/register",
            formData
        );

        dispatch(loginSuccess(response.data.user));

        navigate("/user/dashboard");

    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Something went wrong"
        );
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">

            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">

                <h1 className="text-3xl font-bold text-slate-900">
                    Create Account
                </h1>

                <p className="mt-2 text-slate-500">
                    Create your Roxiler account
                </p>

                {error && (
                    <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            maxLength={60}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                        />

                        <p className="mt-1 text-xs text-slate-400">
                            {formData.name.length}/60 characters
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            maxLength={16}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                        />

                        <p className="mt-1 text-xs text-slate-400">
                            8–16 characters, 1 uppercase and 1 special character
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            maxLength={400}
                            rows={4}
                            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                        />

                        <p className="mt-1 text-xs text-slate-400">
                            {formData.address.length}/400 characters
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="font-semibold text-orange-500 hover:text-orange-600"
                    >
                        Login
                    </button>
                </p>

            </div>

        </div>
    );
};

export default Signup;