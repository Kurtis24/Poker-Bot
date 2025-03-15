import subprocess
import json

def send_screenshot_request():
    """
    Runs GameAnalysis.py to take a screenshot and returns the saved filename.
    Expects GameAnalysis.py to print a line containing "Screenshot saved:".
    """
    try:
        # Start the GameAnalysis.py process
        process = subprocess.Popen(
            ["python", "GameAnalysis.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait for GameAnalysis.py to finish execution (timeout after 30 seconds)
        stdout, stderr = process.communicate(timeout=30)
        
        if process.returncode != 0:
            return None, f"GameAnalysis.py error: {stderr.strip()}"
        
        # Look for the expected output line
        for line in stdout.splitlines():
            if "Screenshot saved:" in line:
                # Expected format: "Screenshot saved: screenshots/hand_YYYYMMDD_HHMMSS.png"
                screenshot_path = line.split("Screenshot saved: ")[-1].strip()
                return {"screenshot": screenshot_path}, None
        
        return None, "Failed to capture screenshot"
    
    except subprocess.TimeoutExpired:
        process.kill()
        return None, "GameAnalysis.py timed out"
    
    except Exception as e:
        return None, f"Error executing GameAnalysis.py: {str(e)}"
    

if __name__ == "__main__":
    screenshot_data, error = send_screenshot_request()
    if screenshot_data:
        print(json.dumps(screenshot_data))
    else:
        print(json.dumps({"error": error}))
