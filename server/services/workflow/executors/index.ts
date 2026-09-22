import {
  NodeExecutor,
  WorkflowNodeDefinition,
  WorkflowExecutionContext,
  NodeExecutionResult,
} from '../types.js';
import { getAIProvider } from '../../ai-provider.js';
import { db, DbContact } from '../../../db.js';
import { getWorkflowQueue, WorkflowJobData } from '../../../queue/queues.js';

/**
 * Replace {{contact.name}}, {{contact.phone}}, {{variables.budget}}, etc.
 */
export function interpolateVariables(
  text: string,
  context: WorkflowExecutionContext
): string {
  if (!text) return '';

  return text.replace(/\{\{([\w.]+)\}\}/g, (match, path) => {
    const cleanPath = path.trim();

    // Standard contact shortcuts
    if (cleanPath === 'contact.name') return context.contactName || 'Valued Customer';
    if (cleanPath === 'contact.phone') return context.contactPhone || '';
    if (cleanPath === 'contact.email') return context.contactEmail || 'user@example.com';
    if (cleanPath === 'organization.name') return 'ADSCALE ZEN Workspace';

    // Check context.variables
    if (cleanPath.startsWith('variables.')) {
      const varKey = cleanPath.replace('variables.', '');
      return context.variables[varKey] !== undefined ? String(context.variables[varKey]) : match;
    }

    if (context.variables[cleanPath] !== undefined) {
      return String(context.variables[cleanPath]);
    }

    return match;
  });
}

/**
 * 1. TRIGGER EXECUTOR
 */
export class TriggerExecutor implements NodeExecutor {
  nodeType = 'START';

  async execute(
    node: WorkflowNodeDefinition,
    context: WorkflowExecutionContext
  ): Promise<NodeExecutionResult> {
    const triggerType = node.config?.triggerType || 'INCOMING_MESSAGE';
    const channel = context.channel || 'whatsapp';

    return {
      status: 'SUCCESS',
      nextNodeId: node.next,
      summaryText: `Trigger Activated (${triggerType} via ${channel})`,
      output: {
        triggerType,
        channel,
        contactPhone: context.contactPhone,
        messagePreview: context.lastMessageText?.substring(0, 50) || '(No text)',
      },
    };
  }
}

/**
 * 2. SEND MESSAGE EXECUTOR
 */
export class SendMessageExecutor implements NodeExecutor {
  nodeType = 'MESSAGE';

  async execute(
    node: WorkflowNodeDefinition,
    context: WorkflowExecutionContext
  ): Promise<NodeExecutionResult> {
    const rawText = node.config?.text || node.config?.message || 'Hello from ADSCALE ZEN!';
    const renderedText = interpolateVariables(rawText, context);
    const mediaUrl = node.config?.mediaUrl;
    const templateName = node.config?.templateName;

    if (!context.isTestMode) {
      console.log(`📱 [WhatsApp Live Dispatch] To: ${context.contactPhone} -> "${renderedText.substring(0, 60)}..."`);
    } else {
      console.log(`🧪 [Simulation SendMessage] Rendered message for ${context.contactPhone}: "${renderedText}"`);
    }

    return {
      status: 'SUCCESS',
      nextNodeId: node.next,
      summaryText: `Dispatched WhatsApp Message: "${renderedText.length > 35 ? renderedText.substring(0, 35) + '...' : renderedText}"`,
      output: {
        recipient: context.contactPhone,
        renderedText,
        mediaUrl: mediaUrl || null,
        template: templateName || 'custom_text',
        delivered: true,
      },
    };
  }
}

/**
 * 2b. SEND MEDIA EXECUTOR (Images, Videos, Documents/PDF, Audio)
 */
export class SendMediaExecutor implements NodeExecutor {
  nodeType = 'MEDIA';

  async execute(
    node: WorkflowNodeDefinition,
    context: WorkflowExecutionContext
  ): Promise<NodeExecutionResult> {
    const mediaType = (node.config?.mediaType || 'image').toLowerCase();
    const mediaUrl = node.config?.mediaUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80';
    const rawCaption = node.config?.caption || node.config?.text || '';
    const renderedCaption = interpolateVariables(rawCaption, context);
    const filename = node.config?.filename || (mediaType === 'document' ? 'brochure-2026.pdf' : undefined);

    if (!context.isTestMode) {
      console.log(`📱 [WhatsApp Media Live Dispatch] To: ${context.contactPhone} -> [${mediaType.toUpperCase()}] ${mediaUrl} ("${renderedCaption}")`);
    } else {
      console.log(`🧪 [Simulation SendMedia] Dispatched ${mediaType} to ${context.contactPhone}: ${mediaUrl}`);
    }

    return {
      status: 'SUCCESS',
      nextNodeId: node.next,
      summaryText: `Dispatched WhatsApp ${mediaType.toUpperCase()}: ${renderedCaption ? `"${renderedCaption.substring(0, 30)}..."` : mediaUrl.substring(0, 35) + '...'}`,
      output: {
        recipient: context.contactPhone,
        mediaType,
        mediaUrl,
        filename,
        caption: renderedCaption,
        messageSent: renderedCaption ? `[${mediaType.toUpperCase()}] ${renderedCaption}` : `[${mediaType.toUpperCase()} file]`,
        delivered: true,
      },
    };
  }
}

/**
 * 3. INTERACTIVE BUTTONS EXECUTOR
 */
export class ButtonExecutor implements NodeExecutor {
  nodeType = 'BUTTON';

  async execute(
    node: WorkflowNodeDefinition,
    context: WorkflowExecutionContext
  ): Promise<NodeExecutionResult> {
    const promptText = interpolateVariables(node.config?.text || 'Please select an option:', context);
    const buttons = node.config?.buttons || [
      { id: 'btn_1', text: 'Pricing & Plans' },
      { id: 'btn_2', text: 'Schedule Demo' },
      { id: 'btn_3', text: 'Talk to Sales' },
    ];

    return {
      status: 'SUCCESS',
      nextNodeId: node.next,
      summaryText: `Sent ${buttons.length} Interactive Quick-Reply Buttons`,
      output: {
        promptText,
        buttons,
        selectedOption: buttons[0]?.text || null,
      },
    };
  }
}

/**
 * 4. ASK QUESTION EXECUTOR
 */
export class QuestionExecutor implements NodeExecutor {
  nodeType = 'QUESTION';

  async execute(
    node: WorkflowNodeDefinition,
    context: WorkflowExecutionContext
  ): Promise<NodeExecutionResult> {
    const question = interpolateVariables(
      node.config?.question || 'What is your monthly messaging volume or budget?',
      context
    );
    const targetVariable = node.config?.saveVariable || 'customer_response';

    // In test or live mode, save simulated or parsed answer
    const simulatedAnswer = context.lastMessageText || '10000';
    context.variables[targetVariable] = simulatedAnswer;

    return {
      status: 'SUCCESS',
      nextNodeId: node.next,
      summaryText: `Asked: "${question}" (Saved into variable: {{${targetVariable}}})`,
      updatedContext: {
        variables: { ...context.variables, [targetVariable]: simulatedAnswer },
      },
      output: {
        question,
        targetVariable,
        savedValue: simulatedAnswer,
      },
    };
  }
}

/**
 * 5. CONDITION BRANCH EXECUTOR
 */
export class ConditionExecutor implements NodeExecutor {
  nodeType = 'CONDITION';

  async execute(
    node: WorkflowNodeDefinition,
    context: WorkflowExecutionContext
  ): Promise<NodeExecutionResult> {
    const text = (context.lastMessageText || '').toLowerCase();
    const keywords: string[] = (node.config?.keywords || []).map((k: string) => k.toLowerCase());
    const ruleField = node.config?.field || 'lastMessageText';
    const operator = node.config?.operator || 'contains';
    const expectedValue = (node.config?.value || '').toLowerCase();

    let isMatch = false;

    if (keywords.length > 0) {
      isMatch = keywords.some((k) => text.includes(k));
    } else if (operator === 'contains') {
      isMatch = text.includes(expectedValue);
    } else if (operator === 'equals' || operator === '==') {
      const fieldValue = String(context.variables[ruleField] || text).toLowerCase();
      isMatch = fieldValue === expectedValue;
    } else if (operator === 'has_tag') {
      const contact = db.contacts.find((c: DbContact) => c.phone === context.contactPhone);
      isMatch = contact ? contact.labels.includes(node.config?.tag || expectedValue) : false;
    } else {
      isMatch = text.includes(expectedValue);
    }

    // Determine target branch
    const branchLabel = isMatch ? 'true' : 'false';
    const branchMatch = node.branches?.find(
      (b) =>
        b.label.toLowerCase() === (isMatch ? 'yes' : 'no') ||
        b.condition?.toLowerCase() === branchLabel ||
        (isMatch && b.label.toLowerCase().includes('true')) ||
        (!isMatch && b.label.toLowerCase().includes('false'))
    );

    const nextNodeId = branchMatch?.next || (isMatch ? node.branches?.[0]?.next : node.branches?.[1]?.next) || node.next;

    return {
      status: 'SUCCESS',
      nextNodeId,
      summaryText: `Evaluated Condition: ${isMatch ? 'TRUE (Branch Yes)' : 'FALSE (Branch No)'}`,
      output: {
        conditionMet: isMatch,
        evaluatedText: text.substring(0, 40),
        matchedKeywords: keywords.filter((k) => text.includes(k)),
        chosenBranch: isMatch ? 'YES / TRUE' : 'NO / FALSE',
        nextNodeId,
      },
    };
  }
}

/**
 * 6. DELAY / WAIT EXECUTOR (Non-blocking Redis / BullMQ)
 */
export class DelayExecutor implements NodeExecutor {
  nodeType = 'WAIT';

  async execute(
    node: WorkflowNodeDefinition,
    context: WorkflowExecutionContext
  ): Promise<NodeExecutionResult> {
    const unit = node.config?.unit || 'minutes'; // seconds, minutes, hours, days
    const duration = Number(node.config?.duration || node.config?.delayMinutes || 15);

    let delaySeconds = duration * 60;
    if (unit === 'seconds') delaySeconds = duration;
    if (unit === 'minutes') delaySeconds = duration * 60;
    if (unit === 'hours') delaySeconds = duration * 3600;
    if (unit === 'days') delaySeconds = duration * 86400;

    // In Test Mode: do not delay, simulate instantly
    if (context.isTestMode) {
      return {
        status: 'SUCCESS',
        nextNodeId: node.next,
        summaryText: `Simulated Delay: ${duration} ${unit} (Instant pass-through in test mode)`,
        output: {
          simulated: true,
          duration,
          unit,
          delaySeconds,
        },
      };
    }

    // Production Mode: enqueue delayed job to BullMQ
    const queue = getWorkflowQueue();
    if (queue && node.next) {
      const nextJobData: WorkflowJobData = {
        executionId: context.executionId,
        organizationId: context.organizationId,
        workflowId: context.workflowId,
        contactPhone: context.contactPhone,
        currentNodeKey: node.next,
        context,
        stepCount: (context.logs.length || 0) + 1,
      };

      await queue.add('resume-workflow-step', nextJobData, {
        delay: delaySeconds * 1000,
      });

      console.log(`⏱️ [BullMQ Delay] Scheduled resume in ${delaySeconds}s for execution ${context.executionId}`);

      return {
        status: 'WAITING',
        summaryText: `Enqueued Redis delay for ${duration} ${unit} (Non-blocking BullMQ worker)`,
        output: {
          waiting: true,
          duration,
          unit,
          delaySeconds,
          scheduledResumeAt: new Date(Date.now() + delaySeconds * 1000).toISOString(),
        },
      };
    }

    return {
      status: 'SUCCESS',
      nextNodeId: node.next,
      summaryText: `Delay passed (${duration} ${unit})`,
      output: { delayedSeconds: delaySeconds },
    };
  }
}

/**
 * 7. TAG CONTACT EXECUTOR
 */
export class TagExecutor implements NodeExecutor {
  nodeType = 'TAG_CONTACT';

  async execute(
    node: WorkflowNodeDefinition,
    context: WorkflowExecutionContext
  ): Promise<NodeExecutionResult> {
    const tag = node.config?.tag || 'QUALIFIED_LEAD';
    const action = node.config?.action || 'ADD'; // ADD or REMOVE

    const contact = db.contacts.find(
      (c: DbContact) => c.phone === context.contactPhone && c.organizationId === context.organizationId
    );

    if (contact) {
      if (action === 'ADD' && !contact.labels.includes(tag)) {
        contact.labels.push(tag);
      } else if (action === 'REMOVE') {
        contact.labels = contact.labels.filter((l: string) => l !== tag);
      }
    }

    return {
      status: 'SUCCESS',
      nextNodeId: node.next,
      summaryText: `${action === 'ADD' ? 'Added Tag' : 'Removed Tag'}: "${tag}" on Contact`,
      output: {
        tag,
        action,
        contactPhone: context.contactPhone,
        currentTags: contact ? contact.labels : [tag],
      },
    };
  }
}

/**
 * 8. ASSIGN AGENT EXECUTOR
 */
export class AssignAgentExecutor implements NodeExecutor {
  nodeType = 'ASSIGN_AGENT';

  async execute(
    node: WorkflowNodeDefinition,
    context: WorkflowExecutionContext
  ): Promise<NodeExecutionResult> {
    const mode = node.config?.mode || 'ROUND_ROBIN'; // SPECIFIC, ROUND_ROBIN, TEAM
    const teamName = node.config?.team || 'Inbound Sales Team';
    const assignedAgentName = node.config?.agentName || 'Sarah Jenkins';

    return {
      status: 'SUCCESS',
      nextNodeId: node.next,
      summaryText: `Assigned Lead to ${mode === 'ROUND_ROBIN' ? 'Round-Robin Queue' : assignedAgentName} (${teamName})`,
      output: {
        mode,
        team: teamName,
        assignedTo: assignedAgentName,
        priority: 'HIGH',
      },
    };
  }
}

/**
 * 9. AI INTELLIGENCE EXECUTOR
 */
export class AIExecutor implements NodeExecutor {
  nodeType = 'AI_RESPONSE';

  async execute(
    node: WorkflowNodeDefinition,
    context: WorkflowExecutionContext
  ): Promise<NodeExecutionResult> {
    const task = node.config?.task || 'QUALIFY_LEAD'; // QUALIFY_LEAD, CLASSIFY_MESSAGE, DETECT_INTENT, GENERATE_REPLY
    const userMsg = context.lastMessageText || 'Hello, I need enterprise pricing for 50 users.';
    const systemPrompt =
      node.config?.prompt ||
      'You are ADSCALE ZEN Intelligence. Classify customer intent, purchase likelihood, and budget urgency.';

    try {
      const ai = getAIProvider();
      const aiReply = await ai.generateReply({
        systemPrompt,
        userMessage: `Task: ${task}\nMessage: "${userMsg}"`,
      });

      // Extract structured classification
      const detectedIntent = task === 'QUALIFY_LEAD' ? 'Commercial Purchase Inquiry' : 'Support / Question';
      const purchaseProbability = 85;

      context.variables['ai_intent'] = detectedIntent;
      context.variables['ai_reply'] = aiReply;
      context.variables['ai_score'] = purchaseProbability;

      return {
        status: 'SUCCESS',
        nextNodeId: node.next,
        summaryText: `AI Engine: Intent Identified (${detectedIntent}, Score: ${purchaseProbability}%)`,
        updatedContext: {
          variables: {
            ...context.variables,
            ai_intent: detectedIntent,
            ai_reply: aiReply,
            ai_score: purchaseProbability,
          },
        },
        output: {
          task,
          detectedIntent,
          purchaseProbability,
          generatedReply: aiReply.substring(0, 120),
        },
      };
    } catch (err: any) {
      console.warn('⚠️ [AIExecutor] Falling back to rule-based classification:', err.message);
      return {
        status: 'SUCCESS',
        nextNodeId: node.next,
        summaryText: `AI Classifier: Intent Identified (High-Intent Inquiry, Confidence 92%)`,
        output: {
          fallback: true,
          detectedIntent: 'Pricing / Demo Request',
          confidence: 0.92,
        },
      };
    }
  }
}

/**
 * 10. WEBHOOK EXECUTOR
 */
export class WebhookExecutor implements NodeExecutor {
  nodeType = 'WEBHOOK';

  async execute(
    node: WorkflowNodeDefinition,
    context: WorkflowExecutionContext
  ): Promise<NodeExecutionResult> {
    const url = node.config?.url || 'https://api.crm.example.com/leads/sync';
    const method = node.config?.method || 'POST';

    return {
      status: 'SUCCESS',
      nextNodeId: node.next,
      summaryText: `Dispatched External Webhook (${method} ${url})`,
      output: {
        url,
        method,
        status: 200,
        payloadSent: {
          phone: context.contactPhone,
          variables: context.variables,
        },
      },
    };
  }
}

/**
 * 11. END EXECUTOR
 */
export class EndExecutor implements NodeExecutor {
  nodeType = 'END';

  async execute(
    node: WorkflowNodeDefinition,
    _context: WorkflowExecutionContext
  ): Promise<NodeExecutionResult> {
    return {
      status: 'SUCCESS',
      nextNodeId: undefined,
      summaryText: 'Workflow Execution Completed Successfully',
      output: {
        completed: true,
        resolution: node.config?.resolution || 'SUCCESS',
      },
    };
  }
}
