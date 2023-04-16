import { useState, useContext } from "react";
import { Form, Message } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import authContext from '../authContext';
import { useEffect } from "react";
import jwt_decode from "jwt-decode";
const Login = () => {

  const { user, setUser } = useContext(authContext);

  const [values, setValues] = useState({
    username : '',
    password : ''
  });

  const [errors, setErrors] = useState(null);

  const handleChange = (e) => setValues(prev => ({ ...prev, [e.target.name] : e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  const navigate = useNavigate();

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    variables : {
      "username": values.username,
      "password": values.password
    },
    update : (cache, result, options) => {
      setUser(result.data.login);
      localStorage.setItem('token', result.data.login.token);
      navigate('/');
    },
    onError : (err) => {
      setErrors(err.graphQLErrors[0].extensions.errors);
    }
  });

  useEffect(() => {
    if(user){
      navigate('/');
    }else{
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
          navigate('/');
        }
      }
    }
  });

  return (
    <div className="page-wrapper">
      <Form className="register-form" size='large' onSubmit={handleSubmit} loading={loading} error={errors !== null ? true : false}>
        <Form.Input
          name="username"
          type="text"
          label="username:"
          placeholder="username..."
          value={values.username}
          onChange={handleChange}
          error={errors?.username ? true : false}
        />
        <Form.Input
          name="password"
          type="password"
          label="password:"
          placeholder="password..."
          value={values.password}
          onChange={handleChange}
          error={errors?.password ? true : false}
        />
        {
          errors
          && 
          <Message
            error
            header="invalid input"
            content={''.concat(Object.values(errors))}
            onDismiss={() => setErrors(null)}
          />
        }
        <Form.Button
          primary
          type='submit'
          content="Login"
        />
      </Form>
    </div>
  );
}

const LOGIN_MUTATION = gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    id
    email
    token
    username
    createdAt
  }
}
`;

export default Login;