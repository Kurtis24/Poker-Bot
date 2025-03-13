import os
import time
from datetime import datetime

import pyautogui
import cv2
import numpy as np

def take_screenshot():
    """
    Takes a screenshot, saves it to the 'screenshots' folder,
    and returns the file path.
    """
    # Ensure the screenshots folder exists
    if not os.path.exists("screenshots"):
        os.makedirs("screenshots")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"screenshots/hand_{timestamp}.png"
    screenshot = pyautogui.screenshot()
    screenshot.save(filename)

    # Print output for debugging or capture by other scripts
    print(f"Screenshot saved: {filename}", flush=True)
    return filename

def detect_screen_change(prev_screenshot):
    """
    Compares two screenshots to detect a change in the game state.
    Returns the new screenshot path if a change is detected, otherwise None.
    """
    time.sleep(2)  # Give time for the move to be executed

    # Take a new screenshot
    new_screenshot = pyautogui.screenshot()
    new_image = np.array(new_screenshot)
    new_gray = cv2.cvtColor(new_image, cv2.COLOR_RGB2GRAY)

    # Convert previous screenshot to a comparable format
    prev_image = np.array(prev_screenshot)
    prev_gray = cv2.cvtColor(prev_image, cv2.COLOR_RGB2GRAY)

    # Compute the difference
    difference = cv2.absdiff(prev_gray, new_gray)
    change_value = np.sum(difference)

    print(f"Screen Change Detected: {change_value}")
    
    # If change is significant, capture and return a new screenshot path
    if change_value > 500000:  # Adjust threshold if needed
        new_path = take_screenshot()
        return new_path
    
    return None  # No significant change

def take_action(action):
    """
    Locates the given action button (e.g., 'check', 'fold'),
    clicks it, and then checks if the screen changes.
    """
    # Convert the action to lowercase, then append "_button.png"
    button_image = f"{action.lower()}_button.png"
    button = pyautogui.locateCenterOnScreen(button_image)
    
    if button:
        # Capture the state before the action
        prev_screenshot = pyautogui.screenshot()
        pyautogui.click(button)
        print(f"Clicked {action} button!")

        # Wait and check for a game state change
        new_screenshot_path = detect_screen_change(prev_screenshot)
        if new_screenshot_path:
            print(f"New game state detected! Screenshot saved: {new_screenshot_path}")
        else:
            print("No significant change detected after move.")
    else:
        print(f"{action} button not found.")

# If you want to take a screenshot as soon as the script runs,
# you can leave this block. Otherwise, remove it or guard it.
if __name__ == "__main__":
    take_screenshot()
