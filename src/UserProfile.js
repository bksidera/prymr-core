// UserProfile.js
import React from 'react';
import { getAuth } from "firebase/auth";

const auth = getAuth();

function UserProfile() {
  const user = auth.currentUser;

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.displayName}!</h1>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>No user is signed in.</p>
      )}
    </div>
  );
}

export default UserProfile;
