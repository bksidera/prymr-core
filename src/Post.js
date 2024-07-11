

import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './firebase'; // Import Firestore
import Comment from './Comment';
import './Post.css'; // Importing the Post.css file

function Post({ title, content, image, postId, username }) {
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null); // Add user state if needed

  // Fetch comments from Firestore
  useEffect(() => {
    const q = query(collection(db, `posts/${postId}/comments`), orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, `posts/${postId}/comments`), {
        username: user ? user.displayName : 'Anonymous', // Store actual user displayName or 'Anonymous'
        content: comment,
        createdAt: new Date() // Add a timestamp field
      });
      setComment('');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  return (
    <div className="post">
      <h2>{title}</h2>
      <p>{content}</p>
      {image && <img src={image} alt={title} className="post-image" />}
      <p>Posted by: {username}</p> {/* Display the username */}
      <div className="like-section">
        <button onClick={handleLike} className="like-button">❤️</button>
        <span>{likes} likes</span>
      </div>

      <div className="comments-section">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">

            <p>Someone said ... {comment.content}</p> {/* Prepend "Someone" here */}
            <p><strong> - {comment.username}</strong></p>

          </div>
        ))}
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit">Post</button>
        </form>
      </div>


    </div>
  );
}

export default Post;
