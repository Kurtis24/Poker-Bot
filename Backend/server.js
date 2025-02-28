const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const WS_PORT = 3030;

app.use(cors());
app.use(express.json());

// Serve static images from the 'Cards' folder.
// Images will be accessible via URLs like http://localhost:3000/cards/filename.png
app.use('/cards', express.static(path.join(__dirname, 'Cards')));

// Set up the WebSocket server on port 3030.
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  ws.on("message", (message) => {
    console.log(`Received from frontend: ${message}`);

    // Spawn the Python process to select a random image.
    const pythonProcess = spawn("python", ["main.py"]);

    // Send the incoming message to Python's stdin.
    pythonProcess.stdin.write(JSON.stringify({ message: message.toString() }) + "\n");
    pythonProcess.stdin.end();

    // Collect Python's stdout and send it back to the client.
    pythonProcess.stdout.on("data", (data) => {
      const responses = data.toString().trim().split("\n");
      responses.forEach((response) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(response);
        }
      });
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});

app.listen(PORT, () => {
  console.log(`HTTP Server running on http://localhost:${PORT}`);
  console.log(`WebSocket Server running on ws://localhost:${WS_PORT}`);
});
