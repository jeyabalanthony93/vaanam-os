import React, { useState, useEffect, useRef } from 'react';
import { Bot, Network, Play, CircleDashed, Users, Briefcase, Cpu, LineChart, Palette, Globe, Shield, Database, Sparkles, BrainCircuit, Code, Settings, MessageSquare, BarChart, Save, RefreshCw, Layers, Upload, Zap, Activity, AlertTriangle, CheckCircle2, XCircle, Bell, Workflow, Wand2, Info, ArrowRight, DollarSign, TrendingUp, UserPlus, Phone, Video, Mic, Key, Terminal, Server, Lock, Monitor, Box, Mail, Fingerprint, ShieldAlert, Plug, Wifi, Clock, CheckSquare, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { Agent, AgentRole, AgentMetrics, AgentConfig, AgentWorkflow, AgentIntegration, AgentCapability, WorkstationState } from '../types';
import { simulateAgentResponse, generateAgentSystemPrompt, simulateLeadGeneration } from '../services/geminiService';

const INITIAL_AGENTS: Agent[] = [
    {
        id: 'founder-1', name: 'Co-Founder (Strategy)', role: AgentRole.FOUNDER, department: 'BOARD', status: 'WORKING', health: 'HEALTHY', logs: [],
        config: { 
            model: 'gemini-1.5-pro', temperature: 0.7, systemPrompt: 'You are the strategic founder...', tools: ['infrastructure_scale'], isFineTuned: true,
            capabilities: ['SERVER_ADMIN', 'AI_DATA'],
            manualIntegrations: [{id: 'int1', name: 'Badal Root Key', type: 'API_KEY', value: 'sk_live_...', status: 'CONNECTED'}]
        },
        metrics: { tokensPerSec: 145, successRate: 99.9, totalCost: 450.20, latency: 120, uptime: 100 },
        children: [], workflows: [], workstation: { osVersion: 'Megam OS 2.0 (Executive)', ipAddress: '10.254.0.1', uptime: '42d 12h', assets: [], securityLog: [], webhooks: [], installedSoftware: [] }
    },
    {
        id: 'head-it', name: 'Head IT & Infra', role: AgentRole.HEAD_IT, department: 'TECH', status: 'WORKING', health: 'HEALTHY', logs: [],
        config: { model: 'gemini-1.5-pro', temperature: 0.2, systemPrompt: 'Manage infra...', tools: ['fs_read'], isFineTuned: true, capabilities: ['SERVER_ADMIN'] },
        metrics: { tokensPerSec: 89, successRate: 98.5, totalCost: 210.50, latency: 85, uptime: 99.9 }
    },
    {
        id: 'vp-sales', name: 'VP Sales', role: AgentRole.VP_SALES, department: 'GROWTH', status: 'WORKING', health: 'WARNING', logs: [],
        config: { model: 'gemini-1.5-flash', temperature: 0.9, systemPrompt: 'Sell...', tools: ['email', 'mcp_linkedin', 'rag_crm'], isFineTuned: false },
        metrics: { tokensPerSec: 200, successRate: 92.0, totalCost: 150.00, latency: 45, uptime: 99.5, revenueGenerated: 125000, leadsGenerated: 420 }
    }
];

interface TaskPacket {
    id: string;
    name: string;
    progress: number; // 0-100
    stage: 'QUEUE' | 'PROCESSING' | 'VALIDATING' | 'DONE';
    agentId: string;
    detail?: string; // New field for extra context (e.g. Lead Name)
    tool?: string;   // New field for Tool Icon
}

const AgentView: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(INITIAL_AGENTS[0].id);
  const [viewMode, setViewMode] = useState<'MONITOR' | 'PIPELINE' | 'GROWTH' | 'WORKSTATION' | 'BUILDER' | 'TESTER'>('MONITOR');
  
  // Pipeline "Loop" State
  const [tasks, setTasks] = useState<TaskPacket[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  // Revenue & Alerts
  const [revenueStats, setRevenueStats] = useState({ totalRevenue: 170000, totalLeads: 570 });
  const [generatedLeads, setGeneratedLeads] = useState<any[]>([]);

  // Simulation Loop for Tasks (The "Loop to fill tasks")
  useEffect(() => {
      const interval = setInterval(async () => {
          // 1. Advance Tasks
          setTasks(prev => {
              let newTasks = prev.map(t => {
                  let newProgress = t.progress + (Math.random() * 15 + 5); 
                  let newStage = t.stage;

                  if (newProgress >= 100) {
                      if (t.stage === 'QUEUE') { newStage = 'PROCESSING'; newProgress = 0; }
                      else if (t.stage === 'PROCESSING') { newStage = 'VALIDATING'; newProgress = 0; }
                      else if (t.stage === 'VALIDATING') { newStage = 'DONE'; newProgress = 100; }
                  }
                  return { ...t, progress: newProgress, stage: newStage };
              });

              const doneTasks = newTasks.filter(t => t.stage === 'DONE');
              if (doneTasks.length > 0) {
                  setCompletedCount(c => c + doneTasks.length);
              }
              newTasks = newTasks.filter(t => t.stage !== 'DONE');

              // 2. Spawn new tasks (Loop generation)
              if (newTasks.length < 6 && Math.random() > 0.3) {
                  const agentIds = agents.map(a => a.id);
                  const randomAgentId = agentIds[Math.floor(Math.random() * agentIds.length)];
                  const randomAgent = agents.find(a => a.id === randomAgentId);
                  
                  let taskName = 'Routine Audit';
                  let detail = 'Checking Logs...';
                  let tool = 'Terminal';

                  if (randomAgent?.role === AgentRole.VP_SALES) {
                      taskName = 'Lead Generation';
                      detail = 'Querying MCP Database...';
                      tool = 'MCP';
                  } else if (randomAgent?.role === AgentRole.HEAD_IT) {
                      taskName = 'Security Scan';
                      detail = 'Neural Bridge Check...';
                      tool = 'Shield';
                  }

                  newTasks.push({
                      id: Date.now().toString() + Math.random(),
                      name: taskName,
                      progress: 0,
                      stage: 'QUEUE',
                      agentId: randomAgentId,
                      detail,
                      tool
                  });
              }
              return newTasks;
          });

          // 3. Simulate Lead Gen for Sales Agents
          const salesAgent = agents.find(a => a.role === AgentRole.VP_SALES);
          if (salesAgent && Math.random() > 0.7) {
             const newLeads = await simulateLeadGeneration();
             if (newLeads.length > 0) {
                 setGeneratedLeads(prev => [...newLeads, ...prev].slice(0, 10)); // Keep last 10
                 setRevenueStats(prev => ({
                     totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 500),
                     totalLeads: prev.totalLeads + newLeads.length
                 }));
             }
          }

      }, 800);
      return () => clearInterval(interval);
  }, [agents]);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  return (
    <div className="h-full flex flex-col bg-[#0b0f19] text-slate-200 overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex justify-between items-center shrink-0 z-10">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400 border border-teal-500/20">
                    <BrainCircuit size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Agent Command Center</h1>
                    <p className="text-slate-400 text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Neural Workforce Active
                    </p>
                </div>
            </div>
            
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 overflow-x-auto">
                {[
                    { id: 'MONITOR', icon: Activity, label: 'Monitor' },
                    { id: 'PIPELINE', icon: Layers, label: 'Auto-Ops' },
                    { id: 'GROWTH', icon: TrendingUp, label: 'Growth Engine' },
                    { id: 'WORKSTATION', icon: Monitor, label: 'Workstation' },
                    { id: 'BUILDER', icon: Code, label: 'Builder' },
                    { id: 'TESTER', icon: MessageSquare, label: 'Live Test' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setViewMode(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition whitespace-nowrap ${viewMode === tab.id ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white'}`}
                    >
                        {/* @ts-ignore */}
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col backdrop-blur-sm">
                <div className="p-4 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deployments ({agents.length})</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {agents.map(agent => (
                        <button
                            key={agent.id}
                            onClick={() => setSelectedAgentId(agent.id)}
                            className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition border ${selectedAgentId === agent.id ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' : 'border-transparent hover:bg-slate-800 text-slate-400'}`}
                        >
                            <div className="relative">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${selectedAgentId === agent.id ? 'bg-teal-500 text-slate-900' : 'bg-slate-800 text-slate-300'}`}>
                                    {agent.name.substring(0,2)}
                                </div>
                                {/* Task processing indicator dot */}
                                {tasks.some(t => t.agentId === agent.id && t.stage === 'PROCESSING') && (
                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900 animate-bounce"></div>
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <div className="font-bold text-xs truncate">{agent.name}</div>
                                <div className="text-[10px] opacity-70 truncate">{agent.role}</div>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="p-4 border-t border-slate-800 bg-gradient-to-b from-slate-900 to-black">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white font-mono">{revenueStats.totalLeads}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Total Leads Gen</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden bg-[#0b0f19] relative">
                
                {viewMode === 'PIPELINE' && (
                    <div className="h-full p-8 flex flex-col">
                        <div className="mb-8 flex justify-between items-end">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Automated Operations Pipeline</h2>
                                <p className="text-slate-400">Real-time visualization of multi-agent task execution loops.</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-green-400 font-mono">{completedCount}</div>
                                <div className="text-xs text-slate-500 uppercase font-bold">Tasks Completed</div>
                            </div>
                        </div>

                        {/* Pipeline Visualization */}
                        <div className="flex-1 grid grid-cols-3 gap-8 relative">
                            {/* Connectors */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 -translate-y-1/2"></div>

                            {['QUEUE', 'PROCESSING', 'VALIDATING'].map((stage, i) => (
                                <div key={stage} className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col relative overflow-hidden h-full backdrop-blur-sm">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                                        <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-slate-400' : i === 1 ? 'bg-blue-500 animate-pulse' : 'bg-purple-500'}`}></div>
                                        <h3 className="font-bold text-slate-300 uppercase tracking-wider text-sm">{stage}</h3>
                                        <span className="ml-auto text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">
                                            {tasks.filter(t => t.stage === stage).length}
                                        </span>
                                    </div>

                                    <div className="flex-1 space-y-3 overflow-y-auto">
                                        {tasks.filter(t => t.stage === stage).map(task => (
                                            <div key={task.id} className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-lg relative overflow-hidden animate-in slide-in-from-left duration-300 group">
                                                <div className="flex justify-between items-start mb-2 relative z-10">
                                                    <span className="font-bold text-xs text-white truncate w-32">{task.name}</span>
                                                    <span className="text-[10px] text-slate-500 font-mono">{task.id.slice(-4)}</span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 mb-2 relative z-10 flex items-center justify-between">
                                                    <span className="flex items-center gap-1"><Bot size={10}/> {agents.find(a => a.id === task.agentId)?.name || 'System'}</span>
                                                    {task.tool === 'MCP' ? <span className="bg-yellow-900/30 text-yellow-400 px-1 rounded">MCP</span> : <span className="bg-slate-700 px-1 rounded">{task.tool}</span>}
                                                </div>
                                                <div className="text-[10px] text-slate-500 truncate relative z-10 italic mb-2">{task.detail}</div>
                                                
                                                {/* Progress Bar (Loop filling task) */}
                                                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden relative z-10">
                                                    <div 
                                                        className={`h-full transition-all duration-500 ${stage === 'PROCESSING' ? 'bg-blue-500' : stage === 'VALIDATING' ? 'bg-purple-500' : 'bg-slate-500'}`}
                                                        style={{width: `${task.progress}%`}}
                                                    ></div>
                                                </div>
                                                {/* Background Glow */}
                                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition duration-300 ${stage === 'PROCESSING' ? 'bg-blue-500' : stage === 'VALIDATING' ? 'bg-purple-500' : 'bg-slate-500'}`}></div>
                                            </div>
                                        ))}
                                        {tasks.filter(t => t.stage === stage).length === 0 && (
                                            <div className="text-center text-slate-600 text-xs italic py-10">Waiting for input stream...</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {viewMode === 'GROWTH' && (
                    <div className="h-full p-8 overflow-y-auto">
                        <div className="max-w-6xl mx-auto space-y-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><TrendingUp size={24} className="text-green-400"/> Sales & Growth Engine</h2>
                                    <p className="text-slate-400">Autonomous Lead Generation using Badal RAG & MCP Tools.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-right">
                                        <div className="text-[10px] text-slate-500 font-bold uppercase">Pipeline Value</div>
                                        <div className="text-xl font-mono text-green-400">${revenueStats.totalRevenue.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-right">
                                        <div className="text-[10px] text-slate-500 font-bold uppercase">Leads Found</div>
                                        <div className="text-xl font-mono text-blue-400">{revenueStats.totalLeads}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                    <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Database size={18} className="text-purple-400"/> Live Lead Feed</h3>
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                        {generatedLeads.map((lead, i) => (
                                            <div key={i} className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex justify-between items-center animate-in fade-in slide-in-from-right duration-500">
                                                <div>
                                                    <div className="font-bold text-white text-sm">{lead.company}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-2">
                                                        <span className="bg-slate-800 px-1.5 rounded">{lead.source}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-lg font-bold ${lead.status === 'HOT' ? 'text-red-500' : lead.status === 'WARM' ? 'text-orange-400' : 'text-blue-400'}`}>{lead.status}</div>
                                                    <div className="text-[10px] text-slate-500">{lead.score}% Match</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                                    <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Globe size={18} className="text-blue-400"/> Active Sources (MCP)</h3>
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-900/20 text-blue-400 rounded"><Globe size={16}/></div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-200">LinkedIn Scraper</div>
                                                    <div className="text-[10px] text-slate-500">Tool ID: mcp_linkedin_v2</div>
                                                </div>
                                            </div>
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-900/20 text-purple-400 rounded"><Database size={16}/></div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-200">RAG Knowledge Base</div>
                                                    <div className="text-[10px] text-slate-500">Source: CRM_Export_2024.csv</div>
                                                </div>
                                            </div>
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-900/20 text-orange-400 rounded"><Search size={16}/></div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-200">Google Search Grounding</div>
                                                    <div className="text-[10px] text-slate-500">Topic: Series A Funding</div>
                                                </div>
                                            </div>
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                                        <p className="text-xs text-slate-500">Agents are autonomously cross-referencing RAG data with live web searches via MCP.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'MONITOR' && (
                    <div className="h-full p-8 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Agent Brain Visualizer */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col">
                                <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Zap size={18} className="text-yellow-400"/> Agent OODA Loop</h3>
                                <div className="flex-1 flex items-center justify-center relative">
                                    {/* Central Processor */}
                                    <div className="w-32 h-32 rounded-full border-4 border-slate-700 flex items-center justify-center relative z-10 bg-slate-900 shadow-[0_0_30px_rgba(20,184,166,0.2)]">
                                        <div className="text-center">
                                            <Bot size={32} className="mx-auto text-teal-400 mb-1"/>
                                            <div className="text-[10px] font-bold text-slate-400">NEURAL CORE</div>
                                        </div>
                                        {/* Orbiting particles */}
                                        <div className="absolute inset-0 border-2 border-teal-500/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                                        <div className="absolute inset-[-10px] border border-dashed border-slate-600 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
                                    </div>

                                    {/* Nodes */}
                                    <div className="absolute top-0 text-center">
                                        <div className="bg-slate-800 px-3 py-1 rounded text-xs font-bold text-blue-400 mb-2 border border-blue-500/30">OBSERVE</div>
                                        <div className="w-px h-8 bg-blue-500/50 mx-auto"></div>
                                    </div>
                                    <div className="absolute right-0 text-center flex items-center">
                                        <div className="w-8 h-px bg-purple-500/50"></div>
                                        <div className="bg-slate-800 px-3 py-1 rounded text-xs font-bold text-purple-400 border border-purple-500/30 ml-2">ORIENT</div>
                                    </div>
                                    <div className="absolute bottom-0 text-center">
                                        <div className="w-px h-8 bg-orange-500/50 mx-auto"></div>
                                        <div className="bg-slate-800 px-3 py-1 rounded text-xs font-bold text-orange-400 mt-2 border border-orange-500/30">DECIDE</div>
                                    </div>
                                    <div className="absolute left-0 text-center flex items-center">
                                        <div className="bg-slate-800 px-3 py-1 rounded text-xs font-bold text-green-400 border border-green-500/30 mr-2">ACT</div>
                                        <div className="w-8 h-px bg-green-500/50"></div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-xs text-slate-400 font-mono">
                                        Current State: <span className="text-teal-400 animate-pulse">PROCESSING_CONTEXT_WINDOW</span>
                                    </p>
                                </div>
                            </div>

                            {/* Live Metrics */}
                            <div className="flex flex-col gap-6">
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Throughput (Tokens/sec)</h4>
                                    <div className="h-32">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={[
                                                {t:1, v: 120}, {t:2, v: 135}, {t:3, v: 110}, {t:4, v: 150}, {t:5, v: 145}, {t:6, v: 160}
                                            ]}>
                                                <defs>
                                                    <linearGradient id="colorTok" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
                                                <XAxis hide />
                                                <YAxis hide />
                                                <Area type="monotone" dataKey="v" stroke="#14b8a6" fill="url(#colorTok)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                        <div className="text-[10px] text-slate-500 font-bold uppercase">Success Rate</div>
                                        <div className="text-3xl font-bold text-white mt-1">99.2%</div>
                                    </div>
                                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                        <div className="text-[10px] text-slate-500 font-bold uppercase">Avg Latency</div>
                                        <div className="text-3xl font-bold text-white mt-1">45ms</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Placeholders for other views to keep the structure intact */}
                {(viewMode === 'WORKSTATION' || viewMode === 'BUILDER' || viewMode === 'TESTER') && (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        {viewMode} View (See previous implementation for full code)
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};

export default AgentView;