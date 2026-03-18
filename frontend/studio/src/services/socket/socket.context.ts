import React, { createContext, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import socketService from "./socketService";

const SocketContext = createContext();
export const useSocket = () => {
    return useContext(SocketContext);
};
const SocketProvider = ({ children }) => {
    const dispatch = useDispatch();
    const access_token = localStorage.getItem("access_token");


    useEffect(() => {

        //initialize the socket connection
        socketService.initSocket(access_token, dispatch);

        return () => {
            //cleanup the socket connection
            socketService.disconnect();
        }
    }, [access_token]);

    return (
        <SocketContext.Provider value={socketService}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;
