# Hackathon for Technical AI Safety Startups

Hackathon Page: https://www.apartresearch.com/event/ais-startup-hackathon  
Project Page: TBD


# Project

This project contains a demo of Ælign, a platform for supervising and orchestrating workflows in a multi-agent collaborative environment.

In this demo we show how we envision a finished workflow to look like, as presented by the `align-ui` app, and we show how an agent workflow implementation may look like. 


## Ælign Demo App

First, let's have a look at the demo app. This is the scenario selection page. We have pre-built a few scenrios in order to illustrate the idea.

![Scenario Selection](assets/scenario_selection.png?raw=true "App Screenshot")

For this demo we'll choose the Research Paper Assistance scenario. Then, we navigate the Agent Setup, where we're presented with the following view:

![Agent Setup](assets/agent_setup.png?raw=true "App Screenshot")

Here we'll enable users to configure their multi-agent workflow and design their teams of AI agents as they see fit. We have recommended a core team of AI agents for this particular use case out of the box. The graph of agents can be seen on the right hand side. Additional agents can be added and configured. 

Here's where the protocols come in - we have identified that for this use case the following protocols should be enforced in order to ensure high quality results and reliability:
- Ethical Research Standards
- Peer Review Process
- Data Integrity

Additionally, we see that our supervisor agent has two certifications regarding conducting ethical research and adhering to academic integrity. Those certifications show what the supervisor will care about when orchestrating the execution of the task and managing the team of AI agents.

We plan to develop protocols per use case and carefully evaluate what is important for each one. 

Now, we'll click on "complete setup" and view a mock execution of this task. Here we focus on providing a good overview of what the agents are doing and how the supervisor is helping them stay on track. This can be further developed into a dashboard.

![Execution Log](assets/execution_log.png?raw=true "App Screenshot")

In the execution log above, we can see the order in which things occurred. We can see the supervisor's involvement and risk assessment scores. For example, when the Researcher agent was conducting literature review, the supervisor assigned risk level of medium and got involved with guidance on ensuring comprehensive coverage of relevant literature and with critically evaluating sources.

We have not included any steps regarding deployment, but in real world scenario we'll provide tools to save your team of AI agents, deploy them and notification configuration options (if human intervention is needed / wanted).

This one of the 3 use cases, we have provided examples for. To view the other use cases, you can spin up the UI with:
```
cd align-ui
npm install
npm run dev
```

Navigate to http://localhost:3000/ to play around with the demo.

## Agent Workflows

In the `workflows` folder, we have included a partially mocked example of an agent workflow setup for the research paper assistance task.

The code aims to exemplify what kind of structure we'd be looking to implement. It currently demonstrates the following aspects that we have in mind for the platform:
-  how we may set up risk levels and invoke human intervention based on risk level
- enforcing use case specific protocols (mocked out code for now) and halting execution based on checks
- what kinds of tools the AI agents in this team may be equipped with (e.g. literature search tool, data analysis tool, peer review tool, etc)
- how a notification to a human may be implemented via an API call, such that the workflow awaits a response before continuing 
- how the supervisor agent may be set up and what kind of plan it may output for this task

We use `langchain` and `langgraph` to set up the agents and the workflow.

To run the code, make sure you have an `.env` file with `OPENAI_API_KEY` set in it, so that the LLM can be instantiated. You can install dependencies with `pip install -r requirements.txt`.

In the first scenario we'll set the human intervention risk threshold to `CRITICAL` only, which means that no human involvement will be needed. Let's run the chain and see what happens! (Note: there is currently a warning that's displayed at the end which does not affect execution but needs to be fixed, stay tuned). Here are the execution logs:

```
(dev) ➜  ai-safety-startup git:(main) ✗ python workflows/research_paper_assistant.py
Workflow started.
Supervisor: Current step is supervisor
Supervisor: Completed steps are []
Supervisor: Creating initial research plan.
Supervisor: Created plan: [ResearchStep(name='literature_review', description='Conduct comprehensive literature review', agent='literature_review', risk_level=<RiskLevel.MEDIUM: 2>), ResearchStep(name='data_analysis', description='Analyze collected data', agent='data_analysis', risk_level=<RiskLevel.HIGH: 3>), ResearchStep(name='writing', description='Write initial draft of findings', agent='writing', risk_level=<RiskLevel.MEDIUM: 2>), ResearchStep(name='peer_review', description='Conduct peer review of the draft', agent='peer_review', risk_level=<RiskLevel.HIGH: 3>), ResearchStep(name='revision', description='Revise based on peer review feedback', agent='writing', risk_level=<RiskLevel.MEDIUM: 2>)]
Router: Routing to 'literature_review' agent.
Literature Review Agent: Searching for 'Conduct comprehensive literature review'
Literature Review Agent: Completed search. Result: Found 5 relevant papers about Conduct comprehensive literature review
Supervisor: Current step is literature_review
Supervisor: Completed steps are []
Supervisor: Assessed risk for 'literature_review' as MEDIUM
Supervisor: Moving from 'literature_review' to 'data_analysis'
Router: Routing to 'data_analysis' agent.
Data Analysis Agent: Analyzing 'Analyze collected data'
Data Analysis Agent: Completed analysis. Result: Analysis complete. Key findings: Analyze collected data
Supervisor: Current step is data_analysis
Supervisor: Completed steps are ['literature_review']
Supervisor: Assessed risk for 'data_analysis' as HIGH
Supervisor: Moving from 'data_analysis' to 'writing'
Router: Routing to 'writing' agent.
Writing Agent: Writing section on 'Write initial draft of findings'
Writing Agent: Completed writing. Result: Drafted a section on Write initial draft of findings
Supervisor: Current step is writing
Supervisor: Completed steps are ['literature_review', 'data_analysis']
Supervisor: Assessed risk for 'writing' as MEDIUM
Supervisor: Moving from 'writing' to 'peer_review'
Router: Routing to 'peer_review' agent.
Peer Review Agent: Conducting peer review
Peer Review Agent: Completed review. Result: Peer review complete. Suggestions: Drafted a section on Write initial draft of findings
Supervisor: Current step is peer_review
Supervisor: Completed steps are ['literature_review', 'data_analysis', 'writing']
Supervisor: Assessed risk for 'peer_review' as HIGH
Supervisor: Moving from 'peer_review' to 'revision'
Router: Routing to 'writing' agent.
Writing Agent: Writing section on 'Revise based on peer review feedback'
Writing Agent: Completed writing. Result: Drafted a section on Revise based on peer review feedback
Supervisor: Current step is revision
Supervisor: Completed steps are ['literature_review', 'data_analysis', 'writing', 'peer_review']
Supervisor: Assessed risk for 'revision' as MEDIUM
Supervisor: All steps completed. Ending workflow.
Router: Workflow complete.

Final State:
Workflow Status: COMPLETED
Current Step: __end__
Completed Steps: ['literature_review', 'data_analysis', 'writing', 'peer_review', 'revision']
Results:
  literature_review: Found 5 relevant papers about Conduct comprehensive literature review
  data_analysis: Analysis complete. Key findings: Analyze collected data
  writing: Drafted a section on Revise based on peer review feedback
  peer_review: Peer review complete. Suggestions: Drafted a section on Write initial draft of findings
```

Now, let's demonstrate how we may loop in a human. We set the risk level down to `HIGH` (in `initial_state.human_intervention_config`) and we make sure that the human decision API is running by kicking it off with:
```
(dev) ➜  ai-safety-startup git:(main) ✗ python api/human_decision_api.py
```

Now, when we run the workflow, it pauses and awaits the decision from the human. We're currently at:
```
(dev) ➜  ai-safety-startup git:(main) ✗ python workflows/research_paper_assistant.py
Workflow started.
Supervisor: Current step is supervisor
Supervisor: Completed steps are []
Supervisor: Creating initial research plan.
Supervisor: Created plan: [ResearchStep(name='literature_review', description='Conduct comprehensive literature review', agent='literature_review', risk_level=<RiskLevel.MEDIUM: 2>), ResearchStep(name='data_analysis', description='Analyze collected data', agent='data_analysis', risk_level=<RiskLevel.HIGH: 3>), ResearchStep(name='writing', description='Write initial draft of findings', agent='writing', risk_level=<RiskLevel.MEDIUM: 2>), ResearchStep(name='peer_review', description='Conduct peer review of the draft', agent='peer_review', risk_level=<RiskLevel.HIGH: 3>), ResearchStep(name='revision', description='Revise based on peer review feedback', agent='writing', risk_level=<RiskLevel.MEDIUM: 2>)]
Router: Routing to 'literature_review' agent.
Literature Review Agent: Searching for 'Conduct comprehensive literature review'
Literature Review Agent: Completed search. Result: Found 5 relevant papers about Conduct comprehensive literature review
Supervisor: Current step is literature_review
Supervisor: Completed steps are []
Supervisor: Assessed risk for 'literature_review' as MEDIUM
Supervisor: Moving from 'literature_review' to 'data_analysis'
Router: Routing to 'data_analysis' agent.
Data Analysis Agent: Analyzing 'Analyze collected data'
Data Analysis Agent: Completed analysis. Result: Analysis complete. Key findings: Analyze collected data
NOTIFICATION: High risk step 'data_analysis' (Risk: HIGH). Approve to proceed.
Waiting for human decision...
```

in order to submit a decision I am going to make use of one of the scripts and run:
```
➜  ai-safety-startup git:(main) ✗ python scripts/get_pending_requests.py
Pending Decisions:
ID: b5050a51-c887-4ca7-b8a7-059f9f3f9687
Message: High risk step 'data_analysis' (Risk: HIGH). Approve to proceed.
```

and then I am going to run

```
➜  ai-safety-startup git:(main) ✗ python scripts/approve_request.py b5050a51-c887-4ca7-b8a7-059f9f3f9687 true
approved True
Decision submitted successfully: Decision submitted successfully
```

and then I'll do the same for another step that requires human intervention and then we're done! Here's the remaining log:
```
Human decision received: Approved
Supervisor: Current step is data_analysis
Supervisor: Completed steps are ['literature_review']
Supervisor: Assessed risk for 'data_analysis' as HIGH
Supervisor: Moving from 'data_analysis' to 'writing'
Router: Routing to 'writing' agent.
Writing Agent: Writing section on 'Write initial draft of findings'
Writing Agent: Completed writing. Result: Drafted a section on Write initial draft of findings
Supervisor: Current step is writing
Supervisor: Completed steps are ['literature_review', 'data_analysis']
Supervisor: Assessed risk for 'writing' as MEDIUM
Supervisor: Moving from 'writing' to 'peer_review'
Router: Routing to 'peer_review' agent.
Peer Review Agent: Conducting peer review
Peer Review Agent: Completed review. Result: Peer review complete. Suggestions: Drafted a section on Write initial draft of findings
NOTIFICATION: High risk step 'peer_review' (Risk: HIGH). Approve to proceed.
Waiting for human decision...
Human decision received: Approved
Supervisor: Current step is peer_review
Supervisor: Completed steps are ['literature_review', 'data_analysis', 'writing']
Supervisor: Assessed risk for 'peer_review' as HIGH
Supervisor: Moving from 'peer_review' to 'revision'
Router: Routing to 'writing' agent.
Writing Agent: Writing section on 'Revise based on peer review feedback'
Writing Agent: Completed writing. Result: Drafted a section on Revise based on peer review feedback
Supervisor: Current step is revision
Supervisor: Completed steps are ['literature_review', 'data_analysis', 'writing', 'peer_review']
Supervisor: Assessed risk for 'revision' as MEDIUM
Supervisor: All steps completed. Ending workflow.
Router: Workflow complete.

Final State:
Workflow Status: COMPLETED
Current Step: __end__
Completed Steps: ['literature_review', 'data_analysis', 'writing', 'peer_review', 'revision']
Results:
  literature_review: Found 5 relevant papers about Conduct comprehensive literature review
  data_analysis: Analysis complete. Key findings: Analyze collected data
  writing: Drafted a section on Revise based on peer review feedback
  peer_review: Peer review complete. Suggestions: Drafted a section on Write initial draft of findings
```

Let's also explore the scenario when the human does not approve the decision.

```
Workflow started.
Supervisor: Current step is supervisor
Supervisor: Completed steps are []
Supervisor: Creating initial research plan.
Supervisor: Created plan: [ResearchStep(name='literature_review', description='Conduct comprehensive literature review', agent='literature_review', risk_level=<RiskLevel.MEDIUM: 2>), ResearchStep(name='data_analysis', description='Analyze collected data', agent='data_analysis', risk_level=<RiskLevel.HIGH: 3>), ResearchStep(name='writing', description='Write initial draft of findings', agent='writing', risk_level=<RiskLevel.MEDIUM: 2>), ResearchStep(name='peer_review', description='Conduct peer review of the draft', agent='peer_review', risk_level=<RiskLevel.HIGH: 3>), ResearchStep(name='revision', description='Revise based on peer review feedback', agent='writing', risk_level=<RiskLevel.MEDIUM: 2>)]
Router: Routing to 'literature_review' agent.
Literature Review Agent: Searching for 'Conduct comprehensive literature review'
Literature Review Agent: Completed search. Result: Found 5 relevant papers about Conduct comprehensive literature review
Supervisor: Current step is literature_review
Supervisor: Completed steps are []
Supervisor: Assessed risk for 'literature_review' as MEDIUM
Supervisor: Moving from 'literature_review' to 'data_analysis'
Router: Routing to 'data_analysis' agent.
Data Analysis Agent: Analyzing 'Analyze collected data'
Data Analysis Agent: Completed analysis. Result: Analysis complete. Key findings: Analyze collected data
NOTIFICATION: High risk step 'data_analysis' (Risk: HIGH). Approve to proceed.
Waiting for human decision...
Human decision received: Rejected
Supervisor: Current step is data_analysis
Supervisor: Completed steps are ['literature_review']
Supervisor: Assessed risk for 'data_analysis' as HIGH
Supervisor: Step 'data_analysis' rejected by human. Halting workflow.
Router: Workflow complete.

Final State:
Workflow Status: COMPLETED
Current Step: __end__
Completed Steps: ['literature_review']
Results:
  literature_review: Found 5 relevant papers about Conduct comprehensive literature review
  data_analysis: Analysis complete. Key findings: Analyze collected data
```

We can see that the workflow halted after the refusal.