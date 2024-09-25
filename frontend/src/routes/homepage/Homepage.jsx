import { useState } from 'react'
import './homepage.css'
import {Link} from "react-router-dom"
import {TypeAnimation} from 'react-type-animation'

const Homepage = () => {

  const [typingStatus, setTypingStatus] = useState("human")

 
  return (
    <div className='homepage'>
      <img src="/orbital.png" alt="" className='orbital' />
      <div className="homeleft">
        <h1>
          Tailor Resume
        </h1>
        <h2>
          Tailor your resume to get your dream job!
        </h2>
        <Link to= "/dashboard">
          Get Started
        </Link>
      </div>

    <div className="homeright">
      <div className="imgContainer">
        <img src="/resume.png" alt="" className='resume'/>
        <div className="chat">
          <img src={typingStatus === "human" ? '/human1.jpeg' : "/bot.png"} alt="" />
        <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              'Human: Tailor my resume',
              1000, () => {
                setTypingStatus("bot")
              },
              'TR: Here it is  . All the best!',
              1000,() => {
                setTypingStatus("human")
              }
              
            ]}
            wrapper="span"
            speed={50}
            style={{ fontSize: '2em', display: 'inline-block' }}
            repeat={Infinity}
            cursor= {true}
            omitDeletionAnimation = {true}
          />
        </div>

      </div>

    </div>
    <div className="terms">
      <img src="/logo.png" alt="" />
      <div className="links">
        <Link to='/'>Terms of Service</Link>
        <span>|</span>
        <Link to='/'>Privacy Policy</Link>
      </div>
    </div>
    </div>
  )
}

export default Homepage