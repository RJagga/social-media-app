import './App.css';
import SignIn from './pages/SignIn';
import Home from './pages/Home/Home';
import Chat from './pages/Chat/Chat';
import Profile from './pages/Profile/Profile';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { useEffect, useState } from 'react';
import { authUser } from './apis/fetchapi';
import MessagePage from './components/specific/MessagePage/MessagePage';


const App = ()=>{
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [isFull, setIsFull] = useState(false);

  async function fetchUser() {

    const userData = await authUser();

    setUser(userData);
    setIsAuth(true);

  }
  useEffect(() => {
    fetchUser();
  }, []);



  useEffect(() => {
    setInterval(() => {
      if (window.innerWidth < 768) {
        setIsFull(false);
      }
      else {
        setIsFull(true);
      }
    }

      , 3000);
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ isAuth, setIsAuth, user, setUser, fetchUser }}>
        <BrowserRouter>
          {
            user ? (<>
              <Navbar />
              <div className='main-content-app'>
                <div className={`main-c-left ${isFull ? 'isFullclass' : ''}`}><Sidebar widthFull={`${isFull}`} /></div>
                <div className={`main-c-right ${isFull ? 'bodyshrink' : ''}`}>
                  <Routes>
                    <Route path='/profile/:userId' element={<Profile/>} />
                    <Route path='/' element={<Home />} />
                    <Route path='/chat' element={<Chat />}>
                      <Route path=':userId' element={<MessagePage />} />
                    </Route>
                    <Route path='/settings' element={<h3>Settings</h3>} />
                    <Route path='/trending' element={<h3>Trending posts on this platform</h3>} />
                  </Routes>
                </div>
              </div>
            </>
            ) : (<SignIn />)
          }
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  )
}

export default App;
