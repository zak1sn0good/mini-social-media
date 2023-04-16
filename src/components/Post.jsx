import { Card, Button, Image, Icon, Label, Transition } from "semantic-ui-react";
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useMutation } from "@apollo/client";
import { GET_POSTS_QUERY, LIKE_POST_MUTATION, DELETE_POST_MUTATION } from "../utils/graphql";
import { useContext } from "react";
import authContext from "../authContext";
import { useState } from "react";
import ErrorsPortal from "./ErrorsPortal";
import LikesModal from "./LikesModal";

const Post = ({ postId, username, body, createdAt, commentsCount, likesCount, likes, comments }) => {

  const { user } = useContext(authContext);

  const [error, setError] = useState(null);

  const handleLikePost = (e) => {
    likePost();
  };

  const [likePost, { loading : likeLoading }] = useMutation(LIKE_POST_MUTATION, {
    variables : {
      postId : postId
    },
    onError : (err) => {
      setError(err.message);
    },
    update : (cache, result, options) => {
      const data = cache.readQuery({
        query : GET_POSTS_QUERY,
      });
      cache.writeQuery({
        query  : GET_POSTS_QUERY,
        data : {
          getPosts : data.getPosts.map(post => post.id === result.data.likePost.id ? result.data.likePost : post)
        }
      });
    }
  }) ;

  const handleDelete = () => {
    deletePost();
  };

  const [deletePost, { loading : deleteLoading }] = useMutation(DELETE_POST_MUTATION, {
    variables : {
      postId : postId
    },
    onError : (err) => {
      setError(err.message);
    },
    update : (cache, result, options) => {
      const data = cache.readQuery({
        query : GET_POSTS_QUERY,
      });
      cache.writeQuery({
        query  : GET_POSTS_QUERY,
        data : {
          getPosts : data.getPosts.filter(post => post.id !== options.variables.postId)
        }
      });
    }
  });

  const [modalState, setModalState] = useState(false);

  const [hovered, sethovered] = useState(false);

  return (
    <>
      <Card fluid onMouseEnter={() => sethovered(true)} onMouseLeave={() => sethovered(false)} >
        <Card.Content as={Link} to={`/posts/${postId}`}>
          <Image
            circular
            floated='right'
            size='mini'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
          <Card.Header>{username}</Card.Header>
          <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
          <Card.Description>
            {body}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="row-wrapper">
            <div>
              <Transition visible={user && user.username === username && hovered} animation='scale' duration={500}>
                <Button
                  circular
                  color="red"
                  icon="trash"
                  onClick={handleDelete}
                  loading={deleteLoading}
                />
              </Transition>
            </div>
            <div>
              <Button as='div' labelPosition='right'>
                <Button color='teal' basic={user ? !likes.some(like => like.username === user.username) : true} onClick={handleLikePost} loading={likeLoading}>
                  <Icon name='heart' />
                </Button>
                <Label basic color='teal' pointing='left' onClick={() => setModalState(true)}>
                  {likesCount}
                </Label>
              </Button>
              <Button as='div' labelPosition='right'>
                <Button basic color='blue'>
                  <Icon name='comments' /> Comments
                </Button>
                <Label as='a' basic color='blue' pointing='left'>
                  {commentsCount}
                </Label>
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
      <LikesModal
        open={modalState}
        likes={likes}
        handleClose={() => setModalState(false)}
      />
      <ErrorsPortal
        errorHeader="failed to like post!"
        errorMessage={error}
        open={error !== null}
        handleClose={() => setError(null)}  
      />
    </>
  );
};

export default Post;