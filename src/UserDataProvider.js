import React, {createContext, useState } from 'react';

export const userDataContext = createContext();

export function UserDataProvider({children}) {
  const [contacts, setContacts] = useState([]);
  const [requestSent, setRequestSent] = useState([]);
  const [requestRecieved, setRequestRecieved] = useState([]);
  const [userData, setUserData] = useState({})
  return (
    <userDataContext.Provider
      value={{
        contacts,
        setContacts,
        requestRecieved,
        setRequestRecieved,
        requestSent,
        userData,
        setUserData,
        setRequestSent,
        checkUser: (uid) => {
            console.log("checkUser: ", uid)
          for (let i = 0; i < contacts.length; i++) {
            if (contacts[i]._id == uid) {
              return true;
            }
          }
          return false;
        },
        checkSent: (uid) => {
            console.log("checkSent: ", uid)
          for (let i = 0; i < requestSent.length; i++) {
            if (requestSent[i]._id == uid) {
              return true;
            }
          }
          return false;
        },
      }}>
      {children}
    </userDataContext.Provider>
  );
}
