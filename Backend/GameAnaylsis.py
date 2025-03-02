import pyautogui
import time
import os
import cv2
import pytesseract
from datetime import datetime
import glob

# Ensure the screenshots folder exists
if not os.path.exists("screenshots"):
    os.makedirs("screenshots")

def save_screenshot():
    """Takes a screenshot and saves it in the screenshots folder"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"screenshots/hand_{timestamp}.png"
    screenshot = pyautogui.screenshot()
    screenshot.save(filename)
    print(f"Screenshot saved: {filename}")
    return filename

def process_screenshot(image_path):
    """Reads a saved screenshot and extracts card information"""
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Use OCR to detect card names
    text = pytesseract.image_to_string(gray)
    print(f"Detected Cards from {image_path}: {text}")
    return text

def decide_action(cards):
    """Basic poker decision-making"""
    strong_hands = ["AA", "KK", "QQ", "AK", "AQ"]
    if any(hand in cards for hand in strong_hands):
        return "Raise"
    elif "J" in cards or "10" in cards:
        return "Call"
    else:
        return "Fold"

def take_action(action):
    """Click the appropriate button based on decision"""
    button_image = f"{action.lower()}_button.png"
    button = pyautogui.locateCenterOnScreen(button_image)
    if button:
        pyautogui.click(button)
        print(f"Clicked {action} button!")
    else:
        print(f"{action} button not found.")

# Run the bot in a loop
while True:
    # Step 1: Take a screenshot
    screenshot_file = save_screenshot()

    # Step 2: Process the screenshot to extract cards
    detected_cards = process_screenshot(screenshot_file)

    # Step 3: Decide what to do
    action = decide_action(detected_cards)

    # Step 4: Perform the action (Bet, Fold, Raise)
    take_action(action)

    # Wait before the next action
    time.sleep(3)
