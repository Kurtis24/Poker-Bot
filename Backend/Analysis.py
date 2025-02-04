class PlayerSentiment:
    def __init__(self, player_name):
        self.player_name = player_name
        self.sentiment_score = 0

    def win(self):
        self.sentiment_score += 1
        print(f"{self.player_name} won! Sentiment score: {self.sentiment_score}")

    def lose(self):
        self.sentiment_score -= 1
        print(f"{self.player_name} lost! Sentiment score: {self.sentiment_score}")

    def get_sentiment_score(self):
        return self.sentiment_score

# Example usage
if __name__ == "__main__":
    player = PlayerSentiment("Alice")

    # Simulate some wins and losses
    player.win()  # Alice won! Sentiment score: 1
    player.win()  # Alice won! Sentiment score: 2
    player.lose()  # Alice lost! Sentiment score: 1
    player.lose()  # Alice lost! Sentiment score: 0
    player.lose()  # Alice lost! Sentiment score: -1

    # Get the final sentiment score
    print(f"Final sentiment score for {player.player_name}: {player.get_sentiment_score()}")