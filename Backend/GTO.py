import sys
import json
from treys import Card, Evaluator

class RuleBot:
    def __init__(self, thresholds):
        # thresholds by position: fraction of max hand strength needed to act
        self.thresholds = thresholds
        self.evaluator = Evaluator()

    def hand_strength(self, hand, board):
        # lower score = better hand
        rank = self.evaluator.evaluate(board, hand)
        # normalize to [0,1], 1 = nuts
        return 1 - (rank / 7462)

RANK_MAP = {
    '1': 'A',
    '11': 'J',
    '12': 'Q',
    '13': 'K'
}

def parse_card(filename):
    """
    Convert a filename like '13H.png' to a treys card string 'Kh'.
    """
    base = filename.split('.')[0]
    num = base[:-1]
    suit = base[-1].lower()
    rank = RANK_MAP.get(num, num)
    return rank + suit


def main():
    # Expect hole cards, round, player_action, bet_amount
    if len(sys.argv) < 6:
        print(json.dumps({
            "error": "Usage: python GTO.py <card1.png> <card2.png> <round> <action> <bet_amount>"
        }), flush=True)
        sys.exit(1)

    # Parse inputs
    f1, f2 = sys.argv[1], sys.argv[2]
    rnd = int(sys.argv[3])
    player_action = sys.argv[4]      # 'check', 'fold', 'bet'
    bet_amt = int(sys.argv[5])

    # Convert card filenames to treys format
    try:
        c1 = parse_card(f1)
        c2 = parse_card(f2)
        hand = [Card.new(c1), Card.new(c2)]
    except Exception as e:
        print(json.dumps({"error": str(e)}), flush=True)
        sys.exit(1)

    # For simplicity, no community cards (preflop)
    board = []

    # Game state parameters
    pot_size = bet_amt if player_action == 'bet' else 1
    to_call = bet_amt if player_action == 'bet' else 0
    position = 'mid'

    # Evaluate hand
    bot = RuleBot({'early': 0.4, 'mid': 0.3, 'late': 0.2})
    strength = bot.hand_strength(hand, board)
    threshold = bot.thresholds.get(position, 0.3)

    # Decision logic influenced by player action
    if player_action == 'fold':
        action = 'win'
        raise_amount = 0
    elif player_action == 'bet':
        # decide to call or fold
        if strength * pot_size * 100 >= bet_amt:
            action = 'call'
            raise_amount = 0
        else:
            action = 'fold'
            raise_amount = 0
    else:  # player_action == 'check'
        # use original strength thresholds to decide
        if strength >= threshold + 0.4:
            action = 'raise'
            raise_amount = max(1, int(strength * pot_size * 100))
        elif strength >= threshold:
            action = 'call'
            raise_amount = 0
        else:
            action = 'fold'
            raise_amount = 0

    # Build response JSON
    output = {
        "round": rnd,
        "hole_cards": [f1, f2],
        "strength": round(strength, 3),
        "player_action": player_action,
        "player_bet": bet_amt,
        "bot_action": action,
        "raise_amount": raise_amount
    }
    print(json.dumps(output), flush=True)

if __name__ == "__main__":
    main()
