import "./ScrollBar.css"; // Make sure this file exists in the same directory

const ScrollBar = ({ value, setValue }) => { // ✅ Receive value and setValue from App.js
  const handleScroll = (event) => {
    setValue(event.target.value); // ✅ Update state in App.js
  };

  return (
    <div className="scrollbar-container">
      <div className="value-display">Scroll Value: {value}</div> {/* ✅ Display updated value */}
      <input
        type="range"
        min="0"
        max="1000"
        value={value} // ✅ Controlled input (syncs with App.js)
        onChange={handleScroll} // ✅ Updates value in App.js
        className="scrollbar"
      />
    </div>
  );
};

export default ScrollBar;
