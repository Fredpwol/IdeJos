import React from "react";
 
export const AuthContext = React.createContext({});

export const AuthProvider = ({children}) => {
    return(
    <AuthContext.Provider value={{
        user,
        setUser,
        login: async (email, password) => {
          await auth()
          .signInWithEmailAndPassword(email,password)
          .then(userInfo => {
            console.log(userInfo);
          })
          .catch(error => console.log(error))
  
        },
        register: async (email, password, username, number) => {
            await auth()
            .createUserWithEmailAndPassword(email, password)
            .then(userInfo => {
              firestore.collection("users")
              .doc(userInfo.user.uid)
              .set({
                phoneNumber:number,
                displayName:username
              })
              console.log(userInfo);
            })
            .catch(error => console.log(error))
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.error(e);
          }
        }}}>
            {children}
        </AuthContext.Provider>
    )
}

