import { getAIProvider } from './ai-provider.js';
import { db } from '../db.js';
import { getWorkflowQueue, WorkflowJobData } from '../queue/queues.js';

export interface WorkflowNodeDefinition {
  id: string;
  type: string;
  title: string;
  config: Record<string, any>;
  next?: string;
  branches?: { label: string; next: string }[];
}

export interface WorkflowDefinition {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  triggerType: string;
  triggerConfig?: Record<string, any>;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
  nodes: WorkflowNodeDefinition[];
}

export interface ExecutionContext {
  executionId: string;
  organizationId: string;
  workflowId: string;
  contactId?: string;
  conversationId?: string;
  contactPhone: string;
  variables: Record<string, any>;
  lastMessageText?: string;
  logs: {
    nodeId: string;
    nodeTitle: string;
    type: string;
    status: 'SUCCESS' | 'FAILED' | 'WAITING' | 'SKIPPED';
    output?: any;
    durationMs: number;
    executedAt: string;
    error?: string;
  }[];
}

// In-memory registry of native workflows (loaded from DB/seed)
class NativeWorkflowRegistry {
  private workflows: WorkflowDefinition[] = [];
  private executions: ExecutionContext[] = [];

  constructor() {
    this.seedDefaultWorkflows();
  }

  private seedDefaultWorkflows() {
    // 1. Primary Lead Qualification & Routing Workflow
    const leadQualWorkflow: WorkflowDefinition = {
      id: 'wf_lead_qualification',
      organizationId: 'org_nexus_ecommerce',
      name: 'Smart WhatsApp Lead Qualification & Auto-Routing',
      description: 'Natively qualifies incoming WhatsApp inquiries, checks budget/intent via AI, and routes to priority agents or sends automated pricing.',
      triggerType: 'INCOMING_MESSAGE',
      triggerConfig: { keywords: ['pricing', 'demo', 'cost', 'help', 'hi', 'hello'] },
      status: 'ACTIVE',
      nodes: [
        {
          id: 'node-start',
          type: 'START',
          title: 'Incoming Customer WhatsApp Message',
          config: { trigger: 'Any incoming text message' },
          next: 'node-keyword-check',
        },
        {
          id: 'node-keyword-check',
          type: 'CONDITION',
          title: 'Check If Pricing or Demo Inquired',
          config: { keywords: ['pricing', 'price', 'demo', 'quote', 'cost'] },
          branches: [
            { label: 'Yes', next: 'node-ai-qualify' },
            { label: 'No', next: 'node-general-reply' },
          ],
        },
        {
          id: 'node-ai-qualify',
          type: 'AI_RESPONSE',
          title: 'AI Lead Qualification Engine',
          config: {
            task: 'QUALIFY_LEAD',
            prompt: 'Classify customer intent and calculate purchase probability.',
          },
          next: 'node-send-pricing-msg',
        },
        {
          id: 'node-send-pricing-msg',
          type: 'MESSAGE',
          title: 'Send WhatsApp Pricing & Brochure',
          config: {
            text: 'Hello! Thank you for your interest in ADSCALE ZEN. Here is our official product pricing guide: https://adscalezen.online/pricing\n\nOur Growth tier starts at $29/mo with unlimited WhatsApp automation.',
          },
          next: 'node-tag-lead',
        },
        {
          id: 'node-tag-lead',
          type: 'TAG_CONTACT',
          title: 'Tag Contact in CRM',
          config: { tag: 'HIGH_INTENT_LEAD' },
          next: 'node-delay-followup',
        },
        {
          id: 'node-delay-followup',
          type: 'WAIT',
          title: 'Scheduled Delay: 15 Minutes',
          config: { delayMinutes: 15, delaySeconds: 900 },
          next: 'node-assign-sales-rep',
        },
        {
          id: 'node-assign-sales-rep',
          type: 'ASSIGN_AGENT',
          title: 'Assign Priority Sales Representative',
          config: { role: 'AGENT', queue: 'Enterprise Inbound' },
          next: 'node-end',
        },
        {
          id: 'node-general-reply',
          type: 'MESSAGE',
          title: 'Send Interactive Welcome Greeting',
          config: {
            text: 'Welcome to ADSCALE ZEN! How can our automated team assist you today?\n1. Explore WhatsApp Automation\n2. Schedule Live Demo\n3. Connect with Live Support',
          },
          next: 'node-end',
        },
        {
          id: 'node-end',
          type: 'END',
          title: 'Automation Workflow Completed',
          config: { resolution: 'SUCCESS' },
        },
      ],
    };

    // 2. VIP Cart Abandonment & Re-engagement Workflow
    const cartRecoveryWorkflow: WorkflowDefinition = {
      id: 'wf_cart_recovery',
      organizationId: 'org_nexus_ecommerce',
      name: 'VIP Cart Recovery & Instant Checkout',
      description: 'Detects abandoned checkouts from webhook and dispatches automated WhatsApp reminder with special 10% coupon.',
      triggerType: 'WEBHOOK_RECEIVED',
      status: 'ACTIVE',
      nodes: [
        {
          id: 'node-1',
          type: 'START',
          title: 'Abandoned Checkout Webhook',
          config: { event: 'checkout.abandoned' },
          next: 'node-2',
        },
        {
          id: 'node-2',
          type: 'WAIT',
          title: 'Wait 30 Minutes',
          config: { delayMinutes: 30, delaySeconds: 1800 },
          next: 'node-3',
        },
        {
          id: 'node-3',
          type: 'MESSAGE',
          title: 'Send Discount Offer',
          config: {
            text: 'Hi there! We noticed you left items in your shopping bag. Complete your purchase within 2 hours with code ZEN10 for 10% off: https://adscalezen.online/checkout',
          },
          next: 'node-4',
        },
        {
          id: 'node-4',
          type: 'END',
          title: 'Recovery Notification Sent',
          config: { resolution: 'PROCESSED' },
        },
      ],
    };

    this.workflows.push(leadQualWorkflow, cartRecoveryWorkflow);
  }

  getWorkflows(orgId: string): WorkflowDefinition[] {
    return this.workflows.filter((w) => w.organizationId === orgId);
  }

  getWorkflowById(id: string): WorkflowDefinition | undefined {
    return this.workflows.find((w) => w.id === id);
  }

  createWorkflow(wf: WorkflowDefinition) {
    this.workflows.push(wf);
    return wf;
  }

  updateWorkflow(id: string, updates: Partial<WorkflowDefinition>) {
    const idx = this.workflows.findIndex((w) => w.id === id);
    if (idx !== -1) {
      this.workflows[idx] = { ...this.workflows[idx], ...updates };
      return this.workflows[idx];
    }
    return null;
  }

  deleteWorkflow(id: string) {
    this.workflows = this.workflows.filter((w) => w.id !== id);
  }

  recordExecution(exec: ExecutionContext) {
    this.executions.unshift(exec);
    if (this.executions.length > 500) {
      this.executions = this.executions.slice(0, 500);
    }
  }

  getExecutions(orgId: string): ExecutionContext[] {
    return this.executions.filter((e) => e.organizationId === orgId);
  }
}

export const workflowRegistry = new NativeWorkflowRegistry();

/**
 * NATIVE WORKFLOW EXECUTION ENGINE
 * Pure Node.js/TypeScript execution runner without external n8n.
 */
export async function executeWorkflowStep(params: {
  executionId: string;
  organizationId: string;
  workflowId: string;
  contactPhone: string;
  currentNodeKey: string;
  context: Record<string, any>;
}): Promise<{
  status: 'COMPLETED' | 'WAITING' | 'RUNNING' | 'FAILED';
  currentNodeKey: string;
  error?: string;
}> {
  const workflow = workflowRegistry.getWorkflowById(params.workflowId);
  if (!workflow) {
    return { status: 'FAILED', currentNodeKey: params.currentNodeKey, error: 'Workflow definition not found' };
  }

  let currentKey: string | undefined = params.currentNodeKey;
  let safetyLimit = 30; // Prevent infinite loops

  while (currentKey && safetyLimit-- > 0) {
    const node = workflow.nodes.find((n) => n.id === currentKey);
    if (!node) break;

    const startTime = Date.now();
    let nextNodeKey: string | undefined = node.next;
    let stepOutput: any = null;

    try {
      // 1. Evaluate Node Type
      switch (node.type) {
        case 'START':
          stepOutput = { message: 'Workflow triggered successfully' };
          break;

        case 'CONDITION': {
          const text = (params.context.lastMessageText || '').toLowerCase();
          const keywords: string[] = node.config.keywords || [];
          const matches = keywords.some((k) => text.includes(k.toLowerCase()));

          // Branch selection
          const targetBranch = node.branches?.find((b) =>
            matches ? b.label.toLowerCase() === 'yes' : b.label.toLowerCase() === 'no'
          );

          nextNodeKey = targetBranch?.next || node.branches?.[0]?.next || node.next;
          stepOutput = { conditionEvaluated: matches, selectedBranch: targetBranch?.label || 'default' };
          break;
        }

        case 'MESSAGE': {
          const textToSend = node.config.text || 'Message from ADSCALE ZEN';
          // In production: calls WhatsAppService. In demo: records in DB
          console.log(`📱 [Native Workflow] Sending message to ${params.contactPhone}: "${textToSend.substring(0, 60)}..."`);
          stepOutput = { sentTo: params.contactPhone, text: textToSend, messageStatus: 'SENT' };
          break;
        }

        case 'TAG_CONTACT': {
          const tag = node.config.tag || 'AUTOMATION_PROCESSED';
          const contact = db.contacts.find((c) => c.phone === params.contactPhone && c.organizationId === params.organizationId);
          if (contact && !contact.labels.includes(tag)) {
            contact.labels.push(tag);
          }
          stepOutput = { tagApplied: tag };
          break;
        }

        case 'ASSIGN_AGENT': {
          const queue = node.config.queue || 'General Inbound';
          stepOutput = { assignedQueue: queue, priority: 'HIGH' };
          break;
        }

        case 'AI_RESPONSE': {
          const ai = getAIProvider();
          const userMsg = params.context.lastMessageText || 'Hello, I want to learn more.';
          const aiReply = await ai.generateReply({
            systemPrompt: 'You are an intelligent assistant for ADSCALE ZEN WhatsApp Business platform.',
            userMessage: userMsg,
          });
          params.context.aiReply = aiReply;
          stepOutput = { aiGenerated: true, replyPreview: aiReply.substring(0, 100) };
          break;
        }

        case 'WAIT': {
          // Native Redis / BullMQ Delay scheduling (does NOT block server with setTimeout)
          const delaySeconds = node.config.delaySeconds || (node.config.delayMinutes ? node.config.delayMinutes * 60 : 60);
          const queue = getWorkflowQueue();

          if (queue && node.next) {
            const nextJobData: WorkflowJobData = {
              executionId: params.executionId,
              organizationId: params.organizationId,
              workflowId: params.workflowId,
              contactPhone: params.contactPhone,
              currentNodeKey: node.next,
              context: params.context,
              stepCount: (params.context.stepCount || 0) + 1,
            };

            await queue.add('resume-workflow-step', nextJobData, {
              delay: delaySeconds * 1000,
            });

            console.log(`⏱️ [BullMQ Native Engine] Scheduled delayed continuation in Redis for ${delaySeconds}s (Job resume at ${new Date(Date.now() + delaySeconds * 1000).toISOString()})`);
            return { status: 'WAITING', currentNodeKey: currentKey };
          }

          // If Redis not active in preview, step completes synchronously
          stepOutput = { delayedSeconds: delaySeconds, fallbackMode: 'simulated_in_memory' };
          break;
        }

        case 'END':
          stepOutput = { completed: true, timestamp: new Date().toISOString() };
          return { status: 'COMPLETED', currentNodeKey: currentKey };

        default:
          stepOutput = { processed: true };
          break;
      }

      // Record step log
      const durationMs = Date.now() - startTime;
      console.log(`⚡ [Native Workflow Engine] Step completed: [${node.type}] "${node.title}" in ${durationMs}ms`);

      currentKey = nextNodeKey;
    } catch (err: any) {
      console.error(`❌ [Native Workflow Engine] Error at node ${node.id}:`, err);
      return { status: 'FAILED', currentNodeKey: currentKey || 'error', error: err.message };
    }
  }

  return { status: 'COMPLETED', currentNodeKey: currentKey || 'end' };
}

/**
 * Triggers matching native workflows when an incoming WhatsApp message is ingested.
 */
export async function triggerIncomingMessageWorkflows(params: {
  organizationId: string;
  senderPhone: string;
  messageText: string;
  rawPayload?: any;
}) {
  const activeWorkflows = workflowRegistry.getWorkflows(params.organizationId).filter((w) => w.status === 'ACTIVE');

  for (const wf of activeWorkflows) {
    if (wf.triggerType === 'INCOMING_MESSAGE') {
      const executionId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      console.log(`🚀 [Native Automation Engine] Triggering workflow "${wf.name}" (${wf.id}) for ${params.senderPhone}`);

      const startNode = wf.nodes.find((n) => n.type === 'START') || wf.nodes[0];
      if (!startNode) continue;

      const queue = getWorkflowQueue();
      if (queue) {
        // Enqueue to BullMQ worker queue for asynchronous background processing
        await queue.add('execute-workflow', {
          executionId,
          organizationId: params.organizationId,
          workflowId: wf.id,
          contactPhone: params.senderPhone,
          currentNodeKey: startNode.id,
          context: {
            lastMessageText: params.messageText,
            source: 'WHATSAPP_WEBHOOK_INGEST',
            triggeredAt: new Date().toISOString(),
          },
          stepCount: 1,
        });
      } else {
        // Direct in-process execution fallback
        await executeWorkflowStep({
          executionId,
          organizationId: params.organizationId,
          workflowId: wf.id,
          contactPhone: params.senderPhone,
          currentNodeKey: startNode.id,
          context: {
            lastMessageText: params.messageText,
            source: 'WHATSAPP_WEBHOOK_INGEST',
            triggeredAt: new Date().toISOString(),
          },
        });
      }
    }
  }
}
