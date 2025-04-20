# PlayerAnalysis.py

class PlayerSentiment:
    def __init__(self, player_name="Player1"):
        self.player_name = player_name
        self.sentiment_score = 0.0

    def update_sentiment(self, outcome, method):
        """
        Updates the sentiment score and returns a dict with the result.
        """
        if outcome == "win":
            if method == "bluff":
                self.sentiment_score += 0.2
            elif method == "better_hand":
                self.sentiment_score += 0.1
            elif method == "worse_hand":
                self.sentiment_score += 0.2
            elif method == "fold":
                self.sentiment_score += 0.1
        elif outcome == "lose":
            if method == "bluff":
                self.sentiment_score -= 0.3
            elif method == "better_hand":
                self.sentiment_score -= 0.1
            elif method == "worse_hand":
                self.sentiment_score -= 0.2
            elif method == "fold":
                self.sentiment_score -= 0.1
        else:
            # Unknown outcome
            pass

        # Return a dict so we can serialize to JSON
        return {
            "player": self.player_name,
            "outcome": outcome,
            "method": method,
            "sentiment_score": round(self.sentiment_score, 3)
        }

def main():
    # Expect exactly two args: outcome and method
    if len(sys.argv) != 3:
        error = { "error": "Usage: python PlayerAnalysis.py <win|lose> <method>" }
        print(json.dumps(error), flush=True)
        sys.exit(1)

    outcome, method = sys.argv[1], sys.argv[2]
    analyzer = PlayerSentiment()

    result = analyzer.update_sentiment(outcome, method)

    # Print one JSON object and flush
    print(json.dumps(result), flush=True)

if __name__ == "__main__":
    main()
