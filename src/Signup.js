// Signup 

import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from './firebase';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Define the state for username



  
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username }); // Set the username
      alert('User created successfully. Welcome to Prymr!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Handle username change
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;

