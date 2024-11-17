import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Posts from './../components/Posts';
import PostItem from '../components/PostItem';
import Loader from '../components/Loader';
import axios from 'axios';
const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {id} = useParams()
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`
        );
        setPosts(response?.data || []); // Ensure posts is an array
      } catch (err) {
        console.log(err);
        setPosts([]); // Reset to an empty array on error
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, [id]);

  return (
    <section className="posts">
      {isLoading ? (
        <Loader />
      ) : posts && posts.length > 0 ? (
        <div className="container posts__container">
          {posts.map(
            ({
              _id: id,
              thumbnail,
              category,
              title,
              description,
              creator,
              createdAt,
            }) => (
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
            )
          )}
        </div>
      ) : (
        <h2 className="center">No Posts Found</h2>
      )}
    </section>
  );
};

export default AuthorPosts;
