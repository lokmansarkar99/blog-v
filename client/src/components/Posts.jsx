import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostItem from './PostItem';
import Loader from './Loader';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts`
        );
        setPosts(response?.data || []); // Ensure posts is an array
       
      } catch (err) {
        console.log(err);
        setPosts([]); // Reset to an empty array on error
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <section className="posts">
      {isLoading ? (
        <Loader />
      ) : posts && posts.length > 0 ? (
        <div className="container posts__container">
          {posts.map(({ _id:id, thumbnail, category, title, description, creator, createdAt }) => (
            <PostItem
              key={id}
              postID={id}
              thumbnail={thumbnail || 'default-thumbnail.png'} // Set default value
              category={category || 'Uncategorized'}
              title={title || 'Untitled Post'}
              description={description || 'No description available.'}
              creator={creator || 'Unknown'}
              createdAt={createdAt}
            />
          ))}
        </div>
      ) : (
        <h2 className="center">No Posts Found</h2>
      )}
    </section>
  );
};

export default Posts;
