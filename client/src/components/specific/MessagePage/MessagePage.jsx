import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import './messagepage.css';
import { Avatar, CircularProgress } from '@mui/material';
import { AuthContext } from '../../../contexts/AuthContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import Send from '@mui/icons-material/Send';
import moment from 'moment';
const MessagePage = () => {
    const params = useParams();
    const {user} = useContext(AuthContext);
    // console.log(params.userId);  
    
    const [dataUser, setDataUser] = useState({
        name: "",
        email: "",
        profileImage: "",
        online: false
    })
    const [openImageVideoUpload,setOpenImageVideoUpload] = useState(false);
    const [message,setMessage] = useState({
        text : "",
        imageUrl : "",
        videoUrl : ""
    });
    const [loading,setLoading] = useState(false);
    const [allMessage,setAllMessage] = useState([]);
    const currentMessage = useRef(null);
    useEffect(()=>{
        if(currentMessage.current){
            currentMessage.current.scrollIntoView({behavior : 'smooth', block : 'end'})
        }
    },[allMessage])
  
    const handleUploadImageVideoOpen = ()=>{
      setOpenImageVideoUpload(preve => !preve)
    }
  
    const handleUploadImage = async(e)=>{
      const file = e.target.files[0]
  
      setLoading(true)
      const uploadPhoto = await uploadFile(file)
      setLoading(false)
      setOpenImageVideoUpload(false)
  
      setMessage(preve => {
        return{
          ...preve,
          imageUrl : uploadPhoto.url
        }
      })
    }
    const handleClearUploadImage = ()=>{
      setMessage(preve => {
        return{
          ...preve,
          imageUrl : ""
        }
      })
    }
  
    const handleUploadVideo = async(e)=>{
      const file = e.target.files[0]
  
      setLoading(true)
      const uploadPhoto = await uploadFile(file)
      setLoading(false)
      setOpenImageVideoUpload(false)
  
      setMessage(preve => {
        return{
          ...preve,
          videoUrl : uploadPhoto.url
        }
      })
    }
    const handleClearUploadVideo = ()=>{
      setMessage(preve => {
        return{
          ...preve,
          videoUrl : ""
        }
      })
    }
    const socketConnection = useSelector(state => state?.user?.socketConnection);

    useEffect(() => {
        
        if (socketConnection) {
            socketConnection.emit('message-page', params.userId)
            socketConnection.on('message-user', (data) => {
                setDataUser(data);
            })
            
            socketConnection.on('message',(data)=>{
                
                setAllMessage(data)
            })
        }
    }, [socketConnection, params.userId,user])

    const handleOnChange = (e)=>{
        const { name, value} = e.target
    
        setMessage(preve => {
          return{
            ...preve,
            text : value
          }
        })
    };

    const handleSendMessage = (e)=>{
        e.preventDefault();
    
        if(message.text || message.imageUrl || message.videoUrl){
          if(socketConnection){
            socketConnection.emit('new message',{
              sender : user?._id,
              receiver : params.userId,
              text : message.text,
              imageUrl : message.imageUrl,
              videoUrl : message.videoUrl,
              msgByUserId : user?._id
            })
            setMessage({
              text : "",
              imageUrl : "",
              videoUrl : ""
            })
          }
        }
      }

    return (
        <div>
            <div  className="background">
                <header className="header-messagepage">
                    <div className="header-left">
                        <Avatar className="avatar" />
                        <div className="user-info">
                            <h3 className="user-name">{dataUser?.name}</h3>
                            {/* <p className="user-status"> */}
                                {/* <span className="status-online">online</span>
                                <span className="status-offline">offline</span> */}
                            {/* </p> */}
                        </div>
                    </div>
                    <div className="header-right">
                        <button className="menu-button">
                            <MoreVertIcon/>
                        </button>
                    </div>
                </header>

                <section className="message-section">
                    <div className="message-container">
                    {
                      allMessage.map((msg,index)=>{
                        return(
                          <div className={`message-item ${user._id === msg?.msgByUserId ? "" : "received"}`}>
                            <div className='w-full relative'>
                              {
                                msg?.imageUrl && (
                                  <img 
                                    src={msg?.imageUrl}
                                    className='w-full h-full object-scale-down'
                                  />
                                )
                              }
                              {
                                msg?.videoUrl && (
                                  <video
                                    src={msg.videoUrl}
                                    className='w-full h-full object-scale-down'
                                    controls
                                  />
                                )
                              }
                            </div>
                            <p style={{"padding":"0 2px"}}>{msg.text}</p>
                            <p className='message-time'>{moment(msg.createdAt).format('hh:mm')}</p>
                          </div>
                        )
                      })
                    }
                    </div>

                    {/* <div className="upload-image">
                        <div className="close-button">
                            <i className="fa fa-times"></i>
                        </div>
                        <div className="image-preview">
                            <img src="upload-image.jpg" alt="Uploaded Image" className="preview-image"/>
                        </div>
                    </div>

                    <div className="upload-video">
                        <div className="close-button">
                            <i className="fa fa-times"></i>
                        </div>
                        <div className="video-preview">
                            <video src="upload-video.mp4" className="preview-video" controls muted autoplay></video>
                        </div>
                    </div> */}
                    {
                        loading && (
                            <div className="loading">
                                <CircularProgress/>
                            </div>
                        )
                    }
                    
                </section>

                <section className="input-section">
                    <div className="upload-button-container">
                        <button className="upload-button">
                            <AddBoxIcon/>
                        </button>
                        {openImageVideoUpload && (
                            <div className="upload-menu">
                            <form>
                                <label for="uploadImage" className="upload-option">
                                    <AddPhotoAlternateIcon/>
                                    <p>Image</p>
                                </label>
                                <label for="uploadVideo" className="upload-option">
                                    <VideoCameraBackIcon/>
                                    <p>Video</p>
                                </label>
                                <input type="file" id="uploadImage" className="upload-input"/>
                                    <input type="file" id="uploadVideo" className="upload-input"/>
                            </form>
                            </div>
                        )}
                        
                    </div>

                    <form className="message-form" onSubmit={handleSendMessage}>
                        <input type="text" placeholder="Type your message..." className="message-input" onChange={handleOnChange}/>
                        <button className="send-button">
                            <Send/>
                        </button>
                    </form>
                </section>
            </div>

        </div>
    );
}

export default MessagePage      