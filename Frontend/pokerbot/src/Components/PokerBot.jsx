import React from 'react'
import './PokerBot.css';

const PokerBot = () => {
  return (
    <div className='wrapper'>
      {/* <from action=""> */}
        <h1>Poker</h1>
        <div className="input-box">
          <input type="text" placeholder="UserName" required/>
        </div>
      {/* </from> */}
    </div>
  )
}

export default PokerBot
