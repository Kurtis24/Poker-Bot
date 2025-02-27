import random
import os
import sys
import json
import time
import urllib.parse
from PIL import Image
import Analysis

image_folder = 'Cards/'  # ✅ Ensure this path is correct

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

def get_random_image():
    """Randomly select one image file from the Cards folder and return its URL-encoded URL."""
    try:
        image_files = [f for f in os.listdir(image_folder) if f.endswith('.png')]
        if not image_files:
            return None, "No images found in folder"
        
        selected_file = random.choice(image_files)
        # Extract the number (assumes file format like "1 C.png", so split by space)
        number = selected_file.split(" ")[0]
        # URL-encode the filename to handle spaces and other special characters
        encoded_filename = urllib.parse.quote(selected_file)
        base_url = "http://localhost:3000/cards/"  # Adjust if necessary
        image_url = base_url + encoded_filename
        
        return {"number": number, "image": image_url}, None
    except Exception as e:
        return None, f"Error selecting image: {str(e)}"

def main():
    """Main function to execute Python logic and send response to Node.js"""
    image_data, error = get_random_image()
    
    if image_data is None:
        print(json.dumps({"error": error}))  # ✅ Send error message
        sys.stdout.flush()
        return

    # Run sentiment analysis
    player = Analysis.PlayerSentiment()
    win_message = player.win()  # ✅ Assume this returns a string

    response = {
        "selected_image": image_data,
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
