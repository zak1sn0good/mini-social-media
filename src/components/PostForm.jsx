import { useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { Card, Image, Input, Button } from "semantic-ui-react";
import authContext from "../authContext";
import { GET_POSTS_QUERY, CREATE_POST_MUTATION } from "../utils/graphql";
import ErrorsPortal from './ErrorsPortal';

const PostForm = () => {

  const { user } = useContext(authContext);

  const [postBody, setPostBody] = useState('');
  const [errors, setErrors] = useState(null);

  const handleInputChange = (e) => setPostBody(e.target.value);
  const handlePublish = (e) => {
    if(postBody.trim() !== ""){
      addPost();
    }
  };

  const [addPost, { loading }] = useMutation(CREATE_POST_MUTATION, {
    variables : {
      body : postBody
    },
    update : (cache, result, options) => {
      const data = cache.readQuery({
        query: GET_POSTS_QUERY
      });
      cache.writeQuery({
        query : GET_POSTS_QUERY, data : {
          getPosts : [result.data.createPost, ...data.getPosts]
        }
      });
      setPostBody('');
    },
    onError : (err) => {
      setErrors(err.message);
      setPostBody('');
    }
  });

  return (
    <>
      <Card fluid color="teal">
        <Card.Content>
          <Image
            floated="left"
            circular
            style={{ height : 50, width : 50 }}
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
          <Input
            loading={loading}
            value={postBody}
            onChange={handleInputChange}
            className="publish-input"
            type="text"
            placeholder={`what's up, ${user ? user.username : 'Dude'}?`}
            size="big"
            fluid
            disabled={loading}
          />
        </Card.Content>
        <Card.Content extra>
          <Button
            floated="right"
            content="publish"
            color="teal"
            icon="paper plane"
            onClick={handlePublish}
            loading={loading}
          />
        </Card.Content>
      </Card>
      <ErrorsPortal
        open={errors !== null}
        handleClose={() => setErrors(null)}
        errorHeader="failed to create post!"
        errorMessage={errors}
      />
    </>
  );
};

export default PostForm;