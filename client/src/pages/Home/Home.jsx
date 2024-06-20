import React from 'react'
import News from '../../components/specific/News';
import SuggestedUser from '../../components/specific/SuggestedUser/SuggestedUser';
import './Home.css'
const Home = () => {
  return (
    <div className="homepage-container">
      <div className='homepage-news'><News/></div>
      <div className='homepage-aside'><SuggestedUser/></div>
    </div>
  )
}

export default Home