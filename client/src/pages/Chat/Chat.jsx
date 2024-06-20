import React, { useContext, useEffect } from 'react'
import ChatList from '../../components/specific/ChatList/ChatList'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './Chat.css'
import { useDispatch, useSelector } from 'react-redux'
import io from 'socket.io-client';
import { logout, setOnlineUser, setSocketConnection,  } from '../../redux/userSlice'
import { AuthContext } from '../../contexts/AuthContext'

const Chat = () => {
  // const user = useSelector(state => state.user)
  const {user,setUser }= useContext(AuthContext);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  
  // const fetchUserDetails = async () => {
  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_ADDR}/api/user-details`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //     });

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const data = await response.json();
  //     dispatch(setUser(data.data));

  //     if (data.data.logout) {
  //       dispatch(logout());
  //       navigate('/');
  //     }

  //     console.log('current user Details', data);
  //   } catch (error) {
  //     console.error('Error fetching user details:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserDetails();
  // }, []);

  function getTokenFromCookies() {
    const name = 'token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookiesArray = decodedCookie.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return '';
}

// socketService.js

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(import.meta.env.VITE_REACT_APP_BACKEND_ADDR, {
      auth: {
        token: getTokenFromCookies(),
      },
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  getSocket() {
    return this.socket;
  }
}

const socketService = new SocketService();


  // Socket connection
  useEffect(() => {
    const socketConnection = socketService.connect();

    socketConnection.on('onlineUser', (data) => {
      // console.log(data)
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return () => {
      socketConnection.disconnect()
    }
  }, [])

  const basepath = location.pathname === '/chat';
  return (
    <div className='chat-body'>
      <section className='chats'>
        <ChatList />
      </section>
      <section className={`message ${basepath ? "" : "page"}`}>
        <Outlet/>
      </section>
    </div>
  )
}

export default Chat