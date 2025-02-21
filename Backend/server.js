const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const wss = new WebSocket.Server({ port: 3030 }); // WebSocket Server on port 8080

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  ws.on("message", (message) => {
    console.log(`Received from frontend: ${message}`);

    const pythonProcess = spawn("python", ["main.py"]);

    pythonProcess.stdin.write(JSON.stringify({ message: message.toString() }));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on("data", (data) => {
      const responses = data.toString().trim().split("\n");
      responses.forEach((response) => {
        ws.send(response); // Send each response to frontend dynamically
      });
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      ws.send(JSON.stringify({ done: true })); // Indicate completion
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
