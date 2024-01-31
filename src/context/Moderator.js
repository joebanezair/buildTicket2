import React from 'react'; 
import { useEffect, useState } from "react";
import { auth } from '../firebase/firebase';

export default function Moderator() {
  const [email, setEmail] = useState(null);
  useEffect(() => {
    // Set up an observer to listen for changes in the user's login state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, you can access their email
        const userEmail = user.email;
        setEmail(userEmail);
      } else {
        // User is signed out, clear the email
        setEmail(null);
      }
    });
    // Clean up the observer when the component unmounts
    return () => unsubscribe();
  }, []);

  const modValue = {
    email
  }
  return modValue;
}
