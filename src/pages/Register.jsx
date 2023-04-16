import { useState, useContext, useEffect } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom'; 
import authContext from '../authContext';
import jwt_decode from 'jwt-decode';

const Register = () => {

  const { user, setUser } = useContext(authContext);

  const [values, setValues] = useState({
    username : '',
    email : '',
    password : '',
    confirmPassword : ''
  });

  const [errors, setErrors] = useState(null);

  const handleChange = (e) => setValues(prev => ({ ...prev, [e.target.name] : e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    addUser();
  };

  const navigate = useNavigate();

  const [addUser, { loading }] = useMutation(REGISTER_MUTATION, {
    update : (cache, result, options) => {
      setUser(result.data.register);
      localStorage.setItem('token', result.data.register.token);
      navigate('/');
    },
    onError : (err) => {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables : {
      "registerInput": {
        "confirmPassword": values.confirmPassword,
        "email": values.email,
        "password": values.password,
        "username": values.username
      }
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
          name="email"
          type='email'
          label="e-mail address:"
          placeholder="example@test.com..."
          value={values.email}
          onChange={handleChange}
          error={errors?.email ? true : false}
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
        <Form.Input
          name="confirmPassword"
          type="password"
          label="confirm password:"
          placeholder="confirm password..."
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors?.confirmPassword ? true : false}
        />
        {
          errors
          && 
          <Message
            error
            header="invalid input"
            content={''.concat(Object.values(errors))}
          />
        }
        <Form.Button
          primary
          type='submit'
          content="Register"
        />
      </Form>
    </div>
  );
}

const REGISTER_MUTATION = gql`
mutation Register($registerInput: RegisterInput) {
  register(registerInput: $registerInput) {
    id
    email
    token
    username
    createdAt
  }
}
`;
 
export default Register;