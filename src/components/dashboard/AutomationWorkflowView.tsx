import React, { useState, useEffect } from 'react';
import {
  Workflow, Plus, Play, Save, Download, ArrowRight,
  MessageSquare, HelpCircle, GitFork, Clock, Tag,
  UserCheck, Bot, Webhook, Globe, StopCircle, CheckCircle2,
  Trash2, Settings2, Sparkles, X, ChevronRight, ArrowUp, ArrowDown,
  RefreshCw, Check, AlertCircle, Eye, PauseCircle, Send, Terminal,
  Image as ImageIcon, FileText, Video, Volume2, Paperclip
} from 'lucide-react';

export type NodeType =
  | 'START'
  | 'MESSAGE'
  | 'MEDIA'
  | 'BUTTON'
  | 'QUESTION'
  | 'CONDITION'
  | 'WAIT'
  | 'TAG_CONTACT'
  | 'ASSIGN_AGENT'
  | 'AI_RESPONSE'
  | 'WEBHOOK'
  | 'HTTP_REQUEST'
  | 'END';

export interface FlowNode {
  id: string;
  type: NodeType;
  title: string;
  config: Record<string, any>;
  next?: string;
  branches?: { label: string; next: string }[];
}

export interface WorkflowRecord {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  triggerType: string;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
  nodes: FlowNode[];
  edges?: any[];
  variables?: { key: string; dataType: string; defaultValue?: string }[];
}

export const AutomationWorkflowView: React.FC = () => {
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowRecord | null>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT' | 'PAUSED'>('ACTIVE');
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Test Simulator State
  const [isTestSimulatorOpen, setIsTestSimulatorOpen] = useState(false);
  const [testPhone, setTestPhone] = useState('+1 (555) 382-9901');
  const [testName, setTestName] = useState('Sarah Jenkins');
  const [testMessage, setTestMessage] = useState('pricing');
  const [isLiveTest, setIsLiveTest] = useState(false);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<any[]>([]);
  const [executionVariables, setExecutionVariables] = useState<Record<string, any>>({});
  const [executionStatus, setExecutionStatus] = useState<string | null>(null);
  const [testChatMessages, setTestChatMessages] = useState<
    { sender: 'bot' | 'user'; text: string; mediaUrl?: string; mediaType?: string; filename?: string }[]
  >([]);

  // 13 Node Palette Definitions (Including Media for WhatsApp Marketing & Support)
  const palette: { type: NodeType; label: string; icon: any; color: string }[] = [
    { type: 'START', label: 'Start Trigger', icon: Play, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { type: 'MESSAGE', label: 'Send Message', icon: MessageSquare, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { type: 'MEDIA', label: 'Send Media', icon: ImageIcon, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { type: 'BUTTON', label: 'Interactive Buttons', icon: CheckCircle2, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { type: 'QUESTION', label: 'Ask Question', icon: HelpCircle, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { type: 'CONDITION', label: 'Condition Branch', icon: GitFork, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { type: 'WAIT', label: 'Delay / Wait', icon: Clock, color: 'text-slate-600 bg-slate-100 border-slate-200' },
    { type: 'TAG_CONTACT', label: 'Tag Contact', icon: Tag, color: 'text-pink-600 bg-pink-50 border-pink-200' },
    { type: 'ASSIGN_AGENT', label: 'Assign Agent', icon: UserCheck, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { type: 'AI_RESPONSE', label: 'AI Intelligence', icon: Bot, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { type: 'WEBHOOK', label: 'Send Webhook', icon: Webhook, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { type: 'HTTP_REQUEST', label: 'HTTP Request', icon: Globe, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { type: 'END', label: 'End Flow', icon: StopCircle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  ];

  // Fetch workflows from backend API
  const loadWorkflow = async () => {
    try {
      const res = await fetch('/api/v1/workflows');
      const data = await res.json();
      if (data.success && data.workflows && data.workflows.length > 0) {
        const wf = data.workflows[0];
        setCurrentWorkflow(wf);
        setNodes(wf.nodes || []);
        setStatus(wf.status || 'ACTIVE');
        if (wf.nodes && wf.nodes.length > 0) {
          setSelectedNode(wf.nodes[0]);
        }
      } else {
        // Fallback default structure
        const defaultNodes: FlowNode[] = [
          {
            id: 'node-start',
            type: 'START',
            title: 'Incoming WhatsApp Message',
            config: { triggerType: 'INCOMING_MESSAGE', keywords: ['pricing', 'demo'] },
            next: 'node-condition',
          },
          {
            id: 'node-condition',
            type: 'CONDITION',
            title: 'Condition: Check Pricing or Demo Keyword',
            config: { field: 'lastMessageText', operator: 'contains', keywords: ['pricing', 'price', 'demo'] },
            branches: [
              { label: 'Yes (Match)', next: 'node-ai' },
              { label: 'No (Default)', next: 'node-general' },
            ],
          },
          {
            id: 'node-ai',
            type: 'AI_RESPONSE',
            title: 'AI Smart Intent Classifier',
            config: { task: 'QUALIFY_LEAD', prompt: 'Determine customer budget and purchase intent' },
            next: 'node-msg',
          },
          {
            id: 'node-msg',
            type: 'MESSAGE',
            title: 'Send WhatsApp Pricing & Brochure',
            config: { text: 'Hello {{contact.name}}! Here is our growth pricing guide: https://adscalezen.online/pricing' },
            next: 'node-end',
          },
          {
            id: 'node-general',
            type: 'MESSAGE',
            title: 'Send Interactive Welcome Options',
            config: { text: 'Welcome to ADSCALE ZEN, {{contact.name}}! Reply with pricing or demo to learn more.' },
            next: 'node-end',
          },
          {
            id: 'node-end',
            type: 'END',
            title: 'Workflow Finished',
            config: { resolution: 'SUCCESS' },
          },
        ];
        setNodes(defaultNodes);
        setSelectedNode(defaultNodes[0]);
      }
    } catch (err) {
      console.error('Failed to load workflows:', err);
    }
  };

  useEffect(() => {
    loadWorkflow();
  }, []);

  // Save workflow to backend
  const handleSaveWorkflow = async (publish: boolean = false) => {
    setIsSaving(true);
    const updatedStatus = publish ? 'ACTIVE' : status;
    try {
      const payload = {
        id: currentWorkflow?.id || 'wf_lead_qualification',
        name: currentWorkflow?.name || 'Smart WhatsApp Lead Qualification & Auto-Routing',
        description: currentWorkflow?.description || 'Natively qualifies incoming WhatsApp inquiries.',
        triggerType: 'INCOMING_MESSAGE',
        status: updatedStatus,
        nodes,
      };

      const res = await fetch(`/api/v1/workflows/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(updatedStatus);
        setSaveToast(publish ? 'Workflow published and set to ACTIVE!' : 'Workflow saved successfully.');
        setTimeout(() => setSaveToast(null), 3000);
      }
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePauseWorkflow = async () => {
    if (!currentWorkflow) return;
    try {
      const res = await fetch(`/api/v1/workflows/${currentWorkflow.id}/pause`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatus('PAUSED');
        setSaveToast('Workflow paused. Inbound triggers will be ignored.');
        setTimeout(() => setSaveToast(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNode = (type: NodeType) => {
    const pal = palette.find((p) => p.type === type);
    const newNodeId = `node-${Date.now()}`;
    let defaultConfig: Record<string, any> = {};

    switch (type) {
      case 'START':
        defaultConfig = { triggerType: 'INCOMING_MESSAGE', keywords: [] };
        break;
      case 'MESSAGE':
        defaultConfig = { text: 'Hello {{contact.name}}, thanks for reaching out!' };
        break;
      case 'MEDIA':
        defaultConfig = {
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
          caption: 'Here is our updated WhatsApp product catalog, {{contact.name}}!',
          filename: 'brochure-2026.pdf',
        };
        break;
      case 'BUTTON':
        defaultConfig = {
          bodyText: 'Please select an option below:',
          buttons: ['Pricing Info', 'Talk to Human', 'Book Demo'],
        };
        break;
      case 'QUESTION':
        defaultConfig = { question: 'What is your monthly business budget?', saveToVariable: 'customer_budget' };
        break;
      case 'CONDITION':
        defaultConfig = { field: 'lastMessageText', operator: 'contains', keywords: ['pricing'] };
        break;
      case 'WAIT':
        defaultConfig = { duration: 10, unit: 'minutes' };
        break;
      case 'TAG_CONTACT':
        defaultConfig = { tag: 'QUALIFIED_LEAD', action: 'ADD' };
        break;
      case 'ASSIGN_AGENT':
        defaultConfig = { mode: 'ROUND_ROBIN', team: 'Enterprise Sales Team' };
        break;
      case 'AI_RESPONSE':
        defaultConfig = { task: 'QUALIFY_LEAD', prompt: 'Determine intent and score budget bracket.' };
        break;
      case 'WEBHOOK':
      case 'HTTP_REQUEST':
        defaultConfig = { url: 'https://api.adscalezen.online/v1/lead-sync', method: 'POST' };
        break;
      case 'END':
        defaultConfig = { resolution: 'SUCCESS' };
        break;
    }

    const newNode: FlowNode = {
      id: newNodeId,
      type,
      title: pal?.label || 'New Step',
      config: defaultConfig,
    };

    // If there's a selected node, link it to this new node
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    setSelectedNode(newNode);
  };

  const handleDeleteNode = (nodeId: string) => {
    const filtered = nodes.filter((n) => n.id !== nodeId);
    setNodes(filtered);
    if (selectedNode?.id === nodeId) {
      setSelectedNode(filtered[0] || null);
    }
  };

  const handleMoveNode = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === nodes.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...nodes];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setNodes(updated);
  };

  // Run Test Simulation via Backend API
  const handleRunSimulation = async () => {
    if (!currentWorkflow) return;
    setIsRunningTest(true);
    setExecutionLogs([]);
    setExecutionVariables({});
    setExecutionStatus('RUNNING');

    // Add user message to chat preview
    setTestChatMessages([
      { sender: 'user', text: testMessage },
    ]);

    try {
      const res = await fetch(`/api/v1/workflows/${currentWorkflow.id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: testPhone,
          name: testName,
          message: testMessage,
          isLiveTest,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExecutionLogs(data.logs || []);
        setExecutionVariables(data.variables || {});
        setExecutionStatus(data.status || 'COMPLETED');

        // Find sent messages from logs and append to chat preview (including MEDIA)
        const msgLogs = (data.logs || []).filter(
          (l: any) => l.nodeType === 'MESSAGE' || l.nodeType === 'MEDIA' || l.nodeType === 'BUTTON'
        );
        for (const log of msgLogs) {
          if (log.output?.messageSent || log.output?.mediaUrl) {
            setTestChatMessages((prev) => [
              ...prev,
              {
                sender: 'bot',
                text: log.output?.caption || log.output?.messageSent || '',
                mediaUrl: log.output?.mediaUrl,
                mediaType: log.output?.mediaType,
                filename: log.output?.filename,
              },
            ]);
          }
        }
      } else {
        setExecutionStatus('FAILED');
        alert('Test run error: ' + data.error);
      }
    } catch (err: any) {
      setExecutionStatus('FAILED');
      alert('Execution request failed: ' + err.message);
    } finally {
      setIsRunningTest(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(nodes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentWorkflow?.id || 'adscalezen-workflow'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Workflow className="h-5 w-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Visual Automation &amp; Bot Flow Builder
            </h2>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                status === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : status === 'PAUSED'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build 24/7 intelligent WhatsApp conversational funnels powered by native Node.js, Redis, and BullMQ workers.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => {
              setIsTestSimulatorOpen(true);
              if (executionLogs.length === 0) {
                handleRunSimulation();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 text-xs font-bold text-emerald-800 transition-colors shadow-xs"
          >
            <Play className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
            <span>Test Simulation</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>Export JSON</span>
          </button>

          {status === 'ACTIVE' ? (
            <button
              onClick={handlePauseWorkflow}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800 transition-colors shadow-xs"
            >
              <PauseCircle className="h-3.5 w-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={() => handleSaveWorkflow(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition-colors shadow-xs"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Publish Flow</span>
            </button>
          )}

          <button
            onClick={() => handleSaveWorkflow(false)}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors shadow-xs"
          >
            <Save className="h-3.5 w-3.5 text-slate-500" />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center justify-between shadow-2xs">
          <span>{saveToast}</span>
          <button onClick={() => setSaveToast(null)} className="text-emerald-700 font-bold ml-2">
            &times;
          </button>
        </div>
      )}

      {/* Native Engine Status Bar */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="font-bold text-emerald-950">
            ADSCALE ZEN Native Automation Engine
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-emerald-800">
            Node.js + PostgreSQL (Prisma) + Redis + BullMQ Workers
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200 shadow-2xs">
            0% External n8n Dependency
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-2xs">
            BullMQ Queue Active
          </span>
        </div>
      </div>

      {/* Main Builder Canvas Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-13rem)] min-h-[620px]">
        {/* Left Col: 12 Node Palette */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col overflow-hidden">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Node Palette (12)
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold">Click to Add</span>
          </div>

          <div className="flex-1 overflow-y-auto pt-3 space-y-1.5 pr-1">
            {palette.map((pal) => {
              const Icon = pal.icon;
              return (
                <button
                  key={pal.type}
                  onClick={() => handleAddNode(pal.type)}
                  className="w-full flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-500 hover:bg-emerald-50/40 p-2 text-xs font-semibold text-slate-800 transition-all text-left shadow-2xs group"
                >
                  <div className={`p-1.5 rounded-lg border ${pal.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="flex-1 truncate">{pal.label}</span>
                  <Plus className="h-3.5 w-3.5 text-slate-300 group-hover:text-emerald-600" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Col: Visual Canvas Stream */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-xs flex flex-col overflow-hidden relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900">
                {currentWorkflow?.name || 'Active Flow: Inbound Lead Qualifier'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{nodes.length} nodes active</span>
          </div>

          {/* Node Visual Stream */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
            {nodes.map((node, index) => {
              const pal = palette.find((p) => p.type === node.type) || palette[0];
              const Icon = pal.icon;
              const isSelected = selectedNode?.id === node.id;

              return (
                <div key={node.id} className="relative">
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-white shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl border ${pal.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{node.title}</p>
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                            TYPE: {node.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          title="Move Up"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveNode(index, 'up');
                          }}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          title="Move Down"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveNode(index, 'down');
                          }}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded ml-1">
                          #{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Preview details */}
                    <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 rounded-lg p-2 font-mono">
                      {node.type === 'MESSAGE' && (node.config?.text || 'Message text...')}
                      {node.type === 'MEDIA' && (
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 shrink-0">
                            {node.config?.mediaType || 'IMAGE'}
                          </span>
                          <span className="truncate">{node.config?.caption || node.config?.filename || node.config?.mediaUrl || 'Media attachment'}</span>
                        </div>
                      )}
                      {node.type === 'START' && 'Trigger: Incoming WhatsApp Message (Keywords filter)'}
                      {node.type === 'AI_RESPONSE' && `AI Task: ${node.config?.task || 'QUALIFY_LEAD'} (${node.config?.prompt || 'Classify'})`}
                      {node.type === 'CONDITION' && `Condition: [${node.config?.field || 'lastMessageText'}] ${node.config?.operator || 'contains'} ${JSON.stringify(node.config?.keywords || node.config?.value || '')}`}
                      {node.type === 'BUTTON' && `Buttons: ${(node.config?.buttons || []).join(', ')}`}
                      {node.type === 'QUESTION' && `Prompt: ${node.config?.question || ''} → {{variables.${node.config?.saveToVariable || 'ans'}}}`}
                      {node.type === 'WAIT' && `Delay: Wait ${node.config?.duration || 10} ${node.config?.unit || 'minutes'}`}
                      {node.type === 'TAG_CONTACT' && `Tag: ${node.config?.action || 'ADD'} [${node.config?.tag || 'LEAD'}]`}
                      {node.type === 'ASSIGN_AGENT' && `Queue: ${node.config?.team || 'Sales'} (${node.config?.mode || 'ROUND_ROBIN'})`}
                      {node.type === 'WEBHOOK' && `URL: ${node.config?.url || 'https://...'}`}
                      {node.type === 'END' && `Flow complete (${node.config?.resolution || 'SUCCESS'})`}
                    </div>

                    {node.branches && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {node.branches.map((b) => (
                          <span
                            key={b.label}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            Branch: {b.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {index < nodes.length - 1 && (
                    <div className="flex justify-center my-1.5">
                      <div className="h-4 w-0.5 bg-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Node Inspector Panel (Full Functional Config) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col overflow-hidden">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Node Inspector
            </span>
            <Settings2 className="h-4 w-4 text-slate-400" />
          </div>

          {selectedNode ? (
            <div className="flex-1 overflow-y-auto pt-3 space-y-4 text-xs pr-1">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Node Title</label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    const updated = nodes.map((n) => (n.id === selectedNode.id ? { ...n, title: newTitle } : n));
                    setNodes(updated);
                    setSelectedNode({ ...selectedNode, title: newTitle });
                  }}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Node Type</label>
                <input
                  type="text"
                  readOnly
                  value={selectedNode.type}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-600"
                />
              </div>

              {/* Dynamic Form per Node Type */}
              {selectedNode.type === 'MESSAGE' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Message Text</label>
                    <textarea
                      rows={4}
                      value={selectedNode.config?.text || ''}
                      onChange={(e) => {
                        const newConfig = { ...selectedNode.config, text: e.target.value };
                        const updated = nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, config: newConfig } : n
                        );
                        setNodes(updated);
                        setSelectedNode({ ...selectedNode, config: newConfig });
                      }}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-emerald-500 font-sans"
                      placeholder="Write message here. Use variables like {{contact.name}}..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Insert Variable Tokens
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['{{contact.name}}', '{{contact.phone}}', '{{variables.ai_intent}}', '{{variables.customer_budget}}'].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            const cur = selectedNode.config?.text || '';
                            const newConfig = { ...selectedNode.config, text: cur + ' ' + v };
                            const updated = nodes.map((n) =>
                              n.id === selectedNode.id ? { ...n, config: newConfig } : n
                            );
                            setNodes(updated);
                            setSelectedNode({ ...selectedNode, config: newConfig });
                          }}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-mono font-semibold text-slate-700"
                        >
                          + {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Media Attachment inside Message */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-slate-700 font-bold mb-1 text-[11px] flex items-center gap-1.5">
                      <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                      Attach Media (Image, PDF, Video) - Optional
                    </label>
                    <input
                      type="url"
                      value={selectedNode.config?.mediaUrl || ''}
                      onChange={(e) => {
                        const newConfig = { ...selectedNode.config, mediaUrl: e.target.value };
                        const updated = nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, config: newConfig } : n
                        );
                        setNodes(updated);
                        setSelectedNode({ ...selectedNode, config: newConfig });
                      }}
                      placeholder="https://example.com/brochure.pdf"
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:outline-emerald-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* MEDIA NODE INSPECTOR (Dedicated WhatsApp Media Step) */}
              {selectedNode.type === 'MEDIA' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">Media Type</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'image', label: 'Image', icon: ImageIcon },
                        { id: 'document', label: 'Document', icon: FileText },
                        { id: 'video', label: 'Video', icon: Video },
                        { id: 'audio', label: 'Audio', icon: Volume2 },
                      ].map((item) => {
                        const ItemIcon = item.icon;
                        const isCurrent = (selectedNode.config?.mediaType || 'image') === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              const newConfig = {
                                ...selectedNode.config,
                                mediaType: item.id,
                                filename: item.id === 'document' ? 'catalog-brochure.pdf' : undefined,
                              };
                              const updated = nodes.map((n) =>
                                n.id === selectedNode.id ? { ...n, config: newConfig } : n
                              );
                              setNodes(updated);
                              setSelectedNode({ ...selectedNode, config: newConfig });
                            }}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] font-bold transition-all ${
                              isCurrent
                                ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-2xs'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <ItemIcon className="h-4 w-4 mb-1" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-700 font-bold">Media Direct URL</label>
                      <span className="text-[10px] text-slate-400">Public HTTPS URL</span>
                    </div>
                    <input
                      type="url"
                      value={selectedNode.config?.mediaUrl || ''}
                      onChange={(e) => {
                        const newConfig = { ...selectedNode.config, mediaUrl: e.target.value };
                        const updated = nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, config: newConfig } : n
                        );
                        setNodes(updated);
                        setSelectedNode({ ...selectedNode, config: newConfig });
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:outline-purple-500 font-mono"
                    />
                  </div>

                  {/* Preset Media Samples */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Quick Preset Samples
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const newConfig = {
                            ...selectedNode.config,
                            mediaType: 'image',
                            mediaUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
                            caption: 'Official ADSCALE ZEN 2026 Product Catalog & Pricing Guide',
                          };
                          const updated = nodes.map((n) =>
                            n.id === selectedNode.id ? { ...n, config: newConfig } : n
                          );
                          setNodes(updated);
                          setSelectedNode({ ...selectedNode, config: newConfig });
                        }}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-left hover:border-purple-500 transition-colors"
                      >
                        <p className="text-[11px] font-bold text-slate-800 truncate">📸 Catalog Image</p>
                        <p className="text-[9px] text-slate-400 truncate">Unsplash High-Res</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const newConfig = {
                            ...selectedNode.config,
                            mediaType: 'document',
                            filename: 'adscale-zen-brochure.pdf',
                            mediaUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                            caption: 'Here is our detailed PDF business brochure, {{contact.name}}!',
                          };
                          const updated = nodes.map((n) =>
                            n.id === selectedNode.id ? { ...n, config: newConfig } : n
                          );
                          setNodes(updated);
                          setSelectedNode({ ...selectedNode, config: newConfig });
                        }}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-left hover:border-purple-500 transition-colors"
                      >
                        <p className="text-[11px] font-bold text-slate-800 truncate">📄 Brochure PDF</p>
                        <p className="text-[9px] text-slate-400 truncate">PDF Document</p>
                      </button>
                    </div>
                  </div>

                  {/* Document Filename if document */}
                  {(selectedNode.config?.mediaType === 'document') && (
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">PDF / Document Filename</label>
                      <input
                        type="text"
                        value={selectedNode.config?.filename || 'adscale-catalog.pdf'}
                        onChange={(e) => {
                          const newConfig = { ...selectedNode.config, filename: e.target.value };
                          const updated = nodes.map((n) =>
                            n.id === selectedNode.id ? { ...n, config: newConfig } : n
                          );
                          setNodes(updated);
                          setSelectedNode({ ...selectedNode, config: newConfig });
                        }}
                        placeholder="e.g. PriceList-2026.pdf"
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:outline-purple-500 font-mono"
                      />
                    </div>
                  )}

                  {/* Caption */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Caption / Message Text</label>
                    <textarea
                      rows={3}
                      value={selectedNode.config?.caption || ''}
                      onChange={(e) => {
                        const newConfig = { ...selectedNode.config, caption: e.target.value };
                        const updated = nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, config: newConfig } : n
                        );
                        setNodes(updated);
                        setSelectedNode({ ...selectedNode, config: newConfig });
                      }}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:outline-purple-500"
                      placeholder="Add an engaging caption for WhatsApp (optional)..."
                    />
                  </div>

                  {/* Variable tokens */}
                  <div>
                    <div className="flex flex-wrap gap-1.5">
                      {['{{contact.name}}', '{{contact.phone}}', '{{variables.customer_budget}}'].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            const cur = selectedNode.config?.caption || '';
                            const newConfig = { ...selectedNode.config, caption: cur + ' ' + v };
                            const updated = nodes.map((n) =>
                              n.id === selectedNode.id ? { ...n, config: newConfig } : n
                            );
                            setNodes(updated);
                            setSelectedNode({ ...selectedNode, config: newConfig });
                          }}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-mono font-semibold text-slate-700"
                        >
                          + {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Media Preview Card */}
                  {selectedNode.config?.mediaUrl && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 space-y-2">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Live Preview</p>
                      {selectedNode.config?.mediaType === 'image' && (
                        <img
                          src={selectedNode.config.mediaUrl}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg border border-slate-200"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}
                      {selectedNode.config?.mediaType === 'document' && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200">
                          <FileText className="h-6 w-6 text-rose-600 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {selectedNode.config.filename || 'Document.pdf'}
                            </p>
                            <p className="text-[10px] text-slate-400">PDF Document Attachment</p>
                          </div>
                        </div>
                      )}
                      {selectedNode.config?.mediaType === 'video' && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 text-white">
                          <Video className="h-5 w-5 text-purple-400 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold truncate">WhatsApp Video File</p>
                            <p className="text-[10px] text-slate-400 truncate">{selectedNode.config.mediaUrl}</p>
                          </div>
                        </div>
                      )}
                      {selectedNode.config?.mediaType === 'audio' && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Volume2 className="h-5 w-5 text-emerald-600 shrink-0" />
                          <p className="text-xs font-bold">Voice Note Audio</p>
                        </div>
                      )}
                      {selectedNode.config?.caption && (
                        <p className="text-xs text-slate-700 italic">
                          "{selectedNode.config.caption}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {selectedNode.type === 'AI_RESPONSE' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">AI Task</label>
                    <select
                      value={selectedNode.config?.task || 'QUALIFY_LEAD'}
                      onChange={(e) => {
                        const newConfig = { ...selectedNode.config, task: e.target.value };
                        const updated = nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, config: newConfig } : n
                        );
                        setNodes(updated);
                        setSelectedNode({ ...selectedNode, config: newConfig });
                      }}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900"
                    >
                      <option value="QUALIFY_LEAD">Qualify Lead & Budget</option>
                      <option value="CLASSIFY_MESSAGE">Classify Intent</option>
                      <option value="GENERATE_REPLY">Generate Grounded Reply</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">System Instructions / Prompt</label>
                    <textarea
                      rows={3}
                      value={selectedNode.config?.prompt || ''}
                      onChange={(e) => {
                        const newConfig = { ...selectedNode.config, prompt: e.target.value };
                        const updated = nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, config: newConfig } : n
                        );
                        setNodes(updated);
                        setSelectedNode({ ...selectedNode, config: newConfig });
                      }}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
              )}

              {selectedNode.type === 'CONDITION' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Field to Inspect</label>
                    <input
                      type="text"
                      value={selectedNode.config?.field || 'lastMessageText'}
                      onChange={(e) => {
                        const newConfig = { ...selectedNode.config, field: e.target.value };
                        const updated = nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, config: newConfig } : n
                        );
                        setNodes(updated);
                        setSelectedNode({ ...selectedNode, config: newConfig });
                      }}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Keywords / Values (comma separated)</label>
                    <input
                      type="text"
                      value={(selectedNode.config?.keywords || []).join(', ')}
                      onChange={(e) => {
                        const keywords = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        const newConfig = { ...selectedNode.config, keywords };
                        const updated = nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, config: newConfig } : n
                        );
                        setNodes(updated);
                        setSelectedNode({ ...selectedNode, config: newConfig });
                      }}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs font-mono text-slate-900"
                      placeholder="pricing, price, cost, demo"
                    />
                  </div>
                </div>
              )}

              {selectedNode.type === 'WAIT' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Duration</label>
                      <input
                        type="number"
                        min={1}
                        value={selectedNode.config?.duration || 10}
                        onChange={(e) => {
                          const newConfig = { ...selectedNode.config, duration: parseInt(e.target.value) || 1 };
                          const updated = nodes.map((n) =>
                            n.id === selectedNode.id ? { ...n, config: newConfig } : n
                          );
                          setNodes(updated);
                          setSelectedNode({ ...selectedNode, config: newConfig });
                        }}
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Unit</label>
                      <select
                        value={selectedNode.config?.unit || 'minutes'}
                        onChange={(e) => {
                          const newConfig = { ...selectedNode.config, unit: e.target.value };
                          const updated = nodes.map((n) =>
                            n.id === selectedNode.id ? { ...n, config: newConfig } : n
                          );
                          setNodes(updated);
                          setSelectedNode({ ...selectedNode, config: newConfig });
                        }}
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900"
                      >
                        <option value="seconds">Seconds</option>
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    ⚡ Scheduled non-blockingly via BullMQ Redis queue without freezing server threads.
                  </p>
                </div>
              )}

              {selectedNode.type === 'TAG_CONTACT' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Tag Identifier</label>
                    <input
                      type="text"
                      value={selectedNode.config?.tag || 'HIGH_INTENT_LEAD'}
                      onChange={(e) => {
                        const newConfig = { ...selectedNode.config, tag: e.target.value };
                        const updated = nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, config: newConfig } : n
                        );
                        setNodes(updated);
                        setSelectedNode({ ...selectedNode, config: newConfig });
                      }}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Action</label>
                    <select
                      value={selectedNode.config?.action || 'ADD'}
                      onChange={(e) => {
                        const newConfig = { ...selectedNode.config, action: e.target.value };
                        const updated = nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, config: newConfig } : n
                        );
                        setNodes(updated);
                        setSelectedNode({ ...selectedNode, config: newConfig });
                      }}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900"
                    >
                      <option value="ADD">Add Tag to Contact</option>
                      <option value="REMOVE">Remove Tag from Contact</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedNode.type === 'ASSIGN_AGENT' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Routing Mode</label>
                    <select
                      value={selectedNode.config?.mode || 'ROUND_ROBIN'}
                      onChange={(e) => {
                        const newConfig = { ...selectedNode.config, mode: e.target.value };
                        const updated = nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, config: newConfig } : n
                        );
                        setNodes(updated);
                        setSelectedNode({ ...selectedNode, config: newConfig });
                      }}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900"
                    >
                      <option value="ROUND_ROBIN">Round Robin (Balanced)</option>
                      <option value="LEAST_ACTIVE">Least Active Agent</option>
                      <option value="SPECIFIC_AGENT">Specific Agent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Team / Department</label>
                    <input
                      type="text"
                      value={selectedNode.config?.team || 'Enterprise Sales Team'}
                      onChange={(e) => {
                        const newConfig = { ...selectedNode.config, team: e.target.value };
                        const updated = nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, config: newConfig } : n
                        );
                        setNodes(updated);
                        setSelectedNode({ ...selectedNode, config: newConfig });
                      }}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Raw JSON Config Viewer */}
              <div>
                <label className="block text-slate-500 font-bold mb-1">Active JSON Parameters</label>
                <div className="rounded-xl border border-slate-200 bg-slate-900 text-emerald-400 p-3 font-mono text-[11px] overflow-x-auto">
                  <pre>{JSON.stringify(selectedNode.config, null, 2)}</pre>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 p-2 text-xs font-bold text-rose-700 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Node</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-4 text-xs text-slate-400">
              Select any node on the canvas to inspect and edit its properties.
            </div>
          )}
        </div>
      </div>

      {/* PART 6: TEST SIMULATOR & STEP-BY-STEP EXECUTION LOGS MODAL */}
      {isTestSimulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 flex flex-col h-[600px] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900">
                  Workflow Simulation Runner &amp; Live Step Inspector
                </h3>
              </div>
              <button
                onClick={() => setIsTestSimulatorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Test Input Form */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 py-3 border-b border-slate-100 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Test Phone</label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-1.5 font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Contact Name</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-1.5 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Inbound Message</label>
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-1.5 text-slate-900 font-medium"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={handleRunSimulation}
                  disabled={isRunningTest}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 p-2 text-xs font-bold text-white shadow-xs"
                >
                  <Play className={`h-3.5 w-3.5 ${isRunningTest ? 'animate-spin' : 'fill-white'}`} />
                  <span>{isRunningTest ? 'Executing...' : 'Run Simulation'}</span>
                </button>
              </div>
            </div>

            {/* Suggested Trigger Chips */}
            <div className="py-2 flex items-center gap-1.5 text-[10px] overflow-x-auto border-b border-slate-100">
              <span className="font-bold text-slate-400">Quick Prompts:</span>
              {['pricing', 'demo', 'book demo for 100 users', 'talk to sales', 'help with support'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setTestMessage(chip)}
                  className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-mono transition-colors"
                >
                  "{chip}"
                </button>
              ))}
            </div>

            {/* Modal Body: Split Screen (Chat View Left, Step-by-Step Logs Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden pt-3">
              {/* Left 5 Cols: WhatsApp Chat Bubble Feed */}
              <div className="md:col-span-5 rounded-xl border border-slate-200 bg-slate-100/60 p-3 flex flex-col overflow-hidden">
                <div className="pb-2 border-b border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">WhatsApp Client View</span>
                  <span className="text-slate-400 font-mono text-[10px]">{testPhone}</span>
                </div>

                <div className="flex-1 overflow-y-auto py-2 space-y-2 text-xs">
                  {testChatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs whitespace-pre-wrap shadow-2xs ${
                          msg.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 7 Cols: Step-by-Step Execution Engine Logs */}
              <div className="md:col-span-7 rounded-xl border border-slate-200 bg-slate-900 text-slate-200 p-3 flex flex-col overflow-hidden">
                <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Execution Step Logs
                    </span>
                  </div>
                  {executionStatus && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        executionStatus === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : executionStatus === 'WAITING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      STATUS: {executionStatus}
                    </span>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto py-2 space-y-2 text-[11px] font-mono">
                  {executionLogs.length === 0 ? (
                    <div className="text-slate-500 py-8 text-center">
                      Click "Run Simulation" above to execute this workflow step-by-step through the native engine.
                    </div>
                  ) : (
                    executionLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400">
                            {log.summaryText || `Node #${log.stepNumber} — ${log.nodeTitle}`}
                          </span>
                          <span className="text-[10px] text-slate-400">{log.durationMs}ms</span>
                        </div>

                        {log.output && (
                          <div className="text-[10px] text-slate-300 bg-slate-950/60 rounded p-1.5 overflow-x-auto">
                            {log.output.messageSent && (
                              <p className="text-emerald-300">
                                <strong>Message:</strong> {log.output.messageSent}
                              </p>
                            )}
                            {log.output.decision && (
                              <p className="text-cyan-300">
                                <strong>Decision:</strong> {log.output.decision}
                              </p>
                            )}
                            {log.output.tag && (
                              <p className="text-pink-300">
                                <strong>Tagged:</strong> {log.output.tag}
                              </p>
                            )}
                            {log.output.assignedTo && (
                              <p className="text-purple-300">
                                <strong>Assigned:</strong> {log.output.assignedTo}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Variable Memory State */}
                {Object.keys(executionVariables).length > 0 && (
                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                    <span className="font-bold text-slate-300">Workflow Variables: </span>
                    <span className="font-mono text-emerald-400">
                      {JSON.stringify(executionVariables)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
