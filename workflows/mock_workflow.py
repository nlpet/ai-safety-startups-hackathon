import asyncio
from typing import Dict, Any, List, Literal
from enum import Enum
from pydantic import BaseModel


class WorkflowStatus(Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    HALTED = "halted"


class RiskLevel(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3


class ResearchStep(BaseModel):
    name: str
    description: str
    agent: str
    risk_level: RiskLevel


class ResearchState(BaseModel):
    status: WorkflowStatus = WorkflowStatus.IN_PROGRESS
    current_step: str
    plan: List[ResearchStep]
    results: Dict[str, Any] = {}
    completed_steps: List[str] = []
    logs: List[str] = []
    last_node: str = "supervisor"


def supervisor_agent(state: ResearchState) -> Dict[str, Any]:
    logs = state.logs
    plan = state.plan
    completed_steps = state.completed_steps

    logs.append(f"Supervisor: Current step is {state.current_step}")
    logs.append(f"Supervisor: Completed steps are {completed_steps}")

    if not plan:
        # Create initial plan
        plan = [
            ResearchStep(
                name="literature_review",
                description="Conduct literature review",
                agent="literature_review",
                risk_level=RiskLevel.MEDIUM,
            ),
            ResearchStep(
                name="data_analysis",
                description="Analyze data",
                agent="data_analysis",
                risk_level=RiskLevel.HIGH,
            ),
            ResearchStep(
                name="writing",
                description="Write draft",
                agent="writing",
                risk_level=RiskLevel.MEDIUM,
            ),
            ResearchStep(
                name="peer_review",
                description="Conduct peer review",
                agent="peer_review",
                risk_level=RiskLevel.HIGH,
            ),
            ResearchStep(
                name="revision",
                description="Revise based on feedback",
                agent="writing",
                risk_level=RiskLevel.MEDIUM,
            ),
        ]
        logs.append(f"Supervisor: Created plan: {plan}")
        return {
            "plan": plan,
            "current_step": plan[0].name,
            "logs": logs,
            "last_node": "supervisor",
        }

    current_step = next(
        (step for step in plan if step.name == state.current_step), None
    )
    if current_step and current_step.name not in completed_steps:
        completed_steps.append(current_step.name)
        next_step_index = plan.index(current_step) + 1
        if next_step_index < len(plan):
            next_step = plan[next_step_index].name
            logs.append(
                f"Supervisor: Moving from '{current_step.name}' to '{next_step}'"
            )
        else:
            next_step = "END"
            logs.append("Supervisor: All steps completed. Ending workflow.")

        return {
            "current_step": next_step,
            "completed_steps": completed_steps,
            "logs": logs,
            "last_node": "supervisor",
        }
    else:
        logs.append("Supervisor: No valid next step. Ending workflow.")
        return {
            "current_step": "END",
            "completed_steps": completed_steps,
            "logs": logs,
            "last_node": "supervisor",
        }


def literature_review_agent(state: ResearchState) -> Dict[str, Any]:
    logs = state.logs
    logs.append("Literature Review Agent: Conducting literature review")
    result = "Found 5 relevant papers about the impact of AI on job markets"
    logs.append(f"Literature Review Agent: Completed review. Result: {result}")
    return {
        "results": {**state.results, "literature_review": result},
        "logs": logs,
        "last_node": "literature_review",
    }


def data_analysis_agent(state: ResearchState) -> Dict[str, Any]:
    logs = state.logs
    logs.append("Data Analysis Agent: Analyzing collected data")
    result = (
        "Analysis shows a 30% increase in AI-related job postings over the past year"
    )
    logs.append(f"Data Analysis Agent: Completed analysis. Result: {result}")
    return {
        "results": {**state.results, "data_analysis": result},
        "logs": logs,
        "last_node": "data_analysis",
    }


def writing_agent(state: ResearchState) -> Dict[str, Any]:
    logs = state.logs
    if state.current_step == "writing":
        logs.append("Writing Agent: Writing initial draft")
        result = "Completed initial draft of the research paper"
    else:  # revision step
        logs.append("Writing Agent: Revising based on peer review feedback")
        result = "Completed revised version of the research paper"
    logs.append(f"Writing Agent: Completed writing. Result: {result}")
    return {
        "results": {**state.results, state.current_step: result},
        "logs": logs,
        "last_node": "writing",
    }


def peer_review_agent(state: ResearchState) -> Dict[str, Any]:
    logs = state.logs
    logs.append("Peer Review Agent: Conducting peer review")
    result = (
        "Peer review complete. Suggestions: Expand on AI's impact in healthcare sector"
    )
    logs.append(f"Peer Review Agent: Completed review. Result: {result}")
    return {
        "results": {**state.results, "peer_review": result},
        "logs": logs,
        "last_node": "peer_review",
    }


def route_step(
    state: ResearchState,
) -> Literal[
    "supervisor", "literature_review", "data_analysis", "writing", "peer_review", "END"
]:
    if state.status == WorkflowStatus.COMPLETED or state.current_step == "END":
        return "END"
    if state.last_node == "supervisor":
        current_step_info = next(
            (step for step in state.plan if step.name == state.current_step), None
        )
        if current_step_info:
            state.logs.append(f"Router: Routing to '{current_step_info.agent}' agent.")
            return current_step_info.agent
    return "supervisor"


async def run_workflow(initial_state: Dict[str, Any]):
    state = ResearchState(**initial_state)

    while state.status == WorkflowStatus.IN_PROGRESS:
        next_node = route_step(state)
        if next_node == "END":
            state.status = WorkflowStatus.COMPLETED
            state.logs.append("Workflow completed successfully.")
            yield state.dict()
            break

        if next_node == "supervisor":
            result = supervisor_agent(state)
        elif next_node == "literature_review":
            result = literature_review_agent(state)
        elif next_node == "data_analysis":
            result = data_analysis_agent(state)
        elif next_node == "writing":
            result = writing_agent(state)
        elif next_node == "peer_review":
            result = peer_review_agent(state)
        else:
            raise ValueError(f"Unknown node: {next_node}")

        state = ResearchState(**{**state.dict(), **result})
        yield state.dict()


async def main():
    initial_state = {
        "current_step": "supervisor",
        "plan": [],
        "logs": ["Workflow started."],
    }

    async for state in run_workflow(initial_state):
        print(f"Current Step: {state['current_step']}")
        print(f"Completed Steps: {state['completed_steps']}")
        print(f"Last Node: {state['last_node']}")
        print("Logs:")
        for log in state["logs"][-3:]:  # Print only the last 3 logs for brevity
            print(f"  {log}")
        print("---")

    print("Workflow completed.")
    print("Final Results:")
    for step, result in state["results"].items():
        print(f"  {step}: {result}")


if __name__ == "__main__":
    asyncio.run(main())
