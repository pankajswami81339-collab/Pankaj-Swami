export interface WorkflowNodeDefinition {
  id: string;
  type: string; // START, MESSAGE, BUTTON, QUESTION, CONDITION, WAIT, TAG_CONTACT, ASSIGN_AGENT, AI_RESPONSE, WEBHOOK, END
  title: string;
  name?: string;
  config: Record<string, any>;
  positionX?: number;
  positionY?: number;
  next?: string;
  branches?: { label: string; condition?: string; next: string }[];
}

export interface WorkflowEdgeDefinition {
  id: string;
  workflowId: string;
  sourceNodeId: string;
  targetNodeId: string;
  condition?: string; // e.g. "true", "false", "default"
  label?: string;
}

export interface WorkflowDefinition {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
  triggerType: string;
  version?: number;
  nodes: WorkflowNodeDefinition[];
  edges?: WorkflowEdgeDefinition[];
  variables?: { key: string; dataType: string; defaultValue?: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExecutionLogEntry {
  stepNumber: number;
  nodeId: string;
  nodeTitle: string;
  nodeType: string;
  status: 'SUCCESS' | 'FAILED' | 'WAITING' | 'SKIPPED';
  durationMs: number;
  input?: any;
  output?: any;
  error?: string;
  executedAt: string;
  summaryText: string;
}

export interface WorkflowExecutionContext {
  executionId: string;
  organizationId: string;
  workflowId: string;
  contactId?: string;
  conversationId?: string;
  contactPhone: string;
  contactName?: string;
  contactEmail?: string;
  variables: Record<string, any>;
  lastMessageText?: string;
  channel?: 'whatsapp' | 'facebook' | 'instagram' | 'webhook' | 'manual_test';
  isTestMode?: boolean;
  status: 'PENDING' | 'RUNNING' | 'WAITING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  currentNodeId?: string;
  logs: ExecutionLogEntry[];
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export interface NodeExecutionResult {
  status: 'SUCCESS' | 'FAILED' | 'WAITING';
  nextNodeId?: string;
  updatedContext?: Partial<WorkflowExecutionContext>;
  output?: any;
  summaryText?: string;
  error?: string;
}

/**
 * Common interface for all Node Executors in ADSCALE ZEN Native Engine.
 */
export interface NodeExecutor {
  nodeType: string;
  execute(
    node: WorkflowNodeDefinition,
    context: WorkflowExecutionContext
  ): Promise<NodeExecutionResult>;
}
