import { createSlice } from "@reduxjs/toolkit";
const initialState={
    user:null,
    isAuthenticated:false,
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        login:(state,action)=>{
            state.user=action.payload;
            state.isAuthenticated=true;
        },
        logout:(state)=>{
            localStorage.clear();
            state.user=null;
            state.isAuthenticated=false;
        }
    },
});


export default authSlice.reducer;
export const {login,logout}=authSlice.actions;