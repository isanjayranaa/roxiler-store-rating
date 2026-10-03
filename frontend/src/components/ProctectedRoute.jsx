import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const {
        user,
        loading,
        isAuthenticated
    } = useSelector((state) => state.auth);

    if (loading) {
        return <div>Checking authentication...</div>;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;