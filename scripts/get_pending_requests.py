import requests
import json


def get_pending_requests():
    url = "http://localhost:8000/api/pending-decisions"

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes

        pending_decisions = response.json()["pending_decisions"]

        if not pending_decisions:
            print("No pending decisions.")
        else:
            print("Pending Decisions:")
            for i, decision in enumerate(pending_decisions):
                if i > 0:
                    print("- - " * 5)
                print(f"ID: {decision['id']}")
                print(f"Message: {decision['message']}")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    get_pending_requests()
