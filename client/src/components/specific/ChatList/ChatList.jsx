import React, { useContext, useEffect, useState } from 'react'
import TextsmsIcon from '@mui/icons-material/Textsms';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import SearchUser from './SearchUser';

import { AuthContext } from '../../../contexts/AuthContext';
import './chatlist.css'

const ChatList = () => {

    const { isAuth, user, setUser } = useContext(AuthContext);

    const [allUser, setAllUser] = useState([])
    const [openSearchUser, setOpenSearchUser] = useState(false)
    const socketConnection = useSelector(state => state?.user?.socketConnection)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const [following, setFollowing] = useState([]);
    const [followingNames, setFollowingNames] = useState([]);
    // const userId = useParams(); // Replace with the actual user ID or get it from props/state
    const userId = user._id;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_ADDR}/user/user/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                // console.log('Fetched user data:', data);

                if (data.user.following) {
                    setFollowing(data.user.following);
                } else {
                    console.warn('Following data not found in response:', data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    useEffect(()=>{
        if(socketConnection){
            socketConnection.emit('sidebar',user._id)

            socketConnection.on('conversation',(data)=>{
                console.log('conversation',data)

                const conversationUserData = data.map((conversationUser,index)=>{
                    if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                        return{
                            ...conversationUser,
                            userDetails : conversationUser?.sender
                        }
                    }
                    else if(conversationUser?.receiver?._id !== user?._id){
                        return{
                            ...conversationUser,
                            userDetails : conversationUser.receiver
                        }
                    }else{
                        return{
                            ...conversationUser,
                            userDetails : conversationUser.sender
                        }
                    }
                })

                setAllUser(conversationUserData)
            })
        }
    },[socketConnection,user])
    useEffect(() => {
        const fetchFollowingNames = async () => {
            try {
                const names = await Promise.all(following.map(async (id) => {
                    const response = await fetch(
                        `${import.meta.env.VITE_REACT_APP_BACKEND_ADDR}/user/user/${id}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                        }
                    );

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    return { id, name: data.user.name }; // Returning an object with id and name
                }));

                setFollowingNames(names);
            } catch (error) {
                console.error('Error fetching following names:', error);
            }
        };

        if (following.length > 0) {
            fetchFollowingNames();
        }
    }, [following]);


    return (
        <div className='container'>
            <div className=''>
                <div className='header-chatlist'>
                    <h2 className='text-xl font-bold p-4 text-slate-800'>Messages</h2>
                </div>
                <div className='bg-slate-200 p-[0.5px]'></div>

                <div className='chat-list'>

                    {following && following.length > 0 ? (
                        <ul>
                            {followingNames.map((user, index) => (
                                <Link to={`/chat/${user.id}`}>
                                <li key={index}>
                                    {user.name}
                                </li>
                                </Link>
                            ))}

                        </ul>

                    ) : (
                        <p>No users followed yet.</p>
                    )}
                    
                </div>
            </div>


            {/**search user */}
            {
                // openSearchUser && (
                // <SearchUser onClose={()=>setOpenSearchUser(false)}/>
                // )
            }

        </div>
    )
}

export default ChatList