import random
# Import from deuces – make sure Deuces is installed and in your PYTHONPATH.
from deuces import Card as DeucesCard, Evaluator

# Create a single evaluator instance (to avoid re-instantiating every time).
evaluator = Evaluator()

# --------------------------
# Existing Card and Deck Classes
# --------------------------
class Card:
    def __init__(self, rank, suit):
        self.rank = rank
        self.suit = suit

    def __repr__(self):
        # For example, Ace of clubs is represented as "Ac"
        return f"{self.rank}{self.suit}"

class Deck:
    ranks = "23456789TJQKA"
    suits = "cdhs"  # clubs, diamonds, hearts, spades

    def __init__(self):
        self.cards = [Card(rank, suit) for rank in Deck.ranks for suit in Deck.suits]

    def shuffle(self):
        random.shuffle(self.cards)

    def deal(self, num):
        dealt_cards = self.cards[:num]
        self.cards = self.cards[num:]
        return dealt_cards

# --------------------------
# Helper: Convert Custom Card to Deuces Format
# --------------------------
def convert_card(custom_card):
    """
    Converts our custom Card object to the integer representation expected by Deuces.
    The DeucesCard.new method accepts a string (e.g., "Ac" for Ace of clubs).
    """
    return DeucesCard.new(str(custom_card))

# --------------------------
# Modified Hand Evaluation Using Deuces
# --------------------------
def evaluate_hand(cards):
    """
    Evaluate the strength of a hand using the Deuces evaluator.
    
    Parameters:
      cards: A list of Card objects. It is assumed that the first two are the player's
             hole cards and the remaining (if any) are board cards.
    
    Returns:
      A normalized hand strength between 0 and 1, where 1 is the best.
    """
    # Separate hole cards and board cards.
    hole_cards = [convert_card(c) for c in cards[:2]]
    board_cards = [convert_card(c) for c in cards[2:]]
    
    # Evaluate the hand using Deuces.
    score = evaluator.evaluate(hole_cards, board_cards)
    
    # Normalize the score. In Deuces:
    #  - Best hand (e.g., a Royal Flush) scores 1.
    #  - Worst hand scores 7462.
    normalized = (7463 - score) / 7462
    return normalized

# --------------------------
# GTO-Inspired Player Class (unchanged)
# --------------------------
class GTOPlayer:
    def __init__(self, name, chips):
        self.name = name
        self.chips = chips
        self.hole_cards = []

    def set_hole_cards(self, cards):
        self.hole_cards = cards

    def decide_action(self, game_state):
        board = game_state.get('board', [])
        if not board:  # Pre-Flop decision (simple heuristic)
            ranks = [card.rank for card in self.hole_cards]
            high_cards = ['A', 'K', 'Q', 'J', 'T']
            if any(r in high_cards for r in ranks):
                bet = min(self.chips, game_state.get('min_raise', 10) * 2)
                return 'raise', bet
            else:
                return 'call', game_state.get('min_call', 10)
        else:
            # Post-flop decision using Deuces hand evaluation.
            all_cards = self.hole_cards + board
            hand_strength = evaluate_hand(all_cards)
            if hand_strength > 0.8:
                bet = min(self.chips, game_state.get('min_raise', 10) * 2)
                return 'raise', bet
            elif hand_strength > 0.4:
                return 'call', game_state.get('min_call', 10)
            else:
                return 'fold', 0

# --------------------------
# Game Engine Class (unchanged except for using the new evaluate_hand)
# --------------------------
class Game:
    def __init__(self, players):
        self.players = players  # List of GTOPlayer instances
        self.deck = Deck()
        self.board = []         # Community cards
        self.pot = 0
        self.current_bet = 0    # Simplified current bet
        self.betting_history = []

    def start_hand(self):
        self.deck = Deck()
        self.deck.shuffle()
        self.board = []
        self.pot = 0
        self.current_bet = 0
        for player in self.players:
            player.set_hole_cards(self.deck.deal(2))

    def betting_round(self, street):
        print(f"\n--- {street} Betting Round ---")
        game_state = {
            'board': self.board,
            'pot': self.pot,
            'min_call': 10,    # Placeholder value
            'min_raise': 10    # Placeholder value
        }
        for player in self.players:
            if player.chips <= 0:
                continue  # Skip players with no chips
            action, amount = player.decide_action(game_state)
            print(f"{player.name} chooses to {action} with amount {amount}.")
            if action == 'fold':
                print(f"{player.name} folds and is removed from the hand.")
            elif action == 'call':
                self.pot += amount
                player.chips -= amount
            elif action == 'raise':
                self.pot += amount
                player.chips -= amount

    def deal_community_cards(self, num, street):
        cards = self.deck.deal(num)
        self.board.extend(cards)
        print(f"{street} cards: {cards}")

    def showdown(self):
        print("\n--- Showdown ---")
        best_strength = -1
        winner = None
        for player in self.players:
            # In a real game, skip players who have folded.
            all_cards = player.hole_cards + self.board
            strength = evaluate_hand(all_cards)
            print(f"{player.name} hand strength: {strength:.3f}")
            if strength > best_strength:
                best_strength = strength
                winner = player
        if winner:
            print(f"{winner.name} wins the pot of {self.pot} chips!")
            winner.chips += self.pot
        self.pot = 0

    def play_hand(self):
        self.start_hand()
        print("\n--- Dealing Hole Cards ---")
        for player in self.players:
            print(f"{player.name}: {player.hole_cards}")

        self.betting_round("Pre-Flop")
        self.deal_community_cards(3, "Flop")
        self.betting_round("Flop")
        self.deal_community_cards(1, "Turn")
        self.betting_round("Turn")
        self.deal_community_cards(1, "River")
        self.betting_round("River")
        self.showdown()

# --------------------------
# Main Execution
# --------------------------
if __name__ == '__main__':
    players = [GTOPlayer("Player1", 1000), GTOPlayer("Player2", 1000)]
    game = Game(players)
    game.play_hand()
