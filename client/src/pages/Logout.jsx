import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data from localStorage or sessionStorage
    localStorage.removeItem('user'); // or sessionStorage.removeItem('user')

    // Update React context
    setCurrentUser(null);

    // Redirect to the login page
    navigate('/login');
  }, [setCurrentUser, navigate]);

  return null;
};

export default Logout;
