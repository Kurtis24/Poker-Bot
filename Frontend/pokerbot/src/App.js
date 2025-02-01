import { useState } from "react";
import PokerBot from './Components/PokerBot';
import ScrollBar from './Components/ScrollBar';
import BetButton from './Components/BetButton';
import './App.css';



function App() {
  const [value, setValue] = useState(0); 

  return (
    <div>
     <PokerBot />
     <ScrollBar value={value} setValue={setValue} /> 
      <BetButton value={value} />
     
     
    </div>
  );
}


export default App;
