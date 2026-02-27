import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthDataContext } from "./AuthContext";
import axios from "axios";
export const UserDataContext = createContext()

function UserContext({children}) {
    let {serverUrl} = useContext(AuthDataContext)
    let [userData, setUserData] =useState(null);

    const getCurrentUser = async() => {
        try{
            let result = await axios.get(serverUrl + "/api/user/currentuser", {withCredentials: true});
            setUserData(result.data);
        }catch(error){
            setUserData(null);
            console.log("Error fetching current user:", error);
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, [])



    let value ={
        userData,setUserData
    }
    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    )
}

export default UserContext