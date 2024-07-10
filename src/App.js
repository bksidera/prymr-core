import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import './App.css';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase'; // Import the auth module
import Post from './Post'; // Import the Post component

function App() {
  // State hooks
  const [user, setUser] = useState(null); // Add user state
  const [username, setUsername] = useState('');
  
  // Array of posts
  const posts = [
    { id: 1, title: 'First Post', content: 'This is the content of the first post.', image: '/images/board1.jpg' },
    { id: 2, title: 'Second Post', content: 'This is the content of the second post.', image: 'images/board2.jpg' },
    { id: 3, title: 'Third Post', content: 'This is the content of the third post.', image: 'images/board3.jpg' },
    { id: 4, title: 'Fourth Post', content: 'This is the content of the fourth post.', image: 'images/board4.jpg' },
    { id: 5, title: 'Fifth Post', content: 'This is the content of the fifth post.', image: 'images/board5.jpg' },
    { id: 6, title: 'Sixth Post', content: 'This is the content of the sixth post.', image: 'images/board6.jpg' },
    // Add more posts as needed
  ];

  // Effect hook for authentication state observer
  useEffect(() => {
    // Observer for authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUsername(user.displayName || user.email); // Set the username to displayName or email if displayName is not set
      } else {
        setUser(null);
        setUsername(''); // Reset the username when the user logs out
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();

  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };


  return (
    <Router>
      <div className="App">
        <div className="header">
        Welcome to Prymr!
        </div>


        <div className="nav-links">
          <Link to="/">Home</Link>
          {user ? (
            <>
              <span className="user-status">Welcome, {user.displayName || user.email}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>

        <div className="content">
          This is the future home of Prymr's test development site.
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={
              <div className="feed">
                {posts.map(post => (
                  <Post key={post.id} postId={post.id} title={post.title} content={post.content} image={post.image} />
                ))}
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
