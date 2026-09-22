import {
  WorkflowDefinition,
  WorkflowExecutionContext,
  NodeExecutor,
  ExecutionLogEntry,
} from './types.js';
import {
  TriggerExecutor,
  SendMessageExecutor,
  SendMediaExecutor,
  ButtonExecutor,
  QuestionExecutor,
  ConditionExecutor,
  DelayExecutor,
  TagExecutor,
  AssignAgentExecutor,
  AIExecutor,
  WebhookExecutor,
  EndExecutor,
} from './executors/index.js';
import { getWorkflowQueue } from '../../queue/queues.js';
import { NormalizedEvent } from './normalizer.js';

class NativeWorkflowEngine {
  private executors: Map<string, NodeExecutor> = new Map();
  private workflows: WorkflowDefinition[] = [];
  private executions: WorkflowExecutionContext[] = [];

  constructor() {
    this.registerExecutor(new TriggerExecutor());
    this.registerExecutor(new SendMessageExecutor());
    this.registerExecutor(new SendMediaExecutor());
    this.registerExecutor(new ButtonExecutor());
    this.registerExecutor(new QuestionExecutor());
    this.registerExecutor(new ConditionExecutor());
    this.registerExecutor(new DelayExecutor());
    this.registerExecutor(new TagExecutor());
    this.registerExecutor(new AssignAgentExecutor());
    this.registerExecutor(new AIExecutor());
    this.registerExecutor(new WebhookExecutor());
    this.registerExecutor(new EndExecutor());

    this.seedDefaultWorkflows();
  }

  public registerExecutor(executor: NodeExecutor) {
    this.executors.set(executor.nodeType.toUpperCase(), executor);
  }

  private seedDefaultWorkflows() {
    const leadWorkflow: WorkflowDefinition = {
      id: 'wf_lead_qualification',
      organizationId: 'org_nexus_ecommerce',
      name: 'Smart WhatsApp Lead Qualification & Auto-Routing',
      description: 'Natively qualifies incoming WhatsApp inquiries, checks budget/intent via AI, and routes to priority agents or sends automated pricing.',
      triggerType: 'INCOMING_MESSAGE',
      status: 'ACTIVE',
      version: 1,
      variables: [
        { key: 'customer_budget', dataType: 'STRING', defaultValue: '10000' },
        { key: 'ai_intent', dataType: 'STRING' },
        { key: 'ai_score', dataType: 'NUMBER' },
      ],
      nodes: [
        {
          id: 'node-start',
          type: 'START',
          title: 'Incoming WhatsApp Message',
          config: { triggerType: 'INCOMING_MESSAGE' },
          positionX: 100,
          positionY: 80,
          next: 'node-condition',
        },
        {
          id: 'node-condition',
          type: 'CONDITION',
          title: 'Condition: Check Pricing or Demo Keyword',
          config: {
            field: 'lastMessageText',
            operator: 'contains',
            keywords: ['pricing', 'price', 'demo', 'cost', 'quote', 'plan'],
          },
          positionX: 100,
          positionY: 220,
          branches: [
            { label: 'Yes (Match)', next: 'node-ai-classifier' },
            { label: 'No (Default)', next: 'node-general-reply' },
          ],
        },
        {
          id: 'node-ai-classifier',
          type: 'AI_RESPONSE',
          title: 'AI Smart Intent Classifier',
          config: {
            task: 'QUALIFY_LEAD',
            prompt: 'Classify customer intent and calculate purchase probability.',
          },
          positionX: -80,
          positionY: 370,
          next: 'node-send-pricing',
        },
        {
          id: 'node-send-pricing',
          type: 'MESSAGE',
          title: 'Send WhatsApp Pricing & Brochure',
          config: {
            text: 'Hello {{contact.name}}! Thank you for inquiring about ADSCALE ZEN.\n\nOur Growth tier is $29/mo with unlimited native WhatsApp automation.\nHere is our interactive brochure: https://adscalezen.online/brochure.pdf',
          },
          positionX: -80,
          positionY: 510,
          next: 'node-tag-lead',
        },
        {
          id: 'node-tag-lead',
          type: 'TAG_CONTACT',
          title: 'Tag Contact: High Intent Lead',
          config: {
            tag: 'HIGH_INTENT_LEAD',
            action: 'ADD',
          },
          positionX: -80,
          positionY: 650,
          next: 'node-delay',
        },
        {
          id: 'node-delay',
          type: 'WAIT',
          title: 'Delay: Wait 15 Minutes',
          config: {
            duration: 15,
            unit: 'minutes',
          },
          positionX: -80,
          positionY: 790,
          next: 'node-assign-sales',
        },
        {
          id: 'node-assign-sales',
          type: 'ASSIGN_AGENT',
          title: 'Assign Priority Sales Representative',
          config: {
            mode: 'ROUND_ROBIN',
            team: 'Enterprise Sales Team',
          },
          positionX: -80,
          positionY: 930,
          next: 'node-end',
        },
        {
          id: 'node-general-reply',
          type: 'MESSAGE',
          title: 'Send Interactive Welcome Options',
          config: {
            text: 'Welcome to ADSCALE ZEN, {{contact.name}}!\nHow can we help your business accelerate today?\nReply with "pricing", "demo", or "support".',
          },
          positionX: 300,
          positionY: 370,
          next: 'node-end',
        },
        {
          id: 'node-end',
          type: 'END',
          title: 'Workflow Finished',
          config: { resolution: 'SUCCESS' },
          positionX: 100,
          positionY: 1070,
        },
      ],
    };

    this.workflows.push(leadWorkflow);
  }

  // Workflows CRUD
  public getWorkflows(organizationId: string): WorkflowDefinition[] {
    return this.workflows.filter((w) => w.organizationId === organizationId);
  }

  public getWorkflowById(id: string): WorkflowDefinition | undefined {
    return this.workflows.find((w) => w.id === id);
  }

  public saveWorkflow(wf: WorkflowDefinition): WorkflowDefinition {
    const idx = this.workflows.findIndex((w) => w.id === wf.id);
    if (idx !== -1) {
      this.workflows[idx] = { ...this.workflows[idx], ...wf, updatedAt: new Date().toISOString() };
      return this.workflows[idx];
    } else {
      const created = {
        ...wf,
        id: wf.id || `wf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.workflows.push(created);
      return created;
    }
  }

  public updateWorkflowStatus(id: string, status: 'ACTIVE' | 'DRAFT' | 'PAUSED'): boolean {
    const wf = this.getWorkflowById(id);
    if (!wf) return false;
    wf.status = status;
    wf.updatedAt = new Date().toISOString();
    return true;
  }

  public deleteWorkflow(id: string): boolean {
    const initialLen = this.workflows.length;
    this.workflows = this.workflows.filter((w) => w.id !== id);
    return this.workflows.length < initialLen;
  }

  public getExecutions(organizationId: string): WorkflowExecutionContext[] {
    return this.executions.filter((e) => e.organizationId === organizationId);
  }

  /**
   * Run workflow step by step (Live or Test Mode)
   */
  public async executeWorkflow(context: WorkflowExecutionContext): Promise<WorkflowExecutionContext> {
    const wf = this.getWorkflowById(context.workflowId);
    if (!wf) {
      context.status = 'FAILED';
      context.error = `Workflow ${context.workflowId} not found`;
      return context;
    }

    context.status = 'RUNNING';
    let currentNodeId: string | undefined = context.currentNodeId;

    if (!currentNodeId) {
      const startNode = wf.nodes.find((n) => n.type === 'START') || wf.nodes[0];
      currentNodeId = startNode?.id;
    }

    let stepCounter = context.logs.length;
    let safetyCounter = 35; // loop guard

    while (currentNodeId && safetyCounter-- > 0) {
      const node = wf.nodes.find((n) => n.id === currentNodeId);
      if (!node) break;

      const executor = this.executors.get(node.type.toUpperCase());
      const startTime = Date.now();
      stepCounter++;

      if (!executor) {
        context.logs.push({
          stepNumber: stepCounter,
          nodeId: node.id,
          nodeTitle: node.title,
          nodeType: node.type,
          status: 'FAILED',
          durationMs: 0,
          error: `No executor found for node type ${node.type}`,
          executedAt: new Date().toISOString(),
          summaryText: `Node #${stepCounter} — ${node.title} — FAILED (Unsupported type)`,
        });
        context.status = 'FAILED';
        break;
      }

      try {
        const result = await executor.execute(node, context);
        const durationMs = Date.now() - startTime;

        if (result.updatedContext?.variables) {
          context.variables = { ...context.variables, ...result.updatedContext.variables };
        }

        const logEntry: ExecutionLogEntry = {
          stepNumber: stepCounter,
          nodeId: node.id,
          nodeTitle: node.title,
          nodeType: node.type,
          status: result.status,
          durationMs,
          input: {
            messageText: context.lastMessageText,
            variables: { ...context.variables },
          },
          output: result.output,
          executedAt: new Date().toISOString(),
          summaryText: `Node #${stepCounter} — ${node.title} — ${result.status}`,
        };

        context.logs.push(logEntry);

        if (result.status === 'WAITING') {
          context.status = 'WAITING';
          context.currentNodeId = result.nextNodeId;
          break;
        }

        if (result.status === 'FAILED') {
          context.status = 'FAILED';
          context.error = result.error || 'Execution failed at node';
          break;
        }

        currentNodeId = result.nextNodeId;
      } catch (err: any) {
        const durationMs = Date.now() - startTime;
        context.logs.push({
          stepNumber: stepCounter,
          nodeId: node.id,
          nodeTitle: node.title,
          nodeType: node.type,
          status: 'FAILED',
          durationMs,
          error: err.message,
          executedAt: new Date().toISOString(),
          summaryText: `Node #${stepCounter} — ${node.title} — FAILED (${err.message})`,
        });
        context.status = 'FAILED';
        context.error = err.message;
        break;
      }
    }

    if (context.status !== 'WAITING' && context.status !== 'FAILED') {
      context.status = 'COMPLETED';
    }

    context.completedAt = new Date().toISOString();

    // Cache recent executions for audit
    this.executions.unshift(context);
    if (this.executions.length > 500) {
      this.executions = this.executions.slice(0, 500);
    }

    return context;
  }

  /**
   * Dispatches incoming normalized event to all matching active workflows
   */
  public async handleNormalizedEvent(event: NormalizedEvent): Promise<WorkflowExecutionContext[]> {
    const activeWorkflows = this.getWorkflows(event.organizationId).filter((w) => w.status === 'ACTIVE');
    const results: WorkflowExecutionContext[] = [];

    for (const wf of activeWorkflows) {
      const startNode = wf.nodes.find((n) => n.type === 'START') || wf.nodes[0];
      if (!startNode) continue;

      const triggerConfig = startNode.config || {};
      const expectedTrigger = triggerConfig.triggerType || wf.triggerType || 'INCOMING_MESSAGE';

      // Match trigger conditions
      if (expectedTrigger === 'INCOMING_MESSAGE' || expectedTrigger === event.eventType) {
        const context: WorkflowExecutionContext = {
          executionId: `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          organizationId: event.organizationId,
          workflowId: wf.id,
          contactId: event.contactId,
          conversationId: event.conversationId,
          contactPhone: event.contactPhone,
          contactName: event.contactName || 'Valued Customer',
          contactEmail: event.contactEmail,
          channel: event.channel,
          lastMessageText: event.messageText,
          variables: {
            inbound_text: event.messageText,
            channel: event.channel,
            provider: event.provider,
          },
          status: 'PENDING',
          logs: [],
          startedAt: new Date().toISOString(),
        };

        const queue = getWorkflowQueue();
        if (queue) {
          // Asynchronously enqueue to BullMQ
          await queue.add('execute-workflow', {
            executionId: context.executionId,
            organizationId: context.organizationId,
            workflowId: context.workflowId,
            contactPhone: context.contactPhone,
            currentNodeKey: startNode.id,
            context,
            stepCount: 1,
          });
          results.push(context);
        } else {
          // Process immediately
          const executed = await this.executeWorkflow(context);
          results.push(executed);
        }
      }
    }

    return results;
  }
}

export const nativeWorkflowEngine = new NativeWorkflowEngine();
