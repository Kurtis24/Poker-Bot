import { useState, useEffect } from "react";
import PokerBot from './Components/PokerBot';
import ScrollBar from './Components/ScrollBar';
import BetButton from './Components/BetButton';
import './App.css';



const App = () => {
  const [value, setValue] = useState(0); 

  const [data, setData] = useState(null);
  const [input, setInput] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const sendDataToBackend = async () => {
    try {
      const response = await fetch("http://localhost:3030/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ Ensure JSON request
        },
        body: JSON.stringify({ message: input }),
      });

      const result = await response.json();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  useEffect(() => {
    fetch("http://localhost:3030/api/data") 
      .then((response) => response.json())
      .then((data) => setData(data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);


  return (
    <div>
     <PokerBot />
     <ScrollBar value={value} setValue={setValue} /> 
      <BetButton value={value} />
      <p>{data || "Loading..."}</p>

      <input
        type="text"
        placeholder="Enter a message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendDataToBackend}>Send to Backend</button>
      
      {responseMessage && (
        <p>Backend Response: {responseMessage}</p>
      )}
  
     
    </div>
  );
}


export default App;
