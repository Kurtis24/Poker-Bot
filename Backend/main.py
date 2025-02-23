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

def get_three_random_images():
    """Randomly select three image files from the Cards folder"""
    try:
        image_files = [f for f in os.listdir(image_folder) if f.endswith('.png')]
        if not image_files:
            return None, "No images found in folder"
        
        # If there are fewer than 3 images, return all; otherwise sample 3
        selected_files = random.sample(image_files, min(3, len(image_files)))
        images_data = []
        for filename in selected_files:
            number = int(os.path.splitext(filename)[0])
            image_path = os.path.join(image_folder, filename)
            images_data.append({"number": number, "image": image_path})
        
        return images_data, None
    except Exception as e:
        return None, f"Error selecting images: {str(e)}"

def main():
    """Main function to execute Python logic and send response to Node.js"""
    images_data, error = get_three_random_images()
    
    if images_data is None:
        print(json.dumps({"error": error}))  # ✅ Send error message
        sys.stdout.flush()
        return

    # Run sentiment analysis
    player = Analysis.PlayerSentiment()
    win_message = player.win()  # ✅ Assume this returns a string

    response = {
        "selected_images": images_data,
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
