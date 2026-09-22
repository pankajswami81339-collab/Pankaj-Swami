import { Worker, Job } from 'bullmq';
import { getRedisClient } from './redis.js';
import { WorkflowJobData } from './queues.js';
import { executeWorkflowStep } from '../services/workflow-engine.js';

let workflowWorker: Worker<WorkflowJobData> | null = null;

export function startWorkflowWorker(): Worker<WorkflowJobData> | null {
  if (workflowWorker) {
    return workflowWorker;
  }

  const redis = getRedisClient();
  if (!redis) {
    console.info('ℹ️ [BullMQ Worker] Redis client not active. Worker will run in on-demand in-process fallback mode.');
    return null;
  }

  try {
    workflowWorker = new Worker<WorkflowJobData>(
      'adscalezen-workflow-queue',
      async (job: Job<WorkflowJobData>) => {
        console.log(`⚙️ [BullMQ Worker] Processing workflow job "${job.name}" (ID: ${job.id}, Execution: ${job.data.executionId})`);

        const result = await executeWorkflowStep({
          executionId: job.data.executionId,
          organizationId: job.data.organizationId,
          workflowId: job.data.workflowId,
          contactPhone: job.data.contactPhone,
          currentNodeKey: job.data.currentNodeKey,
          context: job.data.context,
        });

        return result;
      },
      {
        connection: redis,
        concurrency: 5,
      }
    );

    workflowWorker.on('completed', (job) => {
      console.log(`✅ [BullMQ Worker] Completed workflow job ${job.id}`);
    });

    workflowWorker.on('failed', (job, err) => {
      console.error(`❌ [BullMQ Worker] Failed job ${job?.id}:`, err.message);
    });

    return workflowWorker;
  } catch (err) {
    console.warn('⚠️ [BullMQ Worker] Could not start worker:', err);
    return null;
  }
}
