

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import Post from './Post'; // Import the Post component

function ProfilePage() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {

        // Fetch user data
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUser({ id: userDoc.id, ...userDoc.data() });
        }


        // Fetch posts
        const q = query(collection(db, 'posts'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching user data and posts:", error);
      }
    };

    fetchUserAndPosts();
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      
      <h1>{user.displayName || user.email}'s Profile</h1>

      <div className="feed">
        {posts.map(post => (
          <Post 
            key={post.id} 
            postId={post.id} 
            title={post.title} 
            content={post.content} 
            image={post.image}
            username={user.displayName || user.email} // Changed to use user data
          />
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
