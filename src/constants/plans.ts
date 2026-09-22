import { PlanTier } from '../types.js';

export interface PlanDefinition {
  tier: PlanTier | string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  contactsLimit: number;
  messagesLimit: number;
  campaignsLimit: number;
  workflowsLimit: number;
  membersLimit: number;
  numbersLimit: number;
}

export const SEED_PLANS: PlanDefinition[] = [
  {
    tier: 'FREE',
    name: 'Free Trial',
    description: 'Explore Meta WhatsApp Cloud API with test sandbox credentials',
    monthlyPrice: 0,
    annualPrice: 0,
    contactsLimit: 100,
    messagesLimit: 1000,
    campaignsLimit: 2,
    workflowsLimit: 1,
    membersLimit: 2,
    numbersLimit: 1,
  },
  {
    tier: 'STARTER',
    name: 'Starter',
    description: 'Perfect for growing businesses launching WhatsApp marketing & support',
    monthlyPrice: 2900, // $29 / ₹2,499
    annualPrice: 29000,
    contactsLimit: 2500,
    messagesLimit: 25000,
    campaignsLimit: 10,
    workflowsLimit: 5,
    membersLimit: 5,
    numbersLimit: 1,
  },
  {
    tier: 'GROWTH',
    name: 'Growth',
    description: 'High-volume messaging, automated bots, and shared team inbox',
    monthlyPrice: 7900, // $79 / ₹6,499
    annualPrice: 79000,
    contactsLimit: 15000,
    messagesLimit: 150000,
    campaignsLimit: 50,
    workflowsLimit: 20,
    membersLimit: 15,
    numbersLimit: 3,
  },
  {
    tier: 'BUSINESS',
    name: 'Business Pro',
    description: 'Enterprise workflows, AI chatbot, n8n integration, and SLA',
    monthlyPrice: 19900, // $199 / ₹16,999
    annualPrice: 199000,
    contactsLimit: 50000,
    messagesLimit: 500000,
    campaignsLimit: 200,
    workflowsLimit: 100,
    membersLimit: 50,
    numbersLimit: 10,
  },
  {
    tier: 'ENTERPRISE',
    name: 'Enterprise Dedicated',
    description: 'Custom throughput, dedicated account manager, custom webhooks & AI models',
    monthlyPrice: 49900,
    annualPrice: 499000,
    contactsLimit: 500000,
    messagesLimit: 5000000,
    campaignsLimit: 1000,
    workflowsLimit: 500,
    membersLimit: 200,
    numbersLimit: 50,
  },
];
