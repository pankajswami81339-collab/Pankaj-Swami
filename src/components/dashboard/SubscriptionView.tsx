import React, { useState } from 'react';
import {
  Check,
  X,
  CreditCard,
  Headphones,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext.js';

export const SubscriptionView: React.FC = () => {
  const { currentOrg } = useTenant();

  // Pricing selection states for each tier
  const [starterCycle, setStarterCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [growthCycle, setGrowthCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    amount: string;
    cycle: string;
  } | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = (name: string, amount: string, cycle: string) => {
    setSelectedPlan({ name, amount, cycle });
    setIsCheckoutOpen(true);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsProcessing(false);
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setIsCheckoutOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ======================================================== */}
      {/* 1. TOP CARD: CURRENT PLAN (FREE PLAN) */}
      {/* ======================================================== */}
      <div className="space-y-2">
        <div className="inline-block rounded-t-lg bg-white border-t border-x border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-2xs">
          Current Plan
        </div>

        <div className="rounded-b-2xl rounded-tr-2xl border border-slate-200 bg-white p-6 shadow-xs -mt-2">
          <h2 className="text-xl font-bold text-emerald-600">Free Plan</h2>

          <div className="mt-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>10 Contacts</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>1 Campaigns Per Month</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>1 Bot Replies</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>1 Bot Flows</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>0 Contact Custom Fields</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>0 Team Members/Agents</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <X className="h-4 w-4 text-rose-500 shrink-0 stroke-[2.5]" />
              <span>AI Chat Bot</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <X className="h-4 w-4 text-rose-500 shrink-0 stroke-[2.5]" />
              <span>API and Webhook Access</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>Whatsapp Calling API</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SECTION: SUBSCRIBE PAID PLANS */}
      {/* ======================================================== */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
          Subscribe Paid Plans
        </h3>

        <div className="space-y-6">
          {/* ----------------- STARTER PLAN ----------------- */}
          <div className="space-y-1">
            <div className="inline-block rounded-t-lg bg-white border-t border-x border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-2xs">
              Starter Plan
            </div>

            <div className="rounded-b-2xl rounded-tr-2xl border border-slate-200 bg-white p-6 shadow-xs -mt-1 space-y-4">
              {/* Features checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>2000 Contacts</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>60 monthly Campaigns</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>50 Bot Replies</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>5 Bot Flows</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>5 Contact Custom Fields</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>5 Team Members/Agents</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <X className="h-4 w-4 text-rose-500 shrink-0 stroke-[2.5]" />
                  <span>AI Chat Bot</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <X className="h-4 w-4 text-rose-500 shrink-0 stroke-[2.5]" />
                  <span>API and Webhook Access</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Whatsapp Calling API</span>
                </div>
              </div>

              {/* Radio Pricing */}
              <div className="pt-2 space-y-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 text-xs text-emerald-700 font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="starter-billing"
                    checked={starterCycle === 'monthly'}
                    onChange={() => setStarterCycle('monthly')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>299.00 INR / monthly</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-emerald-700 font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="starter-billing"
                    checked={starterCycle === 'yearly'}
                    onChange={() => setStarterCycle('yearly')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>3,229.00 INR / yearly</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    Save 10%
                  </span>
                </label>
              </div>

              <div>
                <button
                  onClick={() =>
                    handleSubscribe(
                      'Starter Plan',
                      starterCycle === 'monthly' ? '299.00 INR' : '3,229.00 INR',
                      starterCycle
                    )
                  }
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 transition-colors cursor-pointer shadow-2xs"
                >
                  Upgrade to Starter Plan
                </button>
              </div>
            </div>
          </div>

          {/* ----------------- GROWTH PLAN ----------------- */}
          <div className="space-y-1">
            <div className="inline-block rounded-t-lg bg-white border-t border-x border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-2xs">
              Growth Plan
            </div>

            <div className="rounded-b-2xl rounded-tr-2xl border border-slate-200 bg-white p-6 shadow-xs -mt-1 space-y-4">
              {/* Features checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>50000 Contacts</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>250 monthly Campaigns</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>200 Bot Replies</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>25 Bot Flows</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>25 Contact Custom Fields</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>25 Team Members/Agents</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>AI Chat Bot</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>API and Webhook Access</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Whatsapp Calling API</span>
                </div>
              </div>

              {/* Radio Pricing */}
              <div className="pt-2 space-y-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 text-xs text-emerald-700 font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="growth-billing"
                    checked={growthCycle === 'monthly'}
                    onChange={() => setGrowthCycle('monthly')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>999.00 INR / monthly</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-emerald-700 font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="growth-billing"
                    checked={growthCycle === 'yearly'}
                    onChange={() => setGrowthCycle('yearly')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>10,789.00 INR / yearly</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    Save 10%
                  </span>
                </label>
              </div>

              <div>
                <button
                  onClick={() =>
                    handleSubscribe(
                      'Growth Plan',
                      growthCycle === 'monthly' ? '999.00 INR' : '10,789.00 INR',
                      growthCycle
                    )
                  }
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 transition-colors cursor-pointer shadow-2xs"
                >
                  Upgrade to Growth Plan
                </button>
              </div>
            </div>
          </div>

          {/* ----------------- ENTERPRISE PLAN ----------------- */}
          <div className="space-y-1">
            <div className="inline-block rounded-t-lg bg-white border-t border-x border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-2xs">
              Enterprise Plan
            </div>

            <div className="rounded-b-2xl rounded-tr-2xl border border-slate-200 bg-white p-6 shadow-xs -mt-1 space-y-4">
              {/* Features checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Unlimited Contacts</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Unlimited Campaigns</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Unlimited Bot Replies</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Unlimited Bot Flows</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Unlimited Contact Custom Fields</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Unlimited Team Members/Agents</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>AI Chat Bot</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>API and Webhook Access</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Whatsapp Calling API</span>
                </div>
              </div>

              {/* Enterprise custom pricing */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-600">
                  Custom Dedicated Architecture &amp; High-Throughput WABA SLA
                </span>
                <button
                  onClick={() =>
                    handleSubscribe('Enterprise Plan', 'Custom SLA Quote', 'Annual')
                  }
                  className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 transition-colors cursor-pointer shadow-2xs"
                >
                  Contact Sales &amp; Custom Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CHECKOUT MODAL SIMULATOR */}
      {/* ======================================================== */}
      {isCheckoutOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Confirm Subscription: {selectedPlan.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Organization: <strong>{currentOrg.name}</strong>
            </p>

            <div className="my-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
              <span className="text-2xl font-black text-emerald-800">{selectedPlan.amount}</span>
              <p className="text-[11px] text-emerald-700 mt-1 uppercase font-semibold">
                Billing Cycle: {selectedPlan.cycle}
              </p>
            </div>

            {paymentSuccess ? (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Subscription Activated Successfully!</span>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {isProcessing ? 'Processing Secure Checkout...' : 'Confirm & Activate Plan'}
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full rounded-xl border border-slate-200 text-slate-600 py-2 px-4 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
