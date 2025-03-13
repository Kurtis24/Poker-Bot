class PlayerSentiment:
    def __init__(self, player_name="Player1"):
        self.player_name = player_name
        self.sentiment_score = 0.0

    def update_sentiment(self, outcome, method):
        """
        Updates the sentiment score based on the outcome and method.
        
        Parameters:
          outcome: a string, either "win" or "lose"
          method: a string indicating the type of win/loss, e.g., "bluff", "better_hand", "worse_hand", "fold"
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
            print(f"{self.player_name} won! Sentiment score: {self.sentiment_score}")
        elif outcome == "lose":
            if method == "bluff":
                self.sentiment_score += 0.3
            elif method == "better_hand":
                self.sentiment_score += 0.1
            elif method == "worse_hand":
                self.sentiment_score += 0.2
            elif method == "fold":
                self.sentiment_score += 0.1
            print(f"{self.player_name} lost! Sentiment score before penalty: {self.sentiment_score}")
            # Apply a penalty if lost
            self.sentiment_score -= 0.1
        else:
            print("Unknown outcome provided.")
    
    def get_sentiment_score(self):
        return self.sentiment_score

# Example usage
if __name__ == "__main__":
    player = PlayerSentiment("Player1")
    
    # Simulate different scenarios
    player.update_sentiment("win", "bluff")
    player.update_sentiment("win", "better_hand")
    player.update_sentiment("lose", "worse_hand")
    player.update_sentiment("lose", "fold")
    
    print(f"Final sentiment score for {player.player_name}: {player.get_sentiment_score()}")
