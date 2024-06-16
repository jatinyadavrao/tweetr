import React ,{ useEffect } from "react";
import {  createContext, useState } from "react";
import io from 'socket.io-client'
import { backendUrl } from "../variable";
export const SocketContext = createContext();

export const SocketProvider = ({children})=>{
    const [socket,setSocket] = useState(null)

    useEffect(() => {

            const socketConnection = io(backendUrl);
            console.log("Socket initialized:", socketConnection);
            setSocket(socketConnection);
        
            return ()=>{
                socketConnection.close()
            }
       
    }, []);
    


    return (<SocketContext.Provider value={{socket}}>
        {children}
    </SocketContext.Provider>)
}