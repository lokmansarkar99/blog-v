import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostAuthor from '../components/PostAuthor';
import Loader from './../components/Loader';
import DeletePost from './DeletePost';
import { UserContext } from '../context/userContext';
import axios from 'axios';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [creatorID, setCreatorID] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`
        );
        setPost(response.data);
        setCreatorID(response.data.creator);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getPost();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="post-detail">
      {/* Only display error if it exists and convert it to string */}
      {error && <p className="error"> {error.message} </p>}

      {post && (
        <div className="container post-detail__container">
          <div className="post-datail__header">
            {/* Pass creatorID to PostAuthor */}
            <PostAuthor creator={creatorID} createdAt={post.createdAt} />

            {currentUser?.id === post?.creator && (
              <div className="post-detail__buttons">
                <Link
                  to={`/posts/${post?._id}/edit`}
                  className="btn sm primary"
                >
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>

          <h1>{post.title}</h1>
          <div className="post-detail__thumbnail">
            <img
              src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`}
              alt={post.title}
            />
          </div>
          <p>  <div dangerouslySetInnerHTML={{ __html: post.description }} />
 </p>
        </div>
      )}
    </section>
  );
};

export default PostDetail;
