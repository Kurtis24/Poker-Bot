import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons' 
import {Link} from 'react-router-dom'


function Navbar() {
  return (
    <>
    <nav className='navbar'>
      
        <div className='navbar-container'>
            <Link to="/" className="navbar-logo">
            Poker <FontAwesomeIcon icon={faHeart} />
            </Link>
            
        </div>
    </nav>
    </>
  )
}

function footer() {
  return (
    <>
    <nav className='footer'>
      
        <div className='footer-container'>
            <Link to="/" className="footer-logo">
            Created by Kurtis Lin, with seven cups of coffee
            </Link>
            
        </div>
    </nav>
    </>
  )
}

export default Navbar
