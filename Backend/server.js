const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static images from the 'Cards' folder.
// Images will be accessible under the URL: http://localhost:3000/cards/<filename>
app.use('/Cards', express.static(path.join(__dirname, 'Cards')));

const wss = new WebSocket.Server({ port: 3030 });

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  ws.on("message", (message) => {
    console.log(`Received from frontend: ${message}`);

    // Spawn the Python process with main.py (ensure main.py is in the same directory)
    const pythonProcess = spawn("python", ["main.py"]);

    // Write the incoming message to Python's stdin as JSON
    pythonProcess.stdin.write(JSON.stringify({ message: message.toString() }));
    pythonProcess.stdin.end();

    // Listen for data from Python's stdout
    pythonProcess.stdout.on("data", (data) => {
      // Python may send multiple JSON lines; split and send each one
      const responses = data.toString().trim().split("\n");
      responses.forEach((response) => {
        ws.send(response);
      });
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      ws.send(JSON.stringify({ done: true })); // Indicate completion to frontend
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
