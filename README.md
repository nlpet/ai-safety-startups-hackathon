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

TODO: Complete this




