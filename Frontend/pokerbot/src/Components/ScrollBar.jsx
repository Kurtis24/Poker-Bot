import { useState } from "react";
import "./ScrollBar.css"; // Make sure this file exists in the same directory



const ScrollBar = () => {
  const [value, setValue] = useState(0);

  const handleScroll = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="scrollbar-container">
      <div className="value-display">Scroll Value: {value}</div>
      <input
        type="range"
        min="0"
        max="1000"
        value={value}
        onChange={handleScroll}
        className="scrollbar"
      />
    </div>
  );
};

export default ScrollBar;
