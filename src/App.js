

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ProfilePage from './ProfilePage'; // Import ProfilePage component
import CreatePost from './CreatePost'; // Import CreatePost component
import './App.css';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import necessary auth functions
import { auth, db } from './firebase'; // Import the auth and db module
import { collection, query, getDocs } from 'firebase/firestore'; // Import Firestore functions
import Post from './Post'; // Import the Post component

function App() {
  const [user, setUser] = useState(null); // Add user state
  const [posts, setPosts] = useState([]); // Move posts state to App component
  const [loading, setLoading] = useState(true); // Add loading state

  // Effect hook for authentication state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is logged in:', user);
        setUser(user);
      } else {
        console.log('User is logged out');
        setUser(null);
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching posts...');
        const q = query(collection(db, 'posts'));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Fetched posts:', postsData);
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchPosts();
  }, []); // Fetch posts when the component mounts

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
              <Link to={`/profile/${user.uid}`}>My Profile</Link> {/* Link to the user's profile */}
              <Link to="/create-post">Create Post</Link> {/* Link to the create post page */}
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
          This is the home of Prymr's test development site.
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <div className="feed">
                  {loading ? (
                    <p>Loading posts...</p> // Show loading message while fetching
                  ) : posts.length > 0 ? (
                    posts.map(post => (
                      <Post
                        key={post.id}
                        postId={post.id}
                        title={post.title}
                        content={post.content}
                        image={post.image}
                      />
                    ))
                  ) : (
                    <p>No posts available</p> // Show message if no posts are available
                  )}
                </div>
              }
            />
            <Route path="/profile/:userId" element={<ProfilePage />} /> {/* Add route for ProfilePage */}
            <Route path="/create-post" element={<CreatePost />} /> {/* Add route for CreatePost */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
