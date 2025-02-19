import random
import os
import Analysis
import sys
import json
import time
from PIL import Image


image_folder = 'Backend/Cards/'

def generate_dynamic_response(message):
    responses = [
        f"Processing: {message}",
        f"Analyzing: {message}",
        f"Result computed for: {message}",
        f"Final output: Python confirms '{message}'"
    ]
    
    for response in responses:
        print(json.dumps({"response": response}))  # Send JSON to Node.js
        sys.stdout.flush()  # Ensure Node.js receives data immediately
        time.sleep(2)  # Simulate processing delay
        
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
    
if __name__ == "__main__":
    input_data = sys.stdin.read()
    
    try:
        data = json.loads(input_data)
        message = data.get("message", "No j provided")
        generate_dynamic_response(message)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON"}))