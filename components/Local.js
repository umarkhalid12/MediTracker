import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth'; // Firebase Auth import
import { setEmailToLocalStorage, getEmailFromLocalStorage } from './localStorageUtils'; // Import the storage utility

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser); // Set user data if authenticated
      setEmailToLocalStorage(currentUser.email); // Store the user's email in local storage
    } else {
      const storedEmail = getEmailFromLocalStorage();
      if (storedEmail) {
        // If user is not logged in, check for email in local storage
        setUser({ email: storedEmail });
      }
    }
  }, []);

  return { user }; // Return user object (with email)
};

export default useAuth;
