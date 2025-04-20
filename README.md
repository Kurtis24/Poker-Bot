# PokerBot

An interactive **PokerBot** designed for players to train and improve their poker skills by competing against an AI that plays a game-theoretically optimal (GTO) strategy. The React frontend communicates via WebSockets with a Node/Express backend, which invokes a Python GTO.py script to calculate perfect-play recommendations (fold, call, raise). 🚀

## 🌟 Features
- **React Frontend**
  - `GameControls`: deal rounds (hole, flop, turn, river), fold to reset, checks to check, and bet to bet money
  - `ScrollBar`: select bet sizing
  - WebSocket integration for sending hole‑card filenames and receiving analysis
- **Node.js Backend**
  - Serves static card images under 
  - WebSocket server listens on port 3030 
  - Buffers four card filenames per deal, identifies hole cards, invokes Python analysis 
  - Forwards JSON output from Python directly to the client 
- **Python GTO Analysis** (`GTO.py`)
  - Parses two hole‑card filenames and current round 
  - Computes hand strength via `treys` evaluator 
  - Classifies into **raise**, **call**, or **fold** based on thresholds
  - Calculates an optional raise amount proportional to pot size

## 🔧 Prerequisites
- **Node.js** v14+ and **npm**
- **Python** 3.7+ with packages:
  - `treys`

## 🚀 Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/pokerbot.git
   cd pokerbot
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Install Python dependencies:
   ```bash
   pip install treys
   ```
4. Ensure a `cards/` folder exists at project root with all 52 PNG files (e.g. `1C.png`–`13S.png`).

## ▶️ Running
### Backend
```bash
node server.js
```
- HTTP server on `http://localhost:3000` 
- WebSocket server on `ws://localhost:3030` 

### Frontend
```bash
npm start
```
Opens React app on `http://localhost:3001` (or configured port). 

## 🎲 Usage
1. Click **Check** to deal new cards each round.
2. Use the **ScrollBar** to choose a bet amount.
3. Click **Bet** to wager (deducts from balance).
4. Click **Fold** to reset the hand.

## 📜 License
MIT © Kurtis Lin 

## Notes
Its not gambling if you know you are going to win
