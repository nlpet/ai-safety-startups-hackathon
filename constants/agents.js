import { Github, FileText, Calendar, Shield, Award } from "lucide-react";

export const scenarioData = [
  {
    id: "github",
    name: "GitHub Issue Resolution",
    description:
      "Collaborate on resolving complex GitHub issues, involving code review, bug fixing, and quality assurance.",
    icon: Github,
    defaultAgents: [
      {
        id: "D1",
        name: "Developer",
        role: "Code Implementation",
        tag: "Core Team",
      },
      {
        id: "QA1",
        name: "QA Engineer",
        role: "Quality Assurance",
        tag: "Core Team",
      },
      {
        id: "T1",
        name: "Tester",
        role: "Test Case Execution",
        tag: "Core Team",
      },
      {
        id: "S1",
        name: "Supervisor",
        role: "Oversight and Coordination",
        tag: "Team Lead",
      },
    ],
  },
  {
    id: "research",
    name: "Research Paper Assistance",
    description:
      "Collaborate on academic research, including literature review, data analysis, and paper writing.",
    icon: FileText,
    defaultAgents: [
      {
        id: "R1",
        name: "Researcher",
        role: "Primary Investigator",
        tag: "Core Team",
      },
      {
        id: "P1",
        name: "Proof Reader",
        role: "Language and Style Check",
        tag: "Core Team",
      },
      { id: "RV1", name: "Reviewer", role: "Peer Review", tag: "Core Team" },
      {
        id: "S1",
        name: "Supervisor",
        role: "Research Oversight",
        tag: "Team Lead",
      },
    ],
  },
  {
    id: "event",
    name: "Event Planning",
    description:
      "Collaborate on planning and organizing events, from venue selection to guest management.",
    icon: Calendar,
    defaultAgents: [
      {
        id: "P1",
        name: "Planner",
        role: "Overall Event Coordination",
        tag: "Core Team",
      },
      {
        id: "L1",
        name: "Logistics",
        role: "Venue and Equipment",
        tag: "Core Team",
      },
      {
        id: "G1",
        name: "Guest Manager",
        role: "Invitations and RSVP",
        tag: "Core Team",
      },
      {
        id: "S1",
        name: "Supervisor",
        role: "Event Oversight",
        tag: "Team Lead",
      },
    ],
  },
];

export const simulationLogs = {
  github: [
    {
      timestamp: "00:00",
      agentName: "Supervisor",
      action: "Initiating GitHub issue resolution process",
      risk: "low",
    },
    {
      timestamp: "00:05",
      agentName: "Developer",
      action: 'Analyzing issue #1234: "App crashes on startup"',
      risk: "low",
    },
    {
      timestamp: "00:10",
      agentName: "QA Engineer",
      action: "Reproducing the issue on multiple devices",
      risk: "medium",
      supervisorMessage:
        "Ensured QA Engineer follows the established testing protocol. Advised on prioritizing critical device configurations.",
    },
    {
      timestamp: "00:15",
      agentName: "Tester",
      action: "Creating test cases for the startup process",
      risk: "low",
    },
    {
      timestamp: "00:20",
      agentName: "Developer",
      action: "Identifying potential cause in initialization code",
      risk: "medium",
      supervisorMessage:
        "Guided Developer to adhere to secure coding practices. Recommended additional code review for the identified section.",
    },
    {
      timestamp: "00:25",
      agentName: "Supervisor",
      action: "Reviewing Developer's findings",
      risk: "low",
    },
    {
      timestamp: "00:30",
      agentName: "Developer",
      action: "Encountered a critical security vulnerability",
      risk: "high",
      requiresHumanIntervention: true,
      interventionOptions: [
        {
          value: "patch",
          label: "Apply emergency patch",
          description: "Quickly patch the vulnerability with a hotfix.",
          link: "https://example.com/security-best-practices",
        },
        {
          value: "revert",
          label: "Revert to previous version",
          description: "Roll back to the last known secure version.",
          link: "https://example.com/version-control-guide",
        },
        {
          value: "analyze",
          label: "Conduct thorough analysis",
          description:
            "Pause deployment and analyze the vulnerability in depth.",
          link: "https://example.com/security-analysis-tools",
        },
      ],
    },
    {
      timestamp: "00:35",
      agentName: "QA Engineer",
      action: "Verifying fix on test devices",
      risk: "low",
    },
    {
      timestamp: "00:40",
      agentName: "Tester",
      action: "Running regression tests",
      risk: "low",
    },
    {
      timestamp: "00:45",
      agentName: "Supervisor",
      action: "Reviewing test results and approving fix",
      risk: "low",
    },
    {
      timestamp: "00:50",
      agentName: "Developer",
      action: "Pushing fix to main branch",
      risk: "low",
    },
    {
      timestamp: "00:55",
      agentName: "Supervisor",
      action: "Closing GitHub issue #1234",
      risk: "low",
    },
  ],
  research: [
    {
      timestamp: "00:00",
      agentName: "Supervisor",
      action: "Initiating research paper assistance process",
      risk: "low",
    },
    {
      timestamp: "00:05",
      agentName: "Researcher",
      action: "Defining research question on climate change impact",
      risk: "low",
    },
    {
      timestamp: "00:10",
      agentName: "Researcher",
      action: "Conducting literature review",
      risk: "medium",
      supervisorMessage:
        "Provided guidance on ensuring comprehensive coverage of relevant literature. Emphasized the importance of critically evaluating sources.",
    },
    {
      timestamp: "00:15",
      agentName: "Proof Reader",
      action: "Reviewing initial research proposal",
      risk: "low",
    },
    {
      timestamp: "00:20",
      agentName: "Researcher",
      action: "Analyzing climate data from multiple sources",
      risk: "medium",
      supervisorMessage:
        "Advised on data integrity checks and cross-validation methods. Ensured adherence to ethical data handling practices.",
    },
    {
      timestamp: "00:25",
      agentName: "Supervisor",
      action: "Checking data analysis methodology",
      risk: "low",
    },
    {
      timestamp: "00:30",
      agentName: "Researcher",
      action: "Writing initial draft of findings",
      risk: "medium",
      supervisorMessage:
        "Guided on maintaining objectivity in reporting results. Recommended clear documentation of assumptions and limitations.",
    },
    {
      timestamp: "00:35",
      agentName: "Researcher",
      action: "Discovered conflicting data in primary sources",
      risk: "high",
      requiresHumanIntervention: true,
      interventionOptions: [
        {
          value: "additional-sources",
          label: "Seek additional sources",
          description: "Look for more primary sources to resolve the conflict.",
          link: "https://example.com/research-databases",
        },
        {
          value: "expert-consult",
          label: "Consult field expert",
          description:
            "Reach out to a known expert in the field for clarification.",
          link: "https://example.com/expert-directory",
        },
        {
          value: "acknowledge-limitations",
          label: "Acknowledge limitations in paper",
          description:
            "Continue with the research but acknowledge the conflicting data in the paper.",
          link: "https://example.com/research-writing-best-practices",
        },
      ],
    },
    {
      timestamp: "00:35",
      agentName: "Proof Reader",
      action: "Editing draft for clarity and style",
      risk: "low",
    },
    {
      timestamp: "00:40",
      agentName: "Reviewer",
      action: "Conducting peer review of the draft",
      supervisorMessage:
        "Solicited help from third-party peer review agents to ensure unbiased review process.",
      risk: "medium",
    },
    {
      timestamp: "00:45",
      agentName: "Researcher",
      action: "Addressing reviewer comments",
      risk: "low",
    },
    {
      timestamp: "00:50",
      agentName: "Supervisor",
      action: "Final review of the paper",
      risk: "low",
    },
    {
      timestamp: "00:55",
      agentName: "Researcher",
      action: "Submitting paper to journal",
      risk: "low",
    },
  ],
  event: [
    {
      timestamp: "00:00",
      agentName: "Supervisor",
      action: "Initiating event planning process for tech conference",
      risk: "low",
    },
    {
      timestamp: "00:05",
      agentName: "Planner",
      action: "Defining event scope and objectives",
      risk: "low",
    },
    {
      timestamp: "00:10",
      agentName: "Logistics",
      action: "Researching potential venues",
      risk: "medium",
      supervisorMessage:
        "Provided guidelines on venue requirements, including accessibility and tech capabilities. Advised on budget considerations.",
    },
    {
      timestamp: "00:15",
      agentName: "Guest Manager",
      action: "Creating initial guest list",
      risk: "low",
    },
    {
      timestamp: "00:20",
      agentName: "Planner",
      action: "Developing event schedule",
      risk: "medium",
      supervisorMessage:
        "Ensured balanced schedule with adequate breaks. Recommended contingency time slots for potential delays.",
    },
    {
      timestamp: "00:25",
      agentName: "Logistics",
      action: "Finalizing venue selection",
      risk: "high",
      requiresHumanIntervention: true,
      interventionOptions: [
        {
          value: "city-convention-center",
          label: "City Convention Center",
          description: "Large capacity, central location, higher cost.",
          link: "https://example.com/convention-center",
        },
        {
          value: "tech-hub-auditorium",
          label: "Tech Hub Auditorium",
          description: "Modern facilities, tech-focused, limited capacity.",
          link: "https://example.com/tech-hub",
        },
        {
          value: "riverside-conference-hall",
          label: "Riverside Conference Hall",
          description: "Scenic location, ample parking, slightly remote.",
          link: "https://example.com/riverside-hall",
        },
      ],
    },
    {
      timestamp: "00:30",
      agentName: "Guest Manager",
      action: "Sending out invitations",
      risk: "low",
    },
    {
      timestamp: "00:35",
      agentName: "Planner",
      action: "Coordinating with keynote speakers",
      supervisorMessage:
        "Ensured good communication protocols when contacting keynote speakers.",
      risk: "medium",
    },
    {
      timestamp: "00:40",
      agentName: "Logistics",
      action: "Arranging catering services",
      risk: "low",
    },
    {
      timestamp: "00:45",
      agentName: "Guest Manager",
      action: "Managing RSVPs and inquiries",
      risk: "low",
    },
    {
      timestamp: "00:50",
      agentName: "Planner",
      action: "Finalizing event timeline",
      supervisorMessage:
        "Ensured all stakeholders are notified and all conflicts are resolved in a satisfactory manner.",
      risk: "medium",
    },
    {
      timestamp: "00:55",
      agentName: "Supervisor",
      action: "Reviewing overall event plan",
      risk: "low",
    },
  ],
};

export const additionalAgents = {
  github: [
    {
      id: "CA1",
      name: "Code Analyzer",
      role: "Static Code Analysis",
      tag: "API: SonarQube",
    },
    {
      id: "SI1",
      name: "Security Inspector",
      role: "Security Vulnerability Check",
      tag: "API: Snyk",
    },
    {
      id: "PM1",
      name: "Project Manager",
      role: "Project Coordination",
      tag: "Capability: Task Tracking",
    },
  ],
  research: [
    {
      id: "DA1",
      name: "Data Analyst",
      role: "Statistical Analysis",
      tag: "API: R Studio",
    },
    {
      id: "LR1",
      name: "Literature Reviewer",
      role: "Comprehensive Literature Search",
      tag: "API: Google Scholar",
    },
    {
      id: "VD1",
      name: "Visualization Designer",
      role: "Data Visualization",
      tag: "API: Tableau",
    },
  ],
  event: [
    {
      id: "BM1",
      name: "Budget Manager",
      role: "Financial Planning",
      tag: "API: QuickBooks",
    },
    {
      id: "MC1",
      name: "Marketing Coordinator",
      role: "Event Promotion",
      tag: "API: Mailchimp",
    },
    {
      id: "TS1",
      name: "Technical Support",
      role: "AV and IT Setup",
      tag: "Capability: Tech Troubleshooting",
    },
  ],
};

export const supervisorInfo = {
  github: {
    protocols: [
      "Code Review Standards",
      "Continuous Integration",
      "Security Compliance",
    ],
    certificates: [
      { name: "Security Compliance", icon: Shield, color: "text-green-500" },
      { name: "Code Quality Assurance", icon: Award, color: "text-blue-500" },
    ],
  },
  research: {
    protocols: [
      "Ethical Research Standards",
      "Peer Review Process",
      "Data Integrity",
    ],
    certificates: [
      { name: "Ethical Research", icon: Shield, color: "text-green-500" },
      { name: "Academic Integrity", icon: Award, color: "text-purple-500" },
    ],
  },
  event: {
    protocols: [
      "Event Safety Standards",
      "Budget Management",
      "Vendor Verification",
    ],
    certificates: [
      { name: "Event Safety", icon: Shield, color: "text-green-500" },
      {
        name: "Certified Event Planner",
        icon: Award,
        color: "text-yellow-500",
      },
    ],
  },
};
