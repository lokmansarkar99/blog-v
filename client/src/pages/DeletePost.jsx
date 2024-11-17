import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import Loader from '../components/Loader';

const DeletePost = ({ postId }) => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const token = currentUser?.token;
  const [isLoading, setIsLoading] = useState(false)

  // Redirect to login page if the user is not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Function to handle post deletion
  const handleDelete = async () => {
    setIsLoading(true)
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        // Make DELETE request
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/posts/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // Include token in the header
          }
        );

        alert('Post deleted successfully!');
        navigate('/'); // Redirect to homepage or a posts list page
        setIsLoading(false)
      } catch (error) {
        console.error('Error deleting the post:', error);
        alert('Failed to delete the post. Please try again.');
      }
    }
  };

  if (isLoading) {
    return <Loader/>
  }

  return (
    <Link className="btn sm danger" onClick={handleDelete}>
      Delete
    </Link>
  );
};

export default DeletePost;
