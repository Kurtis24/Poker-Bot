import GTO


class PlayerSentiment:
    def __init__(self, player_name):
        self.player_name = player_name
        self.sentiment_score = 0

    def win(self):
        self.sentiment_score += .1
        print(f"{self.player_name} won! Sentiment score: {self.sentiment_score}")
        #See how to wins, if it wins by making the irght scrole we can multiple the sentiment score by 1.1, if it wins by bluffing, we can multiply the sentiment score by 1.2
        #give the score back to the main page to send

    def lose(self):
        self.sentiment_score -= .1
        print(f"{self.player_name} lost! Sentiment score: {self.sentiment_score}")
        #if lost see what it lost to, if it lost to a bluff, or lost to a better hand, or lost to a worse hand, if it lost to a bluff, then the sentiment score should be increased

    def get_sentiment_score(self):
        return self.sentiment_score

# Example usage
if __name__ == "__main__":
    player = PlayerSentiment("Alice")

    
    # Get the final sentiment score
    print(f"Final sentiment score for {player.player_name}: {player.get_sentiment_score()}")