import random
import os
import sys
import json
import time
from PIL import Image
import Analysis

image_folder = 'Backend/Cards/'  # ✅ Ensure this path is correct

def generate_dynamic_response(message):
    """Generate dynamic responses and send them to Node.js via stdout"""
    responses = [
        f"Processing: {message}",
        f"Analyzing: {message}",
        f"Result computed for: {message}",
        f"Final output: Python confirms '{message}'"
    ]
    
    for response in responses:
        print(json.dumps({"response": response}))  # ✅ Send JSON response
        sys.stdout.flush()  # ✅ Ensure Node.js gets the response immediately
        time.sleep(2)  # ✅ Simulate processing delay

def get_number():
    """Randomly select an image file number from the Cards folder"""
    try:
        image_files = [f for f in os.listdir(image_folder) if f.endswith('.png')]
        if not image_files:
            return None, "No images found in folder"

        numbers = [int(os.path.splitext(f)[0]) for f in image_files]
        selected_number = random.choice(numbers)
        selected_image = f"{selected_number}.png"
        image_path = os.path.join(image_folder, selected_image)

        return selected_number, image_path  # ✅ Return both the number and image path
    except Exception as e:
        return None, f"Error selecting image: {str(e)}"  # ✅ Handle errors

def main():
    """Main function to execute Python logic and send response to Node.js"""
    selected_number, image_path = get_number()
    
    if selected_number is None:
        print(json.dumps({"error": image_path}))  # ✅ Send error message
        sys.stdout.flush()
        return

    # Run sentiment analysis
    player = Analysis.PlayerSentiment()
    win_message = player.win()  # ✅ Assume this returns a string

    response = {
        "selected_number": selected_number,
        "image": image_path,
        "sentiment_analysis": win_message
    }

    print(json.dumps(response))  # ✅ Send JSON response to Node.js
    sys.stdout.flush()

if __name__ == "__main__":
    input_data = sys.stdin.read()
    
    try:
        data = json.loads(input_data)
        message = data.get("message", "No message provided")
        generate_dynamic_response(message)  # ✅ Sends dynamic response
        main()  # ✅ Runs main function and sends final output
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON"}))
        sys.stdout.flush()
