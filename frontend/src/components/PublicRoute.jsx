import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    if (isAuthenticated && user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;