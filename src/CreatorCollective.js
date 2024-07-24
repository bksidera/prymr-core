import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

function CreatorCollective() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        console.log('Fetching creators...');
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const creatorList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched creators:', creatorList);
        setCreators(creatorList);
      } catch (error) {
        console.error("Error fetching creators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  if (loading) return <div>Loading creators...</div>;

  return (
    <div>
      <h1>Creator Collective</h1>
      {creators.length > 0 ? (
        <ul>
          {creators.map(creator => (
            <li key={creator.id}>
              <Link to={`/profile/${creator.id}`}>
                {creator.displayName || creator.email}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No creators found.</p>
      )}
    </div>
  );
}

export default CreatorCollective;
