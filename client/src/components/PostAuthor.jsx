import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../images/avatar1.jpg'; // Default avatar
import axios from 'axios';

const PostAuthor = ({ createdAt, creator }) => {
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${creator}`
        );
        setAuthor(response?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAuthor();
  }, [creator]);

  // Format createdAt date
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <div>
      <Link to={`/posts/users/${creator}`} className="post__author">
        <div className="post__author-avatar">
          <img
            src={
              author?.avatar
                ? `${process.env.REACT_APP_ASSETS_URL}/uploads/${author.avatar}`
                : Avatar // Default avatar if no avatar found
            }
            alt={`${author?.name || 'Author'}'s avatar`}
          />
        </div>
        <div className="post__author-details">
          <h5>By: {author?.name || 'Unknown Author'}</h5>{' '}
          {/* Display creator name */}
          <small>{formattedDate}</small>
        </div>
      </Link>
    </div>
  );
};

export default PostAuthor;
