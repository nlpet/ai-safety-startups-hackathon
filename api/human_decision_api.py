from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncio
import uuid

app = FastAPI()


TIMEOUT = 300


class DecisionRequest(BaseModel):
    message: str


class DecisionResponse(BaseModel):
    approved: bool


class DecisionSubmission(BaseModel):
    decision_id: str
    approved: bool


# Simulating a dictionary of pending decisions
pending_decisions = {}
approved_decisions = {}


@app.post("/api/human-decision", response_model=DecisionResponse)
async def human_decision(request: DecisionRequest):
    decision_id = str(uuid.uuid4())
    pending_decisions[decision_id] = request.message
    print(f"Received decision request: {request.message}")
    print(f"Decision ID: {decision_id}")

    # Wait for the decision to be made
    for _ in range(TIMEOUT):  # Wait for up to 60 seconds
        await asyncio.sleep(1)
        if decision_id not in pending_decisions:
            return DecisionResponse(approved=approved_decisions.get(decision_id, False))

    # If no decision was made in time, remove from pending and return an error
    del pending_decisions[decision_id]
    raise HTTPException(status_code=408, detail="Decision timeout")


@app.get("/api/pending-decisions")
async def get_pending_decisions():
    return {
        "pending_decisions": [
            {"id": k, "message": v} for k, v in pending_decisions.items()
        ]
    }


@app.post("/api/submit-decision")
async def submit_decision(submission: DecisionSubmission):
    if submission.decision_id not in pending_decisions:
        raise HTTPException(status_code=404, detail="Decision not found")

    del pending_decisions[submission.decision_id]

    if submission.approved:
        approved_decisions[submission.decision_id] = True

    print(
        f"Decision {submission.decision_id} {'approved' if submission.approved else 'rejected'}"
    )
    return {"status": "Decision submitted successfully"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
