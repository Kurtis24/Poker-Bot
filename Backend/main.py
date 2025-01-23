import random
import os
from PIL import Image

image_folder = 'Backend/Cards/'

image_files = [f for f in os.listdir(image_folder) if f.endswith(('.png'))]


numbers = [int(os.path.splitext(f)[0]) for f in image_files]

selected_number = random.choice(numbers)

selected_image = f"{selected_number}.png" 

image_path = os.path.join(image_folder, selected_image)

if os.path.exists(image_path):
    img = Image.open(image_path)
else:
    print("Error")
