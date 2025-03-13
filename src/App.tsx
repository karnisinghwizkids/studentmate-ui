import React, { useEffect } from 'react';
import Home from './Home/Home';
import './App.css';
import { login } from './api/client'; // Import login function

function App() {
  useEffect(() => {
    // Example credentials for login
    const credentials =
    {
      "email": "test@example.com",
      "password": "test123"
    }

    const handleLogin = async () => {
      try {
        const response = await login(credentials);
        console.log('Login successful:', response.data);
      } catch (error) {
        console.error('Login failed:', error);
      }
    };

    handleLogin(); // Call login on component mount (for testing)
  }, []);

  return (
    <Home />
  );
}

export default App;
