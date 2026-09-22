import express from 'express';
import authRoutes from './routes/auth.js';
import organizationRoutes from './routes/organizations.js';
import whatsappRoutes from './routes/whatsapp.js';
import webhookRoutes from './routes/webhooks.js';
import apiV1Routes from './routes/api-v1.js';
import workflowRoutes from './routes/workflows.js';
import metaIntegrationRoutes from './routes/meta-integrations.js';
import metaWebhookRoutes from './routes/meta-webhooks.js';
import { tenantMiddleware } from './tenant.js';
import { startWorkflowWorker } from './queue/workflow-worker.js';

export function createExpressApp() {
  const app = express();

  // Initialize BullMQ native automation background worker
  try {
    startWorkflowWorker();
  } catch (err) {
    console.warn('⚠️ [Worker Init] Fallback mode active:', err);
  }

  // JSON & URL-encoded parsing with rawBody retention for webhook signature checking
  app.use(
    express.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf.toString();
      },
    })
  );
  app.use(express.urlencoded({ extended: true }));

  // Tenant scoping middleware
  app.use('/api', tenantMiddleware);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'ADSCALE ZEN WhatsApp SaaS Engine',
      version: '1.0.0',
      domain: 'adscalezen.online',
      timestamp: new Date().toISOString(),
      tenantsActive: 3,
      nativeAutomationEngine: 'Active (Node.js + Redis/BullMQ + Prisma)',
    });
  });

  // API Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/organizations', organizationRoutes);
  app.use('/api/v1/whatsapp', whatsappRoutes);
  app.use('/api/webhooks/whatsapp', webhookRoutes);
  app.use('/api/v1/workflows', workflowRoutes);
  app.use('/api/integrations/meta', metaIntegrationRoutes);
  app.use('/api/webhooks/meta', metaWebhookRoutes);
  app.use('/api/v1', apiV1Routes);

  return app;
}
