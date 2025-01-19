import React, {useState} from 'react'
import {Link} from 'react-router-dom'

function Navbar() {
  return (
    <>
    <nav className='navbar'>
        <div className='navbar-container'>
            <Link to="/" className="navbar-logo"></Link>
            Poker <i class="fa-solid fa-heart"></i>
        </div>
    </nav>
    </>
  )
}

export default Navbar
