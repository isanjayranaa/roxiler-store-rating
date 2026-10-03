import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === "ADMIN") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "STORE_OWNER") {
        return <Navigate to="/owner/dashboard" replace />;
    }

    return <Navigate to="/user/dashboard" replace />;
};

export default Home;