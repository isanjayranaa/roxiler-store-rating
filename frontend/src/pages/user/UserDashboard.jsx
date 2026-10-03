import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const UserDashboard = () => {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedRatings, setSelectedRatings] = useState({});
    const [ratingLoading, setRatingLoading] = useState(false);
    const [ratingError, setRatingError] = useState("");

    const fetchStores = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/stores/user");

            setStores(response.data.stores || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load stores"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleRatingSelect = (storeId, rating) => {
        setSelectedRatings({
            ...selectedRatings,
            [storeId]: rating
        });

        setRatingError("");
    };

    const handleRatingSubmit = async (store) => {
        const rating = selectedRatings[store.id];

        if (!rating) {
            setRatingError("Please select a rating");
            return;
        }

        try {
            setRatingLoading(true);
            setRatingError("");

            const userRating = Number(store.user_rating);

            if (userRating > 0) {
                await api.put("/ratings/update", {
                    storeId: store.id,
                    rating
                });
            } else {
                await api.post("/ratings", {
                    storeId: store.id,
                    rating
                });
            }

            await fetchStores();

        } catch (error) {
            setRatingError(
                error.response?.data?.message ||
                "Failed to submit rating"
            );
        } finally {
            setRatingLoading(false);
        }
    };

    const filteredStores = stores.filter((store) => {
        const name = store.name?.toLowerCase() || "";
        const address = store.address?.toLowerCase() || "";
        const value = search.toLowerCase();

        return (
            name.includes(value) ||
            address.includes(value)
        );
    });

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                <div className="mb-8">
                    <p className="text-sm font-semibold tracking-wide text-orange-500">
                        STORE DISCOVERY
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                        Discover & Rate Stores
                    </h1>

                    <p className="mt-2 max-w-2xl text-slate-500">
                        Find stores, check ratings, and share your
                        experience with the community.
                    </p>
                </div>

                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by store name or address..."
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                </div>

                {ratingError && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {ratingError}
                    </div>
                )}

                <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-900">
                        Available Stores
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {filteredStores.length} stores available
                    </p>
                </div>

                {loading && (
                    <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
                        <p className="text-slate-500">
                            Loading stores...
                        </p>
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-red-600">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    filteredStores.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">

                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
                                🏪
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800">
                                No stores found
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Try searching with a different name or address.
                            </p>

                        </div>
                    )}

                {!loading &&
                    !error &&
                    filteredStores.length > 0 && (

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                            {filteredStores.map((store) => {

                                const currentRating =
                                    selectedRatings[store.id] ||
                                    Number(store.user_rating) ||
                                    0;

                                const hasRated =
                                    Number(store.user_rating) > 0;

                                return (
    <div
        key={store.id}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >

        {store.image_url?.url ? (
            <img
                src={store.image_url.url}
                alt={store.name}
                className="h-48 w-full object-cover"
            />
        ) : (
            <div className="flex h-48 w-full items-center justify-center bg-orange-50 text-5xl">
                🏪
            </div>
        )}

        <div className="p-6">

            <h3 className="text-lg font-bold text-slate-900">
                {store.name}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
                {store.address}
            </p>

            <div className="mt-5 border-t border-slate-100 pt-4">

                <p className="text-sm text-slate-500">
                    Overall Rating
                </p>

                <p className="mt-1 text-lg font-semibold text-orange-500">
                    ⭐ {Number(store.overall_rating).toFixed(1)}
                </p>

            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">

                <p className="text-sm font-medium text-slate-700">
                    {hasRated
                        ? "Your Rating"
                        : "Rate this Store"}
                </p>

                <div className="mt-2 flex gap-1">

                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() =>
                                handleRatingSelect(
                                    store.id,
                                    star
                                )
                            }
                            className={`text-2xl transition ${
                                star <= currentRating
                                    ? "text-orange-500"
                                    : "text-slate-300"
                            } hover:scale-110`}
                        >
                            ★
                        </button>
                    ))}

                </div>

                <button
                    type="button"
                    onClick={() =>
                        handleRatingSubmit(store)
                    }
                    disabled={ratingLoading}
                    className="mt-4 w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {ratingLoading
                        ? "Saving..."
                        : hasRated
                            ? "Update Rating"
                            : "Submit Rating"}
                </button>

            </div>

        </div>

    </div>
);
                            })}

                        </div>
                    )}

            </main>
        </div>
    );
};

export default UserDashboard;