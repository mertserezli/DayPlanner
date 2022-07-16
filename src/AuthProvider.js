import React, {createContext, useContext} from "react";

import firebase from 'firebase/app';
import 'firebase/auth';
import {useAuthState} from "react-firebase-hooks/auth";

const UserContext = createContext(null);

const auth = firebase.auth();

export default function UserProvider(props){
    const [user] = useAuthState(auth);

    return(
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    )
}

export const useUserStore = () => useContext(UserContext);