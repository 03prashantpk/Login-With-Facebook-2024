// authContext.js

import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userID, setUserID] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  const allData = {
    userID,
    setUserID,
    userToken,
    setUserToken,
    userEmail,
    setUserEmail,
    userName,
    setUserName,
  };


  return (
    <AuthContext.Provider
      value={{
        allData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
