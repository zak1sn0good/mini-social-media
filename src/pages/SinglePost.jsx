import { useContext } from "react";
import { useEffect } from "react";
import { Grid, Message, Loader, Card, Image, Button, Label, Icon } from "semantic-ui-react";
import authContext from "../authContext";
import jwt_decode from "jwt-decode"; 
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_POST_QUERY, LIKE_POST_MUTATION } from "../utils/graphql"; 
import { useState } from "react";
import LikesModal from "../components/LikesModal";
import ErrorsPortal from "../components/ErrorsPortal";
import moment from "moment";
import Comments from "../components/Comments";

const SinglePost = () => {

  const { user, setUser } = useContext(authContext);

  const { postId } = useParams();
  
  const { loading, error, data : postData } = useQuery(GET_POST_QUERY, {
    variables : {
      postId : postId 
    }
  });

  const handleLikePost = (e) => {
    likePost();
  };

  const [likePost, { loading : likeLoading }] = useMutation(LIKE_POST_MUTATION, {
    variables : {
      postId : postId
    },
    onError : (err) => {
      setLikeError(err.message);
    },
    update : (cache, result, options) => {
      cache.writeQuery({
        query  : GET_POST_QUERY,
        data : {
          getPost : result.data.likePost
        }
      });
    }
  });

  const [likeError, setLikeError] = useState(null);
  const [modalState, setModalState] = useState(false);

  useEffect(() => {
    if(!user){
      if(localStorage.getItem('token')){
        const decodedToken = jwt_decode(localStorage.getItem('token'));
        if(decodedToken.exp * 1000 < Date.now()){
          localStorage.removeItem('token');
        }else{
          setUser({
            id : decodedToken.id,
            username : decodedToken.username,
            email : decodedToken.email,
            token : localStorage.getItem('token'),
            createdAt : null
          });
        }
      }
    }
  }, [user, setUser]);

  return (
    <div className="page-wrapper">
      { loading && <Loader active size='big'>Loading</Loader> }
      { error 
        &&
        <Message className="home-error-message" negative>
          <Message.Header> {error.message} </Message.Header>
          <p>error while loading post!</p>
        </Message> 
      }
      {
        postData &&
        <Grid columns={1} className="grid">
          <Grid.Row>
            <Card fluid>
              <Card.Content>
                <Image
                  circular
                  floated='right'
                  size='mini'
                  src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{postData.getPost.username}</Card.Header>
                <Card.Meta>{moment(postData.getPost.createdAt).fromNow()}</Card.Meta>
                <Card.Description>
                  {postData.getPost.body}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="row-wrapper">
                  <div>
                    {/* here delete post! */}
                  </div>
                  <div>
                    <Button as='div' labelPosition='right'>
                      <Button color='teal' basic={user ? !postData.getPost.likes.some(like => like.username === user.username) : true} onClick={handleLikePost} loading={likeLoading}>
                        <Icon name='heart' />
                      </Button>
                      <Label basic color='teal' pointing='left' onClick={() => setModalState(true)}>
                        {postData.getPost.likesCount}
                      </Label>
                    </Button>
                    <Button as='div' labelPosition='right'>
                      <Button basic color='blue'>
                        <Icon name='comments' /> Comments
                      </Button>
                      <Label as='a' basic color='blue' pointing='left'>
                        {postData.getPost.commentsCount}
                      </Label>
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
            <LikesModal
              likes={postData.getPost.likes}
              open={modalState}
              handleClose={() => setModalState(false)}
            />
            <ErrorsPortal
              errorHeader="failed to like post!"
              errorMessage={likeError}
              open={likeError !== null}
              handleClose={() => setLikeError(null)}  
            />            
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              { postData && <Comments comments={postData.getPost.comments} postId={postId} />}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      }
    </div>
  );
}
 
export default SinglePost;