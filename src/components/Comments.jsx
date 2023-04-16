import { Comment, Form, Header, Button } from "semantic-ui-react";
import moment from "moment";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_COMMENT_MUTATION } from "../utils/graphql";
import ErrorsPortal from "./ErrorsPortal";

const Comments = ({ comments, postId }) => {

  const [commentBody, setCommentBody] = useState('');
  const [error, setError] = useState(null);

  const handleAddComment = () => {
    if(commentBody.trim() !== ''){
      addComment();
    }
  };

  const [addComment, { loading }] = useMutation(CREATE_COMMENT_MUTATION, {
    variables : {
      postId : postId,
      body : commentBody
    },
    onError : (err) => {
      setError(err.message);
    },
    update : (cache, result, options) => {
      setCommentBody('');
    }
  });

  return (
    <Comment.Group style={{ maxWidth : "100%" }} size="large" >
      <Header as='h3' dividing>
        Comments
      </Header>
      {
        comments.map((comment) => (
          <Comment key={comment.id}>
            <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
            <Comment.Content>
              <Comment.Author as='a'>{comment.username}</Comment.Author>
              <Comment.Metadata>
                <div> { moment(comment.createdAt).fromNow() } </div>
              </Comment.Metadata>
              <Comment.Text>{comment.body}</Comment.Text>
            </Comment.Content>
          </Comment>
        ))
      }
      <Form style={{ marginTop : '40px' }}>
        <Form.Input
          loading={loading} 
          type="text" 
          size="large" 
          placeholder="add a comment..." 
          value={commentBody} 
          onChange={(e) => setCommentBody(e.target.value)} 
        />
        <Button
          loading={loading} 
          onClick={handleAddComment} 
          content='Add a comment' 
          labelPosition='right' icon='commenting' 
          color="teal"
        />
      </Form>
      <ErrorsPortal
        errorHeader="failed to post comment!"
        errorMessage={error}
        open={error !== null}
        handleClose={() => setError(null)}
      />
    </Comment.Group>
  );
}
 
export default Comments;