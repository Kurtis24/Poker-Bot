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

// Serve static screenshots
app.use("/screenshots", express.static(path.join(__dirname, "screenshots")));

const wss = new WebSocket.Server({ port: WS_PORT });

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  ws.on("message", (message) => {
    const parsedMessage = message.toString().trim();
    console.log(`Received from frontend: ${parsedMessage}`);

    let pythonProcess;

    if (parsedMessage === "take_screenshot") {
      console.log("Triggering Python to take a screenshot...");

      // Run main.py and pass the take_screenshot command
      pythonProcess = spawn("python", ["main.py", "take_screenshot"]);
    } else {
      pythonProcess = spawn("python", ["main.py"]);
    }

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
