import json
from typing import List, Dict
from config import CHATS_FILE, MESSAGES_FILE

def load_data(filename: str) -> List[Dict]:
    """Load data from a JSON file."""
    try:
        with open(filename, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        with open(filename, "w") as f:
            json.dump([], f)
        return []

def save_data(filename: str, data: List[Dict]):
    """Save data to a JSON file."""
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)
