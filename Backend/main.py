import sys, json, time, random, os, urllib.parse

image_folder = 'Cards/'  # Ensure this path is correct

def get_random_image():
    try:
        image_files = [f for f in os.listdir(image_folder) if f.endswith('.png')]
        if not image_files:
            return None, "No images found in folder"
        
        selected_file = random.choice(image_files)
        # Extract the card number (assumes file format like "1 C.png", splitting on space)
        number = selected_file.split(" ")[0]
        # URL-encode the filename to handle spaces and special characters
        encoded_filename = urllib.parse.quote(selected_file)
        base_url = "http://localhost:3000/cards/"  # Adjust if necessary
        image_url = base_url + encoded_filename
        return {"number": number, "image": image_url}, None
    except Exception as e:
        return None, f"Error selecting image: {str(e)}"

if __name__ == "__main__":
    while True:
        # Read a line from stdin (blocking until input arrives)
        line = sys.stdin.readline()
        if not line:
            time.sleep(0.1)  # No input, wait a little
            continue
        try:
            data = json.loads(line)
            # You can optionally use the "message" field from the input if needed.
            # For now, we simply select a random image.
            image_data, error = get_random_image()
            if image_data is None:
                result = {"error": error}
            else:
                result = {"selected_image": image_data}
            print(json.dumps(result))
            sys.stdout.flush()
        except Exception as e:
            error_response = {"error": f"Failed to process input: {str(e)}"}
            print(json.dumps(error_response))
            sys.stdout.flush()
