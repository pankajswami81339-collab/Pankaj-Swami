import { Queue, QueueOptions } from 'bullmq';
import { getRedisClient } from './redis.js';

export interface WorkflowJobData {
  executionId: string;
  organizationId: string;
  workflowId: string;
  contactId?: string;
  conversationId?: string;
  contactPhone: string;
  currentNodeKey: string;
  triggerEvent?: any;
  context: Record<string, any>;
  stepCount: number;
}

export interface CampaignJobData {
  campaignId: string;
  organizationId: string;
  recipientId: string;
  phone: string;
  templateId: string;
  variables: Record<string, string>;
}

export interface WebhookJobData {
  eventId: string;
  organizationId: string;
  payload: any;
  receivedAt: string;
}

let workflowQueue: Queue<WorkflowJobData> | null = null;
let campaignQueue: Queue<CampaignJobData> | null = null;
let webhookQueue: Queue<WebhookJobData> | null = null;

export function getWorkflowQueue(): Queue<WorkflowJobData> | null {
  if (workflowQueue) return workflowQueue;

  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const queueOptions: QueueOptions = {
      connection: redis,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 1000,
        removeOnFail: 5000,
      },
    };

    workflowQueue = new Queue<WorkflowJobData>('adscalezen-workflow-queue', queueOptions);
    return workflowQueue;
  } catch (err) {
    console.warn('⚠️ [BullMQ] Failed to initialize workflow queue:', err);
    return null;
  }
}

export function getCampaignQueue(): Queue<CampaignJobData> | null {
  if (campaignQueue) return campaignQueue;

  const redis = getRedisClient();
  if (!redis) return null;

  try {
    campaignQueue = new Queue<CampaignJobData>('adscalezen-campaign-queue', {
      connection: redis,
      defaultJobOptions: {
        attempts: 2,
        removeOnComplete: 1000,
      },
    });
    return campaignQueue;
  } catch (err) {
    console.warn('⚠️ [BullMQ] Failed to initialize campaign queue:', err);
    return null;
  }
}

export function getWebhookQueue(): Queue<WebhookJobData> | null {
  if (webhookQueue) return webhookQueue;

  const redis = getRedisClient();
  if (!redis) return null;

  try {
    webhookQueue = new Queue<WebhookJobData>('adscalezen-webhook-queue', {
      connection: redis,
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 2000,
      },
    });
    return webhookQueue;
  } catch (err) {
    console.warn('⚠️ [BullMQ] Failed to initialize webhook queue:', err);
    return null;
  }
}
