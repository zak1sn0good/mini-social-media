import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import './App.css'
import authContext from './authContext';
import { useState } from 'react';
import SinglePost from './pages/SinglePost';

function App() {

  const [user, setUser] = useState(null);

  return (
    <authContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <MenuBar/>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route exact path='/login' element={<Login/>} />
          <Route exact path='/register' element={<Register/>} />
          <Route exact path='/posts/:postId' element={ <SinglePost/>} />
        </Routes>
      </BrowserRouter>
    </authContext.Provider>
  );
}

export default App;
