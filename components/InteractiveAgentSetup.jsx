import React, { useState, useCallback, useEffect } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plug, Unplug, Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { additionalAgents, supervisorInfo } from "@/constants/agents";

const Agent = ({
  agent,
  index,
  moveAgent,
  connectAgents,
  removeConnection,
  toggleConfig,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "AGENT",
    item: { id: agent.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "AGENT",
    hover: (item, monitor) => {
      if (item.index !== index) {
        moveAgent(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="mb-2"
    >
      <Card>
        <CardContent className="p-4">
          <div className="font-bold">
            [{agent.id}] {agent.name}
          </div>
          <div className="text-sm">{agent.role}</div>
          {agent.tag && (
            <div className="relative right-2 bottom-11 float-right text-xs mt-1 bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-200 px-2 py-1 rounded-sm">
              {agent.tag}
            </div>
          )}
          <div className="mt-2">
            <Button
              onClick={() => connectAgents(agent.id)}
              size="sm"
              className="mr-2 bg-emerald-600"
            >
              Connect <Plug className="ml-3 h-5 w-5" />
            </Button>
            {agent.id !== "S1" && (
              <Button
                onClick={() => removeConnection(agent.id)}
                size="sm"
                variant="destructive"
                className="mr-2"
              >
                Remove Connection <Unplug className="ml-3 h-5 w-5" />
              </Button>
            )}
            <Button
              onClick={() => toggleConfig(agent.id)}
              size="sm"
              variant="outline"
            >
              Configuration <Settings className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ConnectionVisualization = ({ agents, connections }) => {
  const [positions, setPositions] = useState({});

  useEffect(() => {
    const calculatePositions = () => {
      const newPositions = {};
      const centerX = 150;
      const centerY = 150;
      const radius = 120;

      agents.forEach((agent, index) => {
        const angle = (index / agents.length) * 2 * Math.PI;
        newPositions[agent.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      });

      setPositions(newPositions);
    };

    calculatePositions();
  }, [agents]);

  return (
    <svg width="300" height="300" viewBox="0 0 300 300">
      {/* Draw connections */}
      {connections.map((conn, index) => {
        const start = positions[conn.from];
        const end = positions[conn.to];
        if (start && end) {
          return (
            <line
              key={index}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#9CA3AF"
              strokeWidth="2"
            />
          );
        }
        return null;
      })}

      {/* Draw agent nodes */}
      {agents.map((agent) => {
        const position = positions[agent.id];
        if (position) {
          return (
            <g key={agent.id}>
              <circle
                cx={position.x}
                cy={position.y}
                r="23"
                fill={agent.id === "S1" ? "#189c41" : "#2e446a"}
              />
              <text
                x={position.x}
                y={position.y}
                textAnchor="middle"
                dy=".3em"
                fontSize="13"
                fill="#fff"
              >
                {agent.id}
              </text>
            </g>
          );
        }
        return null;
      })}
    </svg>
  );
};

const InteractiveAgentSetup = ({
  initialAgents,
  initialConnections,
  onUpdate,
  scenarioType,
}) => {
  const [agents, setAgents] = useState(initialAgents);
  const [connections, setConnections] = useState(initialConnections);
  const [connectingAgent, setConnectingAgent] = useState(null);
  const [showConfig, setShowConfig] = useState({});

  const addAgent = useCallback(
    (agentId) => {
      const newAgent = additionalAgents[scenarioType].find(
        (a) => a.id === agentId
      );
      if (newAgent) {
        setAgents((prevAgents) => [...prevAgents, { ...newAgent, url: "" }]);
      }
    },
    [scenarioType]
  );

  const toggleConfig = useCallback((agentId) => {
    setShowConfig((prev) => ({ ...prev, [agentId]: !prev[agentId] }));
  }, []);

  const updateAgentUrl = useCallback((agentId, url) => {
    setAgents((prevAgents) =>
      prevAgents.map((a) => (a.id === agentId ? { ...a, url } : a))
    );
  }, []);

  const moveAgent = useCallback(
    (dragIndex, hoverIndex) => {
      const dragAgent = agents[dragIndex];
      setAgents((prevAgents) => {
        const newAgents = [...prevAgents];
        newAgents.splice(dragIndex, 1);
        newAgents.splice(hoverIndex, 0, dragAgent);
        return newAgents;
      });
    },
    [agents]
  );

  const connectAgents = useCallback(
    (agentId) => {
      if (connectingAgent) {
        if (connectingAgent !== agentId) {
          setConnections((prevConnections) => [
            ...prevConnections,
            { from: connectingAgent, to: agentId },
          ]);
        }
        setConnectingAgent(null);
      } else {
        setConnectingAgent(agentId);
      }
    },
    [connectingAgent]
  );

  const removeConnection = useCallback((agentId) => {
    setConnections((prevConnections) =>
      prevConnections.filter(
        (conn) => !(conn.from === "S1" && conn.to === agentId)
      )
    );
  }, []);

  React.useEffect(() => {
    onUpdate({ agents, connections });
  }, [agents, connections, onUpdate]);
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <h3 className="font-bold mb-2">Agents</h3>
          {agents.map((agent, index) => (
            <div key={agent.id}>
              <Agent
                agent={agent}
                index={index}
                moveAgent={moveAgent}
                connectAgents={connectAgents}
                removeConnection={removeConnection}
                toggleConfig={toggleConfig}
              />
              {showConfig[agent.id] && (
                <>
                  <Input
                    type="text"
                    placeholder="Agent URL"
                    value={agent.url || ""}
                    onChange={(e) => updateAgentUrl(agent.id, e.target.value)}
                    className="mt-3 mb-5"
                  />
                </>
              )}
            </div>
          ))}

          <div className="mt-10">
            <h3 className="font-bold mb-2">Add Additional Agents</h3>
            <Select onValueChange={addAgent}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add additional Agents" />
              </SelectTrigger>
              <SelectContent>
                {additionalAgents[scenarioType].map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name} - {agent.tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-1/2 pl-4 border-l">
          <h3 className="font-bold mb-2">Connections</h3>
          <ConnectionVisualization agents={agents} connections={connections} />
          {connectingAgent && (
            <div className="text-sm mt-2">
              Select another agent to connect with{" "}
              {agents.find((a) => a.id === connectingAgent)?.name}
            </div>
          )}
          <hr className="mt-7" />
          <div className="mt-7">
            <h3 className="font-bold mb-2">Default Supervisor Protocols</h3>
            <ul className="list-disc list-inside">
              {supervisorInfo[scenarioType].protocols.map((protocol, index) => (
                <li key={index}>{protocol}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            {supervisorInfo[scenarioType].certificates.map((cert, index) => (
              <div key={index} className="flex items-center mb-2">
                <cert.icon className={`mr-2 ${cert.color}`} />
                <span className={`font-bold ${cert.color}`}>{cert.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default InteractiveAgentSetup;
