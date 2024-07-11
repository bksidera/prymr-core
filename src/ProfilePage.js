

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Post from './Post'; // Import the Post component

function ProfilePage() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log(`Fetching posts for userId: ${userId}`);
        const q = query(collection(db, 'posts'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Fetched posts:', postsData);
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <div>
      <h1>Creator Profile</h1>
      <div className="feed">
        {posts.map(post => (
          <Post 
            key={post.id} 
            postId={post.id} 
            title={post.title} 
            content={post.content} 
            image={post.image}
            username={post.username} // Pass the username prop
          />
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
