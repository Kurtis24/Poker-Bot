const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Allows backend to parse JSON request bodies

// GET endpoint (already works)
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// POST endpoint (fixed response)
let storedMessages = []; // ✅ Store received messages

app.post("/api/send", (req, res) => {
  console.log("Received POST request to /api/send");
  console.log("Request body:", req.body);

  if (!req.body.message) {
    return res.status(400).json({ error: "Message is required" });
  }

  storedMessages.push(req.body.message); // ✅ Save message to array

  res.json({
    status: "Success",
    receivedMessage: req.body.message,
    allMessages: storedMessages, // ✅ Return all stored messages
  });
});

// GET endpoint to retrieve messages
app.get("/api/send", (req, res) => {
  res.json({
    storedMessages: storedMessages, // ✅ Return stored messages
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
