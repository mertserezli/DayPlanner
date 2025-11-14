import React, { createContext, useContext } from 'react';

import { auth } from './Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PropTypes from 'prop-types';

const UserContext = createContext(null);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default function AuthProvider({ children }) {
  const [user, loading] = useAuthState(auth);
  return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>;
}

export const useUserStore = () => useContext(UserContext);
