import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import  { createContext, useEffect, useState } from 'react';
import { app } from '../firebase/firebase.config';

export const authContext= createContext(null);
const auth = getAuth(app);
const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();


    const googleSignIn = ()=>{
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, currentUser =>{
          setUser(currentUser)
          setLoading(false)
    
        })
        return ()=>{
          unsubscribe()
        }
    
       },[])


       const authInfo = {
        googleSignIn,
        user,
        setUser,
        loading,
        setLoading
       }

    return (
        <div>
             <authContext.Provider value={authInfo}>{children}</authContext.Provider>
        </div>
    );
};

export default AuthProvider;