import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface User {
    username?: string;
    role?: string;
    [key: string]: any; // Allow other user properties
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

interface LoginPayload {
    user: User;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        login:(state, action: PayloadAction<LoginPayload>)=>{
            state.isAuthenticated=true;
            state.user=action.payload?.user;
            // Tokens are stored in httpOnly cookies, not in Redux
        },
        logout:(state)=>{
            state.isAuthenticated=false;
            state.user=null;
            // Cookies are cleared by backend logout endpoint
        }
    }
})

export const {login,logout}=authSlice.actions;
export default authSlice.reducer;
