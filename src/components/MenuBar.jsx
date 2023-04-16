import { useState } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import authContext from '../authContext';
import jwt_decode from 'jwt-decode';

const MenuBar = () => {
  
  const { user, setUser } = useContext(authContext);

  const navigate = useNavigate();

  const [activeItem, setActiveItem] = useState('home');
  
  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    navigate(`/${name === 'home' ? '' : name}`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/');
  };

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
      }else{
        const pathName = window.location.pathname;
        const path = pathName === '/' ? 'home' : pathName.substring(1);
        setActiveItem(path);
      }
    }
  }, [user, setUser]);

  return (
    <>
    {
      user ?
        <Menu pointing secondary size='huge' color='teal' className="menu-bar">
          <Menu.Item
            name={user.username}
            active
            as={ Link }
            to="/"
          />
          <Menu.Menu position='right'>
            <Menu.Item
              name='disconnect'
              onClick={handleLogout}
            />
          </Menu.Menu>
        </Menu>
      :
        <Menu pointing secondary size='huge' color='teal' className="menu-bar">
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={handleItemClick}
          />
          <Menu.Menu position='right'>
            <Menu.Item
              name='login'
              active={activeItem === 'login'}
              onClick={handleItemClick}
            />
            <Menu.Item
              name='register'
              active={activeItem === 'register'}
              onClick={handleItemClick}
            />
          </Menu.Menu>
        </Menu>
    }
    </>
  )    
}

export default MenuBar;