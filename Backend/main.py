import subprocess

def take_screenshot():
    try:
        subprocess.run(["python", "GameAnaylsis.py"], check=True)
        print("GameAnalysis.py executed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error executing GameAnalysis.py: {e}")

if __name__ == "__main__":
    take_screenshot()


# import sys
# import json
# import time
# import random
# import os
# import urllib.parse
# import subprocess

# image_folder = 'Cards/'  # Ensure this path is correct

# def send_screenshot_request():
#     """Runs GameAnalysis.py to take a screenshot and returns the saved filename."""
#     try:
#         # Use Popen instead of run() to ensure non-blocking execution
#         process = subprocess.Popen(["python", "GameAnalysis.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
#         # Wait for GameAnalysis.py to finish execution
#         stdout, stderr = process.communicate()

#         if process.returncode != 0:
#             return None, f"GameAnalysis.py error: {stderr.strip()}"

#         # Extract output (expected format: "Screenshot saved: screenshots/hand_20240228_123456.png")
#         if "Screenshot saved:" in stdout:
#             return {"screenshot": stdout.strip().split("Screenshot saved: ")[1]}, None
#         else:
#             return None, "Failed to capture screenshot"

#     except Exception as e:
#         return None, f"Error executing GameAnalysis.py: {str(e)}"

# def get_random_image():
#     """Selects a random image from the Cards folder."""
#     try:
#         image_files = [f for f in os.listdir(image_folder) if f.endswith('.png')]
#         if not image_files:
#             return None, "No images found in folder"
        
#         selected_file = random.choice(image_files)
#         number = selected_file.split(" ")[0]  # Extract card number
#         encoded_filename = urllib.parse.quote(selected_file)  # URL-encode filename
#         base_url = "http://localhost:3000/cards/"  # Adjust if necessary
#         image_url = base_url + encoded_filename
#         return {"number": number, "image": image_url}, None
#     except Exception as e:
#         return None, f"Error selecting image: {str(e)}"

# if __name__ == "__main__":
#     while True:
#         # Read a line from stdin (blocking until input arrives)
#         line = sys.stdin.readline().strip()
#         if not line:
#             time.sleep(0.1)  # No input, wait a little
#             continue
        
#         try:
#             data = json.loads(line)
#             message = data.get("message", "")

#             if message == "take_screenshot":
#                 # Trigger screenshot capture
#                 screenshot_data, error = send_screenshot_request()
#                 if screenshot_data is None:
#                     result = {"error": error}
#                 else:
#                     result = {"screenshot": screenshot_data}

#             else:
#                 # Select a random image
#                 image_data, error = get_random_image()
#                 if image_data is None:
#                     result = {"error": error}
#                 else:
#                     result = {"selected_image": image_data}

#             print(json.dumps(result))
#             sys.stdout.flush()

#         except Exception as e:
#             error_response = {"error": f"Failed to process input: {str(e)}"}
#             print(json.dumps(error_response))
#             sys.stdout.flush()