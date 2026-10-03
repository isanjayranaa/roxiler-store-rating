import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    loginSuccess,
    loginFail
} from "../redux/slices/authSlice";
import api from "../services/api";

const AuthCheck = ({ children }) => {
    const dispatch = useDispatch();

    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await api.get("/auth/me");

                dispatch(loginSuccess(response.data.user));
            } catch (error) {
                dispatch(loginFail());
            } finally {
                setChecking(false);
            }
        };

        checkAuthentication();
    }, [dispatch]);

    if (checking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-slate-500">
                    Checking authentication...
                </p>
            </div>
        );
    }

    return children;
};

export default AuthCheck;