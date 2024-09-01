import os
import aiohttp
import asyncio
from typing import Annotated, Literal, TypedDict, List, Dict, Any, Callable, Coroutine
from enum import IntEnum, Enum
from langchain_core.messages import (
    HumanMessage,
    AIMessage,
    SystemMessage,
    FunctionMessage,
)
from langchain_openai import ChatOpenAI
from langchain_core.tools import BaseTool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from pydantic import BaseModel, Field
from dotenv import dotenv_values

env = dotenv_values()
os.environ["OPENAI_API_KEY"] = env["OPENAI_API_KEY"]


class RiskLevel(IntEnum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4


# class WorkflowStatus(IntEnum):
#     IN_PROGRESS = 0
#     COMPLETED = 1
#     HALTED = 2


class WorkflowStatus(Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    HALTED = "halted"


class HumanInterventionConfig(BaseModel):
    enabled: bool = True
    risk_threshold: RiskLevel = RiskLevel.HIGH
    notification_function: Callable[[str], Coroutine[Any, Any, bool]] = None


class ResearchStep(BaseModel):
    name: str
    description: str
    agent: str
    risk_level: RiskLevel


class ResearchState(TypedDict):
    messages: List[HumanMessage | AIMessage | SystemMessage | FunctionMessage]
    current_step: str
    plan: List[ResearchStep]
    results: Dict[str, Any]
    completed_steps: List[str]
    logs: List[str]
    human_intervention_config: HumanInterventionConfig
    last_node: str
    status: WorkflowStatus


class ProtocolEnforcer:
    def __init__(self):
        self.protocols = {
            "safety": self.check_safety_protocol,
            "ethical": self.check_ethical_protocol,
        }

    def check_safety_protocol(self, action: str, context: Dict[str, Any]) -> bool:
        # Implement safety checks
        return True

    def check_ethical_protocol(self, action: str, context: Dict[str, Any]) -> bool:
        # Implement ethical checks
        return True

    def enforce(self, action: str, context: Dict[str, Any]) -> bool:
        return all(check(action, context) for check in self.protocols.values())


class LiteratureSearchTool(BaseTool):
    name = "search_literature"
    description = "Search academic databases for relevant literature."

    def _run(self, query: str) -> str:
        return f"Found 5 relevant papers about {query}"


class DataAnalysisTool(BaseTool):
    name = "analyze_data"
    description = "Perform data analysis on the given dataset."

    def _run(self, data: str) -> str:
        return f"Analysis complete. Key findings: {data}"


class WritingSectionTool(BaseTool):
    name = "write_section"
    description = "Write a section of the research paper."

    def _run(self, topic: str) -> str:
        return f"Drafted a section on {topic}"


class PeerReviewTool(BaseTool):
    name = "peer_review"
    description = "Conduct peer review of the draft."

    def _run(self, draft: str) -> str:
        return f"Peer review complete. Suggestions: {draft}"


tools = [
    LiteratureSearchTool(),
    DataAnalysisTool(),
    WritingSectionTool(),
    PeerReviewTool(),
]

# Initialize the language model
model = ChatOpenAI(temperature=0).bind_tools(tools)


async def get_human_decision(message: str) -> bool:
    api_url = "http://localhost:8000/api/human-decision"

    async with aiohttp.ClientSession() as session:
        async with session.post(api_url, json={"message": message}) as response:
            if response.status == 200:
                decision = await response.json()
                return decision.get("approved", False)
            elif response.status == 408:
                print("Decision timed out. Assuming rejection.")
                return False
            else:
                print(f"API call failed with status {response.status}")
                return False


async def human_intervention(state: ResearchState, message: str) -> bool:
    config = state["human_intervention_config"]
    if config.enabled:
        print(f"NOTIFICATION: {message}")
        print("Waiting for human decision...")
        decision = await get_human_decision(message)
        print(f"Human decision received: {'Approved' if decision else 'Rejected'}")
        return decision
    return True


def assess_risk(step: ResearchStep, context: Dict[str, Any]) -> RiskLevel:
    if "conflicting" in context.get("last_result", ""):
        return RiskLevel.HIGH
    elif "inconsistencies" in context.get("last_result", ""):
        return RiskLevel.MEDIUM
    elif "revisions" in context.get("last_result", ""):
        return RiskLevel.HIGH
    return step.risk_level


def supervisor_agent(state: ResearchState) -> Dict[str, Any]:
    messages = state["messages"]
    logs = state["logs"]
    plan = state.get("plan", [])
    completed_steps = state.get("completed_steps", [])

    logs.append(f"Supervisor: Current step is {state['current_step']}")
    logs.append(f"Supervisor: Completed steps are {completed_steps}")

    if not plan:
        logs.append("Supervisor: Creating initial research plan.")
        system_message = SystemMessage(
            content="""
            You are the Supervisor Agent in a research assistance system. Create a structured plan for the research task, including specific steps and agent assignments.
            """
        )
        messages.append(system_message)
        response = model.invoke(messages)
        plan = parse_plan(response.content)
        logs.append(f"Supervisor: Created plan: {plan}")
        next_step = plan[0].name

        return {
            "messages": messages + [response],
            "plan": plan,
            "current_step": next_step,
            "completed_steps": completed_steps,
            "logs": logs,
            "last_node": "supervisor",
        }

    current_step = next(
        (step for step in plan if step.name == state["current_step"]), None
    )
    if current_step and current_step.name not in completed_steps:
        risk_level = assess_risk(current_step, state.get("results", {}))
        logs.append(
            f"Supervisor: Assessed risk for '{current_step.name}' as {risk_level.name}"
        )

        enforcer = ProtocolEnforcer()
        if not enforcer.enforce(current_step.name, state):
            logs.append(
                f"Supervisor: Step '{current_step.name}' violates protocols. Halting workflow."
            )
            return {"current_step": END, "logs": logs, "last_node": "supervisor"}

        completed_steps.append(current_step.name)
        next_step_index = plan.index(current_step) + 1
        if next_step_index < len(plan):
            next_step = plan[next_step_index].name
            logs.append(
                f"Supervisor: Moving from '{current_step.name}' to '{next_step}'"
            )
        else:
            logs.append("Supervisor: All steps completed. Ending workflow.")
            next_step = END

        return {
            "current_step": next_step,
            "completed_steps": completed_steps,
            "logs": logs,
            "last_node": "supervisor",
        }
    else:
        logs.append("Supervisor: No valid next step. Ending workflow.")
        return {
            "current_step": END,
            "completed_steps": completed_steps,
            "logs": logs,
            "last_node": "supervisor",
        }


def parse_plan(plan_text: str) -> List[ResearchStep]:
    # In a real implementation, this would parse the plan from the model's output
    return [
        ResearchStep(
            name="literature_review",
            description="Conduct comprehensive literature review",
            agent="literature_review",
            risk_level=RiskLevel.MEDIUM,
        ),
        ResearchStep(
            name="data_analysis",
            description="Analyze collected data",
            agent="data_analysis",
            risk_level=RiskLevel.HIGH,
        ),
        ResearchStep(
            name="writing",
            description="Write initial draft of findings",
            agent="writing",
            risk_level=RiskLevel.MEDIUM,
        ),
        ResearchStep(
            name="peer_review",
            description="Conduct peer review of the draft",
            agent="peer_review",
            risk_level=RiskLevel.HIGH,
        ),
        ResearchStep(
            name="revision",
            description="Revise based on peer review feedback",
            agent="writing",
            risk_level=RiskLevel.MEDIUM,
        ),
    ]


def literature_review_agent(state: ResearchState) -> Dict[str, Any]:
    query = state["plan"][0].description
    state["logs"].append(f"Literature Review Agent: Searching for '{query}'")
    result = LiteratureSearchTool().invoke(query)
    state["logs"].append(f"Literature Review Agent: Completed search. Result: {result}")
    return {
        "results": {**state.get("results", {}), "literature_review": result},
        "logs": state["logs"],
        "last_node": "literature_review",
    }


def data_analysis_agent(state: ResearchState) -> Dict[str, Any]:
    data = next(
        step for step in state["plan"] if step.name == "data_analysis"
    ).description
    state["logs"].append(f"Data Analysis Agent: Analyzing '{data}'")
    result = DataAnalysisTool().invoke(data)
    state["logs"].append(f"Data Analysis Agent: Completed analysis. Result: {result}")
    return {
        "results": {**state.get("results", {}), "data_analysis": result},
        "logs": state["logs"],
        "last_node": "data_analysis",
    }


def writing_agent(state: ResearchState) -> Dict[str, Any]:
    topic = next(
        step for step in state["plan"] if step.name == state["current_step"]
    ).description
    state["logs"].append(f"Writing Agent: Writing section on '{topic}'")
    result = WritingSectionTool().invoke(topic)
    state["logs"].append(f"Writing Agent: Completed writing. Result: {result}")
    return {
        "results": {**state.get("results", {}), "writing": result},
        "logs": state["logs"],
        "last_node": "writing",
    }


def peer_review_agent(state: ResearchState) -> Dict[str, Any]:
    draft = state["results"].get("writing", "")
    state["logs"].append("Peer Review Agent: Conducting peer review")
    result = PeerReviewTool().invoke(draft)
    state["logs"].append(f"Peer Review Agent: Completed review. Result: {result}")
    return {
        "results": {**state.get("results", {}), "peer_review": result},
        "logs": state["logs"],
        "last_node": "peer_review",
    }


def route_step(
    state: ResearchState,
) -> Literal[
    "supervisor", "literature_review", "data_analysis", "writing", "peer_review", END
]:
    current_step = state["current_step"]
    last_node = state["last_node"]

    if current_step == END:
        state["logs"].append("Router: Workflow complete.")
        return END

    if set(state["completed_steps"]) == set(step.name for step in state["plan"]):
        state["logs"].append("Router: All steps completed. Ending workflow.")
        return END

    if last_node == "supervisor":
        current_step_info = next(
            (step for step in state["plan"] if step.name == current_step), None
        )
        if current_step_info:
            state["logs"].append(
                f"Router: Routing to '{current_step_info.agent}' agent."
            )
            return current_step_info.agent

    state["logs"].append("Router: Routing to supervisor.")
    return "supervisor"


# Define the graph
workflow = StateGraph(ResearchState)

# Add nodes
workflow.add_node("supervisor", supervisor_agent)
workflow.add_node("literature_review", literature_review_agent)
workflow.add_node("data_analysis", data_analysis_agent)
workflow.add_node("writing", writing_agent)
workflow.add_node("peer_review", peer_review_agent)

# Set the entrypoint
workflow.set_entry_point("supervisor")

# Add edges
workflow.add_conditional_edges("supervisor", route_step)
workflow.add_edge("literature_review", "supervisor")
workflow.add_edge("data_analysis", "supervisor")
workflow.add_edge("writing", "supervisor")
workflow.add_edge("peer_review", "supervisor")

# Initialize memory
checkpointer = MemorySaver()

# Compile the graph
app = workflow.compile()


async def run_workflow(initial_state: ResearchState):
    current_state = initial_state.copy()
    last_log_index = 0

    try:
        async for state in app.astream(current_state, config={"recursion_limit": 50}):
            # Convert the dictionary state back to a ResearchState object
            current_state = ResearchState(**current_state)
            for node_name, node_output in state.items():
                if not isinstance(node_output, dict):
                    print(
                        f"Unexpected node output type for {node_name}: {type(node_output)}"
                    )
                    continue

                # Update current_state with new information
                current_state = ResearchState(**{**current_state, **node_output})

            # Print only new logs
            new_logs = current_state["logs"][last_log_index:]
            for log in new_logs:
                print(log)
            last_log_index = len(current_state["logs"])

            if current_state["current_step"] == END:
                current_state["status"] = WorkflowStatus.COMPLETED
                yield current_state
                return  # This will stop the generator

            yield current_state

    except Exception as e:
        print(f"An error occurred during workflow execution: {str(e)}")
        current_state["status"] = WorkflowStatus.HALTED
        current_state["logs"].append(f"Error: {str(e)}")
        yield current_state


async def main():
    initial_state = ResearchState(
        messages=[
            HumanMessage(
                content="I need help writing a research paper about the impact of AI on job markets."
            )
        ],
        current_step="supervisor",
        plan=[],
        results={},
        completed_steps=[],
        logs=["Workflow started."],
        human_intervention_config=HumanInterventionConfig(
            enabled=True, risk_threshold=RiskLevel.CRITICAL
        ),
        last_node="supervisor",
        status=WorkflowStatus.IN_PROGRESS,
    )

    final_state = initial_state
    try:
        async for state in run_workflow(initial_state):
            final_state = state
            if state["status"] != WorkflowStatus.IN_PROGRESS:
                break

        print("\nFinal State:")
        print(f"Workflow Status: {final_state['status'].name}")
        print(f"Current Step: {final_state['current_step']}")
        print(f"Completed Steps: {final_state['completed_steps']}")
        print("Results:")
        for step, result in final_state["results"].items():
            print(f"  {step}: {result}")
        print()

    except Exception as e:
        print(f"An error occurred in the main function: {str(e)}")
    finally:
        # Clean up any remaining tasks
        tasks = [t for t in asyncio.all_tasks() if t is not asyncio.current_task()]
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)


if __name__ == "__main__":
    asyncio.run(main())
