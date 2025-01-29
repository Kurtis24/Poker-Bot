import PokerBot from './Components/PokerForm/PokerBot';
import './App.css';

const list = [
  "big", "little", "fold"
]

function App() {
  return (
    <div>
     <PokerBot />
     <button>Check</button>
     <button>Raise</button>
     <button>Fold</button>
    </div>

    // Scroll bar
      // <ul>
      //   {
      //     List.map((item) => 
      //     <li className=''>
      //       {item}
      //     </li>
      //     )
      //   }

      // </ul>

  );
}


export default App;
