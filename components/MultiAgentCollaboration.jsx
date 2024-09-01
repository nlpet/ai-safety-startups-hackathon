import React, { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, AlertTriangle, ShieldCheck } from "lucide-react";
import InteractiveAgentSetup from "./InteractiveAgentSetup";
import HumanInterventionCard from "./HumanInterventionCard";

import { scenarioData, simulationLogs } from "@/constants/agents";

const AgentInteractionGraph = ({
  agents,
  connections,
  activeAgentId,
  requiresIntervention,
  actionCounts,
}) => {
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
    if (agentId === activeAgentId) return "#189c41";
    return "#2e446a";
  };

  return (
    <svg width="400" height="400" viewBox="0 0 400 400">
      {/* Draw connections */}
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
            strokeWidth="1"
          />
        ) : null;
      })}

      {/* Draw agent nodes */}
      {agents.map((agent) => {
        const position = positions[agent.id];
        return position ? (
          <g key={agent.id}>
            {/* Agent node */}
            <circle
              cx={position.x}
              cy={position.y}
              r="30"
              fill={getColor(agent.id)}
            />

            {/* Agent name */}
            <text
              x={position.x}
              y={position.y}
              textAnchor="middle"
              dy=".3em"
              fill="white"
              fontSize="12"
            >
              {agent.id}
            </text>

            {/* Action count badge */}
            {actionCounts[agent.id] > 0 &&
              !(requiresIntervention && agent.id === activeAgentId) && (
                <g>
                  <circle
                    cx={position.x + 25}
                    cy={position.y - 25}
                    r="13"
                    fill="#e74c3c"
                  />
                  <text
                    x={position.x + 25}
                    y={position.y - 25}
                    textAnchor="middle"
                    dy=".3em"
                    fill="white"
                    fontSize="12"
                  >
                    {actionCounts[agent.id]}
                  </text>
                </g>
              )}

            {/* Human intervention indicator */}
            {requiresIntervention && agent.id === activeAgentId && (
              <g transform={`translate(${position.x + 8}, ${position.y - 40})`}>
                <path
                  d="M15 0 L30 30 L0 30 Z"
                  fill="white"
                  stroke="black"
                  strokeWidth="1.5"
                />
                <text
                  x="15"
                  y="23"
                  textAnchor="middle"
                  fill="black"
                  fontSize="14"
                  fontWeight="bold"
                >
                  !
                </text>
              </g>
            )}
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
        <div
          key={index}
          className="mb-2 p-2 bg-slate-50 dark:bg-slate-900 rounded text-sm"
        >
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
  const [actionCounts, setActionCounts] = useState({});
  const [requiresIntervention, setRequiresIntervention] = useState(false);

  const currentLogIndexRef = useRef(0);
  const executionIntervalRef = useRef(null);
  const simulatedLogRef = useRef([]);

  const simulateExecution = useCallback(() => {
    if (!selectedScenario || isExecuting) {
      return;
    }

    setIsExecuting(true);
    if (currentLogIndexRef.current === 0) {
      setExecutionLog([]);
      setActionCounts({});
      simulatedLogRef.current = simulationLogs[selectedScenario.id];
    }

    const runSimulation = () => {
      if (currentLogIndexRef.current < simulatedLogRef.current.length) {
        const currentEntry =
          simulatedLogRef.current[currentLogIndexRef.current];

        setExecutionLog((prevLog) => {
          return [...prevLog, currentEntry];
        });

        const activeAgent = agentSetup.agents.find(
          (agent) => agent.name === currentEntry.agentName
        );
        setActiveAgentId(activeAgent?.id);

        setActionCounts((prevCounts) => ({
          ...prevCounts,
          [activeAgent?.id]: (prevCounts[activeAgent?.id] || 0) + 1,
        }));

        setRequiresIntervention(
          currentEntry.requiresHumanIntervention || false
        );

        if (currentEntry.requiresHumanIntervention) {
          clearInterval(executionIntervalRef.current);
          setIsExecuting(false);
        } else {
          currentLogIndexRef.current += 1;
        }
      } else {
        clearInterval(executionIntervalRef.current);
        setIsExecuting(false);
        setActiveAgentId(null);
        currentLogIndexRef.current = 0;
        setRequiresIntervention(false);
      }
    };

    runSimulation(); // Run immediately for the first entry
    executionIntervalRef.current = setInterval(runSimulation, 2000);

    return () => {
      if (executionIntervalRef.current) {
        clearInterval(executionIntervalRef.current);
      }
    };
  }, [selectedScenario, agentSetup, isExecuting]);

  useEffect(() => {
    return () => {
      if (executionIntervalRef.current) {
        clearInterval(executionIntervalRef.current);
      }
    };
  }, []);

  const handleHumanIntervention = useCallback(
    (decision, timestamp) => {
      setExecutionLog((prevLog) => [
        ...prevLog,
        {
          timestamp: timestamp,
          agentName: "Human",
          action: `Decision: ${decision}`,
          risk: "low",
        },
      ]);
      currentLogIndexRef.current += 1;
      setRequiresIntervention(false);
      setIsExecuting(true);
      simulateExecution();
    },
    [simulateExecution]
  );

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
    currentLogIndexRef.current = 0;
    simulatedLogRef.current = [];
  }, []);

  const handleAgentSetupUpdate = useCallback((newSetup) => {
    setAgentSetup(newSetup);
  }, []);

  const completeSetup = useCallback(() => {
    setSetupComplete(true);
  }, []);

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
            <Button onClick={simulateExecution} disabled={isExecuting}>
              {isExecuting
                ? "Executing..."
                : currentLogIndexRef.current === 0
                ? "Start Execution"
                : "Continue Execution"}
            </Button>
          </CardHeader>
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
                    requiresIntervention={requiresIntervention}
                    actionCounts={actionCounts}
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
