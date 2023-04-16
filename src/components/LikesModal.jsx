import { List, Modal, Button, Image } from "semantic-ui-react";
import moment from 'moment';

const LikesModal = ({ open, handleClose, likes }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="mini"
      dimmer="blurring"
    >
      <Modal.Header>Post likes</Modal.Header>
      <Modal.Content scrolling>
        <List>
          {
            likes.map(item => (
              <List.Item key={item.id}>
                <Image
                  size="mini" 
                  circular 
                  src='https://react.semantic-ui.com/images/avatar/large/molly.png' 
                />
                <List.Content>
                  <List.Header> {item.username} </List.Header>
                  <List.Description>{moment(item.createdAt).fromNow()}</List.Description>
                </List.Content>
              </List.Item>
            ))
          }
          {
            likes.length === 0
            &&
            <h3>No likes yet on this post!</h3>
          }
        </List>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>
          close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
 
export default LikesModal;