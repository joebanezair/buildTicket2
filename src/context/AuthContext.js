import React, { useContext, useState, useEffect } from "react"
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase/firebase"
const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const history = useNavigate()

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
    .then(alert(`user signed up`))
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      setCurrentUser(user)
      history('/admin')

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
    });
  
  }
  
  function logout() {
    return signOut(auth)
    .then(()=>{
      history('/login')
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email) 
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
