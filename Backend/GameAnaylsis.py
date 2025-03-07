import pyautogui
import os
from datetime import datetime

# Ensure the screenshots folder exists
if not os.path.exists("screenshots"):
    os.makedirs("screenshots")

def take_screenshot():
    """Takes a screenshot and prints the saved file path"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"screenshots/hand_{timestamp}.png"
    screenshot = pyautogui.screenshot()
    screenshot.save(filename)

    # Print output so other scripts (e.g., main.py) can capture it
    print(f"Screenshot saved: {filename}", flush=True)

# Run screenshot capture when script is executed
if __name__ == "__main__":
    take_screenshot()




# import pyautogui
# import time
# import cv2
# import numpy as np
# from datetime import datetime
# import os

# # Ensure the screenshots folder exists
# if not os.path.exists("screenshots"):
#     os.makedirs("screenshots")

# def save_screenshot():
#     """Takes a screenshot and saves it in the screenshots folder"""
#     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#     filename = f"screenshots/hand_{timestamp}.png"
#     screenshot = pyautogui.screenshot()
#     screenshot.save(filename)
#     print(f"Screenshot saved: {filename}")
#     return filename

# def detect_screen_change(prev_screenshot):
#     """Compares two screenshots to detect a change in the game state"""
#     time.sleep(2)  # Give time for the move to be executed

#     # Take a new screenshot
#     new_screenshot = pyautogui.screenshot()
#     new_image = np.array(new_screenshot)
#     new_gray = cv2.cvtColor(new_image, cv2.COLOR_RGB2GRAY)

#     # Convert previous screenshot
#     prev_image = np.array(prev_screenshot)
#     prev_gray = cv2.cvtColor(prev_image, cv2.COLOR_RGB2GRAY)

#     # Compute the difference
#     difference = cv2.absdiff(prev_gray, new_gray)
#     change_value = np.sum(difference)

#     print(f"Screen Change Detected: {change_value}")
    
#     # If change is significant, save new state
#     if change_value > 500000:  # Adjust threshold if needed
#         return save_screenshot()
    
#     return None  # No significant change

# def take_action(action):
#     """Clicks the appropriate button and then takes a new screenshot if game state changes"""
#     button_image = f"{action.lower()}_button.png"
#     button = pyautogui.locateCenterOnScreen(button_image)
    
#     if button:
#         prev_screenshot = pyautogui.screenshot()  # Capture state before action
#         pyautogui.click(button)
#         print(f"Clicked {action} button!")

#         # Wait and check for game state change
#         new_screenshot = detect_screen_change(prev_screenshot)
#         if new_screenshot:
#             print(f"New game state detected! Screenshot saved: {new_screenshot}")
#         else:
#             print("No significant change detected after move.")
    
#     else:
#         print(f"{action} button not found.")
