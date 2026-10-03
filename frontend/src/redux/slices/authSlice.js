import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loading: false,
    isAuthenticated: false
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },

        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        },

        loginFail: (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        },

        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        }
    }
});

export const {
    loginStart,
    loginSuccess,
    loginFail,
    logoutUser
} = authSlice.actions;

export default authSlice.reducer;