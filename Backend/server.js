// server.js
const express   = require("express");
const cors      = require("cors");
const WebSocket = require("ws");
const path      = require("path");
const { spawn } = require("child_process");

const app       = express();
const HTTP_PORT = process.env.PORT || 3000;
const WS_PORT   = 3030;

// Serve static cards folder
app.use(cors());
app.use("/cards", express.static(path.join(__dirname, "cards")));

app.listen(HTTP_PORT, () => {
  console.log(`HTTP Server running on http://localhost:${HTTP_PORT}`);
});

const wss = new WebSocket.Server({ port: WS_PORT });
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  let cardBuffer = [];
  let dealRound   = 1;      // cycles 1 → 4
  let holeCards   = [];     // persistent across actions

  ws.on("message", (data) => {
    // Try to parse JSON (for player_action)…
    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch {
      parsed = null;
    }

    // === 1) Handle player action messages ===
    if (parsed && parsed.type === "player_action") {
      const { action, bet_amount } = parsed;
      console.log(`Player action received: ${action} (${bet_amount})`);

      // spawn Python with: hole1, hole2, round, action, bet_amount
      const args = [
        ...holeCards,
        dealRound.toString(),
        action,
        bet_amount.toString()
      ];
      const py = spawn("python", ["GTO.py", ...args]);

      py.stdout.on("data", (chunk) => {
        const output = chunk.toString().trim();
        console.log("Python output:", output);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(output);
        }
      });
      py.stderr.on("data", (err) => {
        const errorMsg = err.toString();
        console.error("Python error:", errorMsg);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ error: errorMsg }));
        }
      });
      py.on("close", code => {
        console.log(`GTO.py (action) exited with code ${code}`);
      });

      return;  // done processing this message
    }

    // === 2) Handle card‐filename messages ===
    const msg = data.toString().trim();
    if (/\.(png)$/i.test(msg)) {
      // forward filename if you like
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ filename: msg }));
      }

      cardBuffer.push(msg);

      // once we have 4 cards, deal them
      if (cardBuffer.length === 4) {
        if (dealRound === 1) {
          holeCards = cardBuffer.slice(0, 2);
        }
        console.log(`Round ${dealRound} - holeCards:`, holeCards);

        // spawn Python with only hole cards + round
        const args = [...holeCards, dealRound.toString()];
        const py = spawn("python", ["GTO.py", ...args]);

        py.stdout.on("data", (chunk) => {
          const output = chunk.toString().trim();
          console.log("Python output:", output);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(output);
          }
        });
        py.stderr.on("data", (err) => {
          const errorMsg = err.toString();
          console.error("Python error:", errorMsg);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ error: errorMsg }));
          }
        });
        py.on("close", code => {
          console.log(`GTO.py (deal) exited with code ${code}`);
        });

        // prep for next round
        cardBuffer = [];
        dealRound = dealRound < 4 ? dealRound + 1 : 1;
      }
    }
    // else: ignore any other bare text
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

console.log(`WebSocket Server running on ws://localhost:${WS_PORT}`);
