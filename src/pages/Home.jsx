import { useQuery } from '@apollo/client';
import { Grid, Loader, Message, Transition } from 'semantic-ui-react';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import { useContext, useEffect } from 'react';
import authContext from '../authContext';
import jwt_decode from 'jwt-decode';
import { GET_POSTS_QUERY } from '../utils/graphql';

const Home = () => {
  
  const { user, setUser } = useContext(authContext);

  const { loading, error, data } = useQuery(GET_POSTS_QUERY);

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
          <p>error while loading posts!</p>
        </Message> 
      }
      { data 
        &&
        <Grid columns={1} className="grid">
          <Grid.Row>
            <Grid.Column>
            {
              user ?
              <PostForm/>
              :
              <Message 
                icon="inbox"
                header="Don't miss what's happening!"
                content="login or register to keep up with the latest!"
              />
            }
            </Grid.Column>
          </Grid.Row>
          <Transition.Group duration={1000} animation="fade">
            {
              data.getPosts.map(post => (
                <Grid.Row  key={post.id}>
                  <Grid.Column>
                    <Post 
                      postId={post.id}
                      body={post.body} 
                      username={post.username} 
                      createdAt={post.createdAt} 
                      likesCount={post.likesCount} 
                      commentsCount={post.commentsCount}
                      likes={post.likes}
                      comments={post.comments} 
                    />
                  </Grid.Column>
                </Grid.Row>
              ))
            }
          </Transition.Group>
        </Grid>
      }
    </div>
  );
}
 
export default Home;