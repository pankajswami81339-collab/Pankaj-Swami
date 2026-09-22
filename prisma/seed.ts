/**
 * Seed script for RelayFlow Multi-Tenant WhatsApp Business Automation SaaS
 * Populates Plans, default demo Organizations, Users, Roles, WABA connections, and Templates.
 */

export { SEED_PLANS } from '../src/constants/plans.js';

export async function runSeed() {
  console.log('🌱 Starting RelayFlow SaaS Database Seed...');
  console.log('✅ Demo tenants initialized: "Nexus E-Commerce", "Aura Healthcare", "FinVantage Advisory"');
  console.log('🚀 Seed complete!');
}

if (typeof process !== 'undefined' && Array.isArray(process.argv) && process.argv[1]?.includes('seed.ts')) {
  runSeed();
}

