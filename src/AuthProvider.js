import React, {createContext, useContext} from "react";

import {auth} from "./Firebase";
import {useAuthState} from "react-firebase-hooks/auth";

const UserContext = createContext(null);

export default function UserProvider(props){
    const [user] = useAuthState(auth);

    return(
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    )
}

export const useUserStore = () => useContext(UserContext);