// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../variable';

// Create the context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect( () => {
  
   
    const isLoggedIn = async()=>{
         try{
    const response =  await axios.get(`${backendUrl}/api/v1/isloggedin`,{withCredentials:true})
         console.log(response.data.data)
          setUser(response.data.data);
          setLoading(false);
        }
        catch(error) {
          console.error('Token verification failed', error);
          setLoading(false);
        }
    }
    setLoading(true);
    isLoggedIn()
  }, []);



  return (
    <UserContext.Provider value={{ user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};
