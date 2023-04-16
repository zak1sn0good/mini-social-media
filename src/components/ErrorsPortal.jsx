import { useEffect } from "react";
import { Message, TransitionablePortal } from "semantic-ui-react";

const ErrorsPortal = ({ open, handleClose, errorMessage, errorHeader }) => {

  useEffect(() => {
    if(open){
      setTimeout(() => {
        handleClose();
      }, 5000);
    }
  }, [handleClose, open]);

  return (
    <TransitionablePortal open={open} transition={{ animation : 'fly up', duration : 750 }}>
      <Message
        style={{
          left: '5%',
          position: 'fixed',
          bottom: '5%',
          zIndex: 1000,
          padding : '20px 20px',
          width : '35%'
        }}
        onDismiss={handleClose}
        error
      >
        <Message.Header> {errorHeader} </Message.Header>
        <Message.Content> {errorMessage} </Message.Content>
      </Message>
    </TransitionablePortal>
  );
};
 
export default ErrorsPortal;