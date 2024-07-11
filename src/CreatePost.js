
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from './firebase'; // Ensure auth and storage are imported

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      setUploading(true);

      let imageUrl = '';
      if (image) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Save post data to Firestore
      const docRef = await addDoc(collection(db, 'posts'), {
        title,
        content,
        image: imageUrl, // Save the image URL
        createdAt: new Date(),
        userId: user.uid, // Include the userId
        username: user.displayName || user.email // Include the username

      });


      console.log("Document written with ID: ", docRef.id);
      // Reset form fields
      setTitle('');
      setContent('');
      setImage(null);
      setUploading(false);
    } catch (e) {
      console.error("Error adding document: ", e);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <input type="file" onChange={handleImageUpload} />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Create Post'}
      </button>
    </form>
  );
}

export default CreatePost;
