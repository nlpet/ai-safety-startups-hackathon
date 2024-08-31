import React, { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, AlertTriangle, ShieldCheck, CirclePlay } from "lucide-react";
import InteractiveAgentSetup from "./InteractiveAgentSetup";
import HumanInterventionCard from "./HumanInterventionCard";

import { scenarioData, simulationLogs } from "@/constants/agents";

const AgentInteractionGraph = ({ agents, connections, activeAgentId }) => {
  const [positions, setPositions] = useState({});

  useEffect(() => {
    const angleStep = (2 * Math.PI) / agents.length;
    const radius = 150;
    const center = { x: 200, y: 200 };

    const newPositions = {};
    agents.forEach((agent, index) => {
      const angle = index * angleStep;
      newPositions[agent.id] = {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      };
    });
    setPositions(newPositions);
  }, [agents]);

  const getColor = (agentId) => {
    if (agentId === activeAgentId) return "#ff6b6b";
    return "#a2c4c9";
  };

  return (
    <svg width="500" height="500" viewBox="0 0 500 500">
      {connections.map((connection, index) => {
        const start = positions[connection.from];
        const end = positions[connection.to];
        return start && end ? (
          <line
            key={index}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#95a5a6"
            strokeWidth="2"
          />
        ) : null;
      })}
      {agents.map((agent) => {
        const position = positions[agent.id];
        return position ? (
          <g key={agent.id}>
            <rect
              x={position.x - 50}
              y={position.y - 20}
              width="150"
              height="40"
              fill={getColor(agent.id)}
              rx="5"
              ry="5"
            />
            <text
              x={position.x + 20}
              y={position.y}
              textAnchor="middle"
              dy=".3em"
              fill="#1a1d1e"
              fontSize="14"
            >
              {agent.name}
            </text>
          </g>
        ) : null;
      })}
    </svg>
  );
};

const getRiskColor = (risk) => {
  switch (risk) {
    case "low":
      return "text-green-500";
    case "medium":
      return "text-yellow-500";
    case "high":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const ExecutionLog = ({ log, onHumanIntervention }) => {
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  return (
    <div className="h-[600px] overflow-y-auto border rounded p-2">
      {log.map((entry, index) => (
        <div key={index} className="mb-2 p-2 bg-gray-100 rounded text-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold text-lg">{entry.agentName}</span>
              <span className="text-gray-500 ml-2">{entry.timestamp}</span>
            </div>
            <span className={`${getRiskColor(entry.risk)} text-sm font-medium`}>
              Risk: {entry.risk}
            </span>
          </div>
          <div className="mt-1 text-md">{entry.action}</div>
          {entry.supervisorMessage && (
            <div className="mt-3 text-teal-600 text-sm flex items-start">
              <ShieldCheck size={16} className="mr-1 mt-1 flex-shrink-0" />
              <span>Supervisor: {entry.supervisorMessage}</span>
            </div>
          )}
          {entry.requiresHumanIntervention && (
            <div className="flex items-center text-orange-500 text-sm mt-1">
              <AlertTriangle size={16} className="mr-1" />
              Human intervention required
            </div>
          )}
          {entry.requiresHumanIntervention && (
            <HumanInterventionCard
              options={entry.interventionOptions}
              onDecision={(decision) =>
                onHumanIntervention(decision, entry.timestamp)
              }
            />
          )}
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
};

const ScenarioCard = ({ scenario, onSelect, selectedScenario }) => {
  const Icon = scenario.icon;
  const selectedScenarioMatches =
    selectedScenario && scenario.id === selectedScenario.id;
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Icon size={24} className="mr-2" />
          <h3 className="text-xl font-bold">{scenario.name}</h3>
        </div>
        <p className="mb-4 h-20">{scenario.description}</p>
        <Button
          onClick={() => onSelect(scenario)}
          className="w-full"
          disabled={selectedScenarioMatches}
        >
          {selectedScenarioMatches ? (
            <>
              Scenario Selected
              <Check className="ml-2" />
            </>
          ) : (
            <>Select Scenario</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const MultiAgentCollaborationMockup = () => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [agentSetup, setAgentSetup] = useState(null);
  const [executionLog, setExecutionLog] = useState([]);
  const [activeAgentId, setActiveAgentId] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  const handleScenarioSelect = useCallback((scenario) => {
    setSelectedScenario(scenario);
    setAgentSetup({
      agents: scenario.defaultAgents,
      connections: scenario.defaultAgents
        .filter((agent) => agent.id !== "S1")
        .map((agent) => ({ from: "S1", to: agent.id })),
    });
    setExecutionLog([]);
    setActiveAgentId(null);
    setSetupComplete(false);
  }, []);

  const handleAgentSetupUpdate = useCallback((newSetup) => {
    setAgentSetup(newSetup);
  }, []);

  const completeSetup = useCallback(() => {
    setSetupComplete(true);
  }, []);

  const executionInterval = useRef(null);

  const simulateExecution = useCallback(() => {
    if (!selectedScenario) return;

    setIsExecuting(true);
    if (currentLogIndex === 0) setExecutionLog([]);

    const simulatedLog = simulationLogs[selectedScenario.id];

    const runSimulation = () => {
      if (currentLogIndex < simulatedLog.length) {
        const currentEntry = simulatedLog[currentLogIndex];

        setExecutionLog((prevLog) => [...prevLog, currentEntry]);
        setActiveAgentId(
          agentSetup.agents.find(
            (agent) => agent.name === currentEntry.agentName
          )?.id
        );

        if (currentEntry.requiresHumanIntervention) {
          setIsExecuting(false);
        } else {
          setCurrentLogIndex((prevIndex) => prevIndex + 1);
        }
      } else {
        setIsExecuting(false);
        setActiveAgentId(null);
        setCurrentLogIndex(0);
        clearInterval(executionInterval.current);
      }
    };

    executionInterval.current = setInterval(runSimulation, 2000);

    return () => {
      clearInterval(executionInterval.current);
    };
  }, [selectedScenario, agentSetup, currentLogIndex]);

  useEffect(() => {
    if (isExecuting) {
      simulateExecution();
    }
    return () => {
      if (executionInterval.current) {
        clearInterval(executionInterval.current);
      }
    };
  }, [isExecuting, simulateExecution]);

  const handleHumanIntervention = useCallback((decision, timestamp) => {
    setExecutionLog((prevLog) => [
      ...prevLog,
      {
        timestamp: timestamp,
        agentName: "Human",
        action: `Decision: ${decision}`,
        risk: "low",
      },
    ]);
    setCurrentLogIndex((prevIndex) => prevIndex + 1);
    setIsExecuting(true);
  }, []);

  const startOrContinueExecution = () => {
    if (currentLogIndex === 0) {
      setExecutionLog([]);
    }
    setIsExecuting(true);
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="scenario" className="w-full mb-6">
        <TabsList>
          <TabsTrigger className="text-md" value="scenario">
            Scenario Selection
          </TabsTrigger>
          <TabsTrigger
            className="text-md"
            value="setup"
            disabled={!selectedScenario}
          >
            Agent Setup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scenario">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarioData.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onSelect={handleScenarioSelect}
                selectedScenario={selectedScenario}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="setup">
          {selectedScenario && (
            <Card>
              <CardHeader className="text-lg">
                Agent Setup for {selectedScenario.name}
              </CardHeader>
              <hr className="mb-7" />
              <CardContent>
                {agentSetup && (
                  <>
                    <InteractiveAgentSetup
                      initialAgents={agentSetup.agents}
                      initialConnections={agentSetup.connections}
                      onUpdate={handleAgentSetupUpdate}
                      scenarioType={selectedScenario.id}
                    />
                    <Button onClick={completeSetup} className="mt-5">
                      Complete Setup
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {setupComplete && (
        <Card className="mt-6">
          <CardHeader>
            Execution
            <Button
              className="w-64"
              onClick={startOrContinueExecution}
              disabled={isExecuting}
            >
              {isExecuting ? (
                "Executing..."
              ) : currentLogIndex === 0 ? (
                <>
                  Start <CirclePlay className="h-5 w-5 ml-3" />
                </>
              ) : (
                "Continue Execution"
              )}
            </Button>
          </CardHeader>
          <hr className="mb-7" />
          <CardContent>
            <div className="flex">
              <div className="w-1/2 pr-2">
                <h3 className="font-bold mb-2">Execution Log</h3>
                <ExecutionLog
                  log={executionLog}
                  onHumanIntervention={handleHumanIntervention}
                />
              </div>
              <div className="w-1/2 pl-2">
                <h3 className="font-bold mb-2">Agent Interaction</h3>
                {agentSetup && (
                  <AgentInteractionGraph
                    agents={agentSetup.agents}
                    connections={agentSetup.connections}
                    activeAgentId={activeAgentId}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiAgentCollaborationMockup;
