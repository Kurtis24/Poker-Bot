import random
import os
import Analysis
from PIL import Image


image_folder = 'Backend/Cards/'

def get_number():
    image_files = [f for f in os.listdir(image_folder) if f.endswith(('.png'))]
    numbers = [int(os.path.splitext(f)[0]) for f in image_files]
    selected_number = random.choice(numbers)
    selected_image = f"{selected_number}.png" 
    image_path = os.path.join(image_folder, selected_image)
    
def main():
    number = get_number()
    player = Analysis.PlayerSentiment()
    player.win()