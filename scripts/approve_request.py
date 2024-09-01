import requests
import json
import sys


def approve_request(decision_id, approved=True):
    url = "http://localhost:8000/api/submit-decision"

    print("approved", approved)

    data = {"decision_id": decision_id, "approved": approved}

    try:
        response = requests.post(url, json=data)
        response.raise_for_status()

        result = response.json()
        print(f"Decision submitted successfully: {result['status']}")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python approve_request.py <decision_id> [approved]")
        print("Example: python approve_request.py abc123 true")
        sys.exit(1)

    decision_id = sys.argv[1]
    approved = True if len(sys.argv) < 3 or sys.argv[2].lower() == "true" else False

    approve_request(decision_id, approved)
