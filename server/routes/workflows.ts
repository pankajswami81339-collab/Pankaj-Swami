import { Router, Request, Response } from 'express';
import { nativeWorkflowEngine } from '../services/workflow/engine.js';
import { getRedisStatus } from '../queue/redis.js';
import { getWorkflowQueue } from '../queue/queues.js';
import { WorkflowExecutionContext } from '../services/workflow/types.js';

const router = Router();

// GET /api/v1/workflows
router.get('/', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const workflows = nativeWorkflowEngine.getWorkflows(orgId);
  res.json({ success: true, count: workflows.length, workflows });
});

// GET /api/v1/workflows/queue-stats
router.get('/queue-stats', async (req: Request, res: Response) => {
  const redisStatus = getRedisStatus();
  const queue = getWorkflowQueue();

  let jobCounts: Record<string, number> = { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 };
  if (queue) {
    try {
      jobCounts = (await queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed')) as Record<string, number>;
    } catch {
      // Ignore count fetch errors
    }
  }

  res.json({
    success: true,
    engine: 'ADSCALE ZEN Native Automation Engine',
    poweredBy: 'Node.js + TypeScript + PostgreSQL/Prisma + Redis + BullMQ',
    n8nDependency: false,
    redis: redisStatus,
    queue: {
      name: 'adscalezen-workflow-queue',
      counts: jobCounts,
      isNativeWorkerActive: true,
    },
  });
});

// GET /api/v1/workflows/:id
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const wf = nativeWorkflowEngine.getWorkflowById(id);
  if (!wf) {
    return res.status(404).json({ success: false, error: 'Workflow not found' });
  }
  res.json({ success: true, workflow: wf });
});

// POST /api/v1/workflows
router.post('/', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const { name, description, triggerType, nodes, edges, status, variables } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, error: 'Workflow name is required' });
  }

  const newWorkflow = nativeWorkflowEngine.saveWorkflow({
    id: req.body.id || `wf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    organizationId: orgId,
    name,
    description: description || '',
    triggerType: triggerType || 'INCOMING_MESSAGE',
    status: status || 'ACTIVE',
    version: 1,
    nodes: nodes || [],
    edges: edges || [],
    variables: variables || [],
  });

  res.status(201).json({ success: true, workflow: newWorkflow });
});

// PUT /api/v1/workflows/:id
router.put('/:id', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const { id } = req.params;

  const existing = nativeWorkflowEngine.getWorkflowById(id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Workflow not found' });
  }

  const updated = nativeWorkflowEngine.saveWorkflow({
    ...existing,
    ...req.body,
    id,
    organizationId: orgId,
  });

  res.json({ success: true, workflow: updated });
});

// POST /api/v1/workflows/:id/publish
router.post('/:id/publish', (req: Request, res: Response) => {
  const { id } = req.params;
  const ok = nativeWorkflowEngine.updateWorkflowStatus(id, 'ACTIVE');
  if (!ok) {
    return res.status(404).json({ success: false, error: 'Workflow not found' });
  }
  res.json({ success: true, message: 'Workflow published and set to ACTIVE' });
});

// POST /api/v1/workflows/:id/pause
router.post('/:id/pause', (req: Request, res: Response) => {
  const { id } = req.params;
  const ok = nativeWorkflowEngine.updateWorkflowStatus(id, 'PAUSED');
  if (!ok) {
    return res.status(404).json({ success: false, error: 'Workflow not found' });
  }
  res.json({ success: true, message: 'Workflow paused' });
});

// DELETE /api/v1/workflows/:id
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = nativeWorkflowEngine.deleteWorkflow(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Workflow not found' });
  }
  res.json({ success: true, message: 'Workflow deleted successfully' });
});

// POST /api/v1/workflows/:id/test - Test / Simulate Workflow
router.post('/:id/test', async (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const { id } = req.params;
  const { phone, name, message, isLiveTest } = req.body;

  const wf = nativeWorkflowEngine.getWorkflowById(id);
  if (!wf) {
    return res.status(404).json({ success: false, error: 'Workflow definition not found' });
  }

  const contactPhone = phone || '+1 (555) 382-9901';
  const contactName = name || 'Sarah Jenkins';
  const messageText = message || 'pricing';

  const context: WorkflowExecutionContext = {
    executionId: `exec_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    organizationId: orgId,
    workflowId: id,
    contactPhone,
    contactName,
    channel: 'manual_test',
    lastMessageText: messageText,
    isTestMode: !isLiveTest,
    status: 'PENDING',
    variables: {
      customer_budget: '15000',
      inbound_text: messageText,
      test_run: true,
    },
    logs: [],
    startedAt: new Date().toISOString(),
  };

  const executedContext = await nativeWorkflowEngine.executeWorkflow(context);

  res.json({
    success: true,
    executionId: executedContext.executionId,
    status: executedContext.status,
    logs: executedContext.logs,
    variables: executedContext.variables,
    summary: executedContext.logs.map((l) => l.summaryText),
    message: isLiveTest
      ? 'Live workflow execution triggered and message dispatched'
      : 'Simulation completed. No actual WhatsApp message was dispatched (test mode).',
  });
});

// GET /api/v1/workflows/executions/recent
router.get('/executions/recent', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const executions = nativeWorkflowEngine.getExecutions(orgId);
  res.json({ success: true, count: executions.length, executions });
});

export default router;
