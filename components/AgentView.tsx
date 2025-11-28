


import React, { useState, useEffect, useRef } from 'react';
import { Bot, Network, Play, CircleDashed, Users, Briefcase, Cpu, LineChart, Palette, Globe, Shield, Database, Sparkles, BrainCircuit, Code, Settings, MessageSquare, BarChart, Save, RefreshCw, Layers, Upload, Zap, Activity, AlertTriangle, CheckCircle2, XCircle, Bell, Workflow, Wand2, Info, ArrowRight, DollarSign, TrendingUp, UserPlus, Phone, Video, Mic, Key, Terminal, Server, Lock, Monitor, Box, Mail, Fingerprint, ShieldAlert, Plug, Wifi } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { Agent, AgentRole, AgentMetrics, AgentConfig, AgentWorkflow, AgentIntegration, AgentCapability, WorkstationState } from '../types';
import { simulateAgentResponse, generateAgentSystemPrompt } from '../services/geminiService';

// Extended Mock Data for Agents
const INITIAL_AGENTS: Agent[] = [
    {
        id: 'founder-1', name: 'Co-Founder (Strategy)', role: AgentRole.FOUNDER, department: 'BOARD', status: 'WORKING', health: 'HEALTHY', logs: [],
        config: { 
            model: 'gemini-1.5-pro', temperature: 0.7, systemPrompt: 'You are the strategic founder...', tools: ['infrastructure_scale'], isFineTuned: true,
            capabilities: ['SERVER_ADMIN', 'AI_DATA'],
            manualIntegrations: [{id: 'int1', name: 'Badal Root Key', type: 'API_KEY', value: 'sk_live_...', status: 'CONNECTED'}]
        },
        metrics: { tokensPerSec: 145, successRate: 99.9, totalCost: 450.20, latency: 120, uptime: 100 },
        children: [],
        workflows: [],
        workstation: {
            osVersion: 'Megam OS 2.0 (Executive Build)',
            ipAddress: '10.254.0.1',
            uptime: '42d 12h',
            assets: [
                {id: 'a1', type: 'EMAIL', name: 'founder@sucksaas.com', detail: 'Admin Privileges', status: 'ACTIVE'},
                {id: 'a2', type: 'VIRTUAL_PC', name: 'Exec-VPC-01', detail: '16 vCPU / 64GB RAM', status: 'ACTIVE'},
                {id: 'a3', type: 'LICENSE', name: 'Badal Cloud Enterprise', detail: 'Lifetime', status: 'ACTIVE'}
            ],
            securityLog: [],
            webhooks: [{url: 'https://api.megam.io/hooks/strategy', active: true, event: 'on_decision'}],
            installedSoftware: ['Megam Mail', 'Boardroom Analytics', 'Sentinel DLP', 'Neural Bridge Console']
        }
    },
    {
        id: 'head-it', name: 'Head IT & Infra', role: AgentRole.HEAD_IT, department: 'TECH', status: 'WORKING', health: 'HEALTHY', logs: [],
        config: { 
            model: 'gemini-1.5-pro', temperature: 0.2, systemPrompt: 'You manage the cloud infrastructure...', tools: ['megam_fs_read', 'infrastructure_scale'], isFineTuned: true,
            capabilities: ['SERVER_ADMIN', 'OS_KERNEL', 'SECURITY']
        },
        metrics: { tokensPerSec: 89, successRate: 98.5, totalCost: 210.50, latency: 85, uptime: 99.9 },
        workstation: {
            osVersion: 'Megam OS 2.0 (Server Core)',
            ipAddress: '10.254.0.5',
            uptime: '120d 4h',
            assets: [
                {id: 'a1', type: 'EMAIL', name: 'it.head@sucksaas.com', detail: 'Infra Alerts', status: 'ACTIVE'},
                {id: 'a2', type: 'VIRTUAL_PC', name: 'SysAdmin-Box', detail: '8 vCPU / 32GB RAM', status: 'ACTIVE'}
            ],
            securityLog: [],
            webhooks: [],
            installedSoftware: ['Terminal', 'Server Admin', 'Network Monitor', 'Sentinel DLP']
        }
    },
     {
        id: 'vp-sales', name: 'VP Sales', role: AgentRole.VP_SALES, department: 'GROWTH', status: 'MEETING', health: 'WARNING', logs: [],
        config: { model: 'gemini-1.5-flash', temperature: 0.9, systemPrompt: 'You are an aggressive sales leader...', tools: ['web_search_google', 'email_send'], isFineTuned: false },
        metrics: { tokensPerSec: 200, successRate: 92.0, totalCost: 150.00, latency: 45, uptime: 99.5, revenueGenerated: 125000, leadsGenerated: 420 },
        workstation: {
            osVersion: 'Megam OS 2.0 (Sales)',
            ipAddress: '10.254.0.12',
            uptime: '5d 2h',
            assets: [
                {id: 'a1', type: 'EMAIL', name: 'sales@sucksaas.com', detail: 'CRM Integrated', status: 'ACTIVE'},
                {id: 'a2', type: 'VIRTUAL_PC', name: 'Sales-VDI', detail: '4 vCPU / 16GB RAM', status: 'ACTIVE'}
            ],
            securityLog: [],
            webhooks: [],
            installedSoftware: ['Megam CRM', 'Mail', 'VoIP Softphone']
        }
    },
    // New Agents
    {
        id: 'devops-1', name: 'DevOps Lead', role: AgentRole.DEVOPS_ENGINEER, department: 'TECH', status: 'WORKING', health: 'HEALTHY', logs: [],
        config: { model: 'llama-3-70b', temperature: 0.1, systemPrompt: 'Maintain CI/CD pipelines...', tools: ['kubectl', 'docker'], isFineTuned: true, capabilities: ['DEVOPS', 'SERVER_ADMIN'] },
        metrics: { tokensPerSec: 120, successRate: 99.5, totalCost: 50.00, latency: 60, uptime: 100 },
        workstation: {
            osVersion: 'Megam OS 2.0 (Dev)',
            ipAddress: '10.254.0.44',
            uptime: '12d 1h',
            assets: [],
            securityLog: [],
            webhooks: [],
            installedSoftware: ['VS Code', 'Docker', 'Kubectl']
        }
    },
    {
        id: 'ai-research', name: 'Lead AI Researcher', role: AgentRole.AI_RESEARCHER, department: 'RESEARCH', status: 'THINKING', health: 'HEALTHY', logs: [],
        config: { model: 'gemini-1.5-pro', temperature: 0.8, systemPrompt: 'Innovate on Neural Bridge architecture...', tools: ['arxiv_search', 'python_exec'], isFineTuned: true, capabilities: ['AI_DATA'] },
        metrics: { tokensPerSec: 90, successRate: 95.0, totalCost: 300.00, latency: 200, uptime: 98.0 },
    },
    {
        id: 'sales-eng', name: 'IT Sales Engineer', role: AgentRole.IT_SALES_ENGINEER, department: 'GROWTH', status: 'WORKING', health: 'HEALTHY', logs: [],
        config: { model: 'gemini-1.5-flash', temperature: 0.6, systemPrompt: 'Demo technical products to leads...', tools: ['email_send', 'calendar'], isFineTuned: false, capabilities: ['VOIP_COMMS'] },
        metrics: { tokensPerSec: 150, successRate: 97.0, totalCost: 80.00, latency: 50, uptime: 99.0, revenueGenerated: 45000, leadsGenerated: 150 },
    },
    {
        id: 'hr-head', name: 'Head of HR', role: AgentRole.HEAD_HR, department: 'OPS', status: 'WORKING', health: 'HEALTHY', logs: [],
        config: { model: 'gemini-1.5-flash', temperature: 0.5, systemPrompt: 'Manage talent acquisition...', tools: ['email_send', 'internal_db'], isFineTuned: true },
        metrics: { tokensPerSec: 50, successRate: 100, totalCost: 20.00, latency: 100, uptime: 100 },
    },
    {
        id: 'kernel-arch', name: 'Vaanam Kernel Arch', role: AgentRole.KERNEL_ARCHITECT, department: 'TECH', status: 'WORKING', health: 'HEALTHY', logs: [],
        config: { 
            model: 'gemini-1.5-pro', temperature: 0.1, systemPrompt: 'Optimize Vaanam OS Kernel scheduling...', tools: ['kernel_debug', 'gcc'], isFineTuned: true, 
            capabilities: ['OS_KERNEL'],
            manualIntegrations: [{id: 'k1', name: 'Kernel SSH Root', type: 'SSH', value: 'root@10.0.0.5', status: 'CONNECTED'}]
        },
        metrics: { tokensPerSec: 110, successRate: 99.9, totalCost: 120.00, latency: 40, uptime: 99.99 },
    },
    {
        id: 'voip-eng', name: 'VoIP Systems Eng', role: AgentRole.VOIP_ENGINEER, department: 'COMMS', status: 'ON_CALL', health: 'HEALTHY', logs: [],
        config: { 
            model: 'gemini-1.5-flash', temperature: 0.4, systemPrompt: 'Manage SIP trunks and WebRTC gateways...', tools: ['sip_monitor', 'webrtc_debug'], isFineTuned: true,
            capabilities: ['VOIP_COMMS'],
            manualIntegrations: [{id: 'v1', name: 'Twilio SIP Trunk', type: 'SIP_VOIP', value: 'sip:megam.twilio.com', status: 'CONNECTED'}]
        },
        metrics: { tokensPerSec: 130, successRate: 98.0, totalCost: 90.00, latency: 30, uptime: 99.5 },
    }
];

interface Alert {
    id: string;
    agentId: string;
    agentName: string;
    message: string;
    severity: 'WARNING' | 'CRITICAL' | 'INFO' | 'SUCCESS';
    timestamp: string;
}

const AgentView: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(INITIAL_AGENTS[0].id);
  const [viewMode, setViewMode] = useState<'MONITOR' | 'BUILDER' | 'WORKFLOW' | 'TESTER' | 'ANALYTICS' | 'WORKSTATION'>('MONITOR');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [revenueStats, setRevenueStats] = useState({ totalRevenue: 170000, totalLeads: 570 });
  
  // Builder State
  const [copilotGoal, setCopilotGoal] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [newIntegration, setNewIntegration] = useState<{name: string, type: string, value: string}>({ name: '', type: 'API_KEY', value: '' });

  // Workstation State
  const [workstationScanning, setWorkstationScanning] = useState(false);

  // Selected Agent Helper
  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
        setAgents(prev => prev.map(a => {
            const newMetric = { ...a.metrics! };
            let newStatus = a.status;
            let newHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL' = 'HEALTHY';
            
            // Randomly fluctuate metrics
            if (Math.random() > 0.5) {
                newMetric.tokensPerSec = Math.max(50, Math.min(300, newMetric.tokensPerSec + (Math.random() * 40 - 20)));
                
                // Simulate Revenue Generation
                if (a.department === 'GROWTH' && Math.random() > 0.9) {
                    const newRev = Math.floor(Math.random() * 500);
                    newMetric.revenueGenerated = (newMetric.revenueGenerated || 0) + newRev;
                    newMetric.leadsGenerated = (newMetric.leadsGenerated || 0) + 1;
                    setRevenueStats(s => ({ 
                        totalRevenue: s.totalRevenue + newRev, 
                        totalLeads: s.totalLeads + 1 
                    }));
                }

                // Simulate occasional issues
                if (Math.random() > 0.98) {
                    newMetric.successRate = Math.max(70, newMetric.successRate - 5); 
                    newMetric.latency = Math.min(500, newMetric.latency + 100); 
                } else {
                    newMetric.successRate = Math.min(100, newMetric.successRate + 1); 
                    newMetric.latency = Math.max(20, newMetric.latency - 10); 
                }
            }

            // Determine Health
            if (newMetric.successRate < 85 || newMetric.latency > 250) {
                newHealth = 'CRITICAL';
            } else if (newMetric.successRate < 95 || newMetric.latency > 150) {
                newHealth = 'WARNING';
            }

            return { ...a, metrics: newMetric, health: newHealth };
        }));

        // HR Notifications Simulation
        if (Math.random() > 0.995) {
            const roles = [AgentRole.DEVOPS_ENGINEER, AgentRole.AI_RESEARCHER, AgentRole.IT_SALES_ENGINEER];
            const newRole = roles[Math.floor(Math.random() * roles.length)];
            const newAlert: Alert = {
                id: Date.now().toString(),
                agentId: 'hr-head',
                agentName: 'Head of HR',
                severity: 'SUCCESS',
                message: `New Joining Alert: Deployed new ${newRole} agent to workforce.`,
                timestamp: new Date().toLocaleTimeString()
            };
            setAlerts(prev => [newAlert, ...prev].slice(0, 10));
        }

    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateConfig = (newConfig: Partial<AgentConfig>) => {
      setAgents(prev => prev.map(a => a.id === selectedAgentId ? { ...a, config: { ...a.config!, ...newConfig } } : a));
  };

  const handleAddIntegration = () => {
      if (!newIntegration.name || !newIntegration.value) return;
      const integration: AgentIntegration = {
          id: Date.now().toString(),
          name: newIntegration.name,
          type: newIntegration.type as any,
          value: newIntegration.value,
          status: 'CONNECTED'
      };
      const currentIntegrations = selectedAgent.config?.manualIntegrations || [];
      handleUpdateConfig({ manualIntegrations: [...currentIntegrations, integration] });
      setNewIntegration({ name: '', type: 'API_KEY', value: '' });
  };

  const toggleCapability = (cap: AgentCapability) => {
      const currentCaps = selectedAgent.config?.capabilities || [];
      if (currentCaps.includes(cap)) {
          handleUpdateConfig({ capabilities: currentCaps.filter(c => c !== cap) });
      } else {
          handleUpdateConfig({ capabilities: [...currentCaps, cap] });
      }
  };

  const generatePrompt = async () => {
      if (!copilotGoal.trim()) return;
      setIsGeneratingPrompt(true);
      // Pass current prompt to allow refinement
      const currentPrompt = selectedAgent.config?.systemPrompt || '';
      const prompt = await generateAgentSystemPrompt(copilotGoal, selectedAgent.role as string, currentPrompt);
      handleUpdateConfig({ systemPrompt: prompt });
      setIsGeneratingPrompt(false);
      setCopilotGoal(''); // Clear input after successful generation
  };

  const runWorkstationScan = () => {
      setWorkstationScanning(true);
      setTimeout(() => {
          setWorkstationScanning(false);
          // Add a mock security event
          if (selectedAgent.workstation) {
              const newEvent: any = {
                  id: Date.now().toString(),
                  severity: Math.random() > 0.8 ? 'HIGH' : 'LOW',
                  type: 'QUALITY_CHECK',
                  description: 'Routine integrity scan completed. No breaches found.',
                  timestamp: new Date().toLocaleTimeString(),
                  resolved: true
              };
              // Update state logic would go here in a real app, utilizing setAgents deep update
          }
      }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                    <BrainCircuit size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Agent Development Environment</h1>
                    <p className="text-slate-400 text-xs">Digital Employee Management • Vaanam OS Native</p>
                </div>
            </div>
            
            {/* Revenue Ticker */}
            <div className="hidden lg:flex items-center gap-6 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Live Revenue</span>
                    <span className="text-green-400 font-mono font-bold flex items-center gap-1"><DollarSign size={14}/> {revenueStats.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Leads Generated</span>
                    <span className="text-blue-400 font-mono font-bold flex items-center gap-1"><TrendingUp size={14}/> {revenueStats.totalLeads}</span>
                </div>
            </div>

            <div className="flex bg-slate-800 rounded-lg p-1">
                {[
                    { id: 'MONITOR', icon: Activity, label: 'Monitor' },
                    { id: 'WORKSTATION', icon: Monitor, label: 'Workstation' },
                    { id: 'BUILDER', icon: Code, label: 'Builder' },
                    { id: 'WORKFLOW', icon: Workflow, label: 'Workflow' },
                    { id: 'TESTER', icon: MessageSquare, label: 'Live Tester' },
                    { id: 'ANALYTICS', icon: BarChart, label: 'Performance' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setViewMode(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition ${viewMode === tab.id ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar: Agent List */}
            <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Active Agents ({agents.length})</span>
                    <button className="text-teal-400 hover:text-teal-300"><Settings size={14}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {agents.map(agent => (
                        <button
                            key={agent.id}
                            onClick={() => setSelectedAgentId(agent.id)}
                            className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition ${selectedAgentId === agent.id ? 'bg-teal-500/10 border border-teal-500/30 text-teal-400' : 'hover:bg-slate-800 text-slate-400'}`}
                        >
                            <div className="relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${selectedAgentId === agent.id ? 'bg-teal-500 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>
                                    {agent.name.substring(0,2)}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 flex items-center justify-center ${
                                    agent.health === 'HEALTHY' ? 'bg-green-500' :
                                    agent.health === 'WARNING' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}>
                                    {agent.health === 'WARNING' && <div className="w-1 h-1 bg-black rounded-full"></div>}
                                    {agent.health === 'CRITICAL' && <XCircle size={8} className="text-black"/>}
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <div className="font-bold text-sm truncate">{agent.name}</div>
                                <div className="text-[10px] opacity-70 truncate">{agent.role}</div>
                            </div>
                        </button>
                    ))}
                    <button className="w-full border border-dashed border-slate-700 p-3 rounded-lg text-slate-500 text-xs font-bold hover:bg-slate-800 hover:border-slate-500 hover:text-slate-300 transition mt-4">
                        + Deploy New Agent
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden bg-slate-950 relative">
                
                {/* 1. MONITOR VIEW */}
                {viewMode === 'MONITOR' && (
                    <div className="h-full p-8 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Health & Alerts */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Bell size={18} className="text-yellow-400"/> Live Health & Alerts
                                </h3>
                                <div className="flex-1 min-h-[200px] bg-black/20 rounded-lg border border-slate-800 overflow-hidden flex flex-col">
                                    {alerts.length === 0 ? (
                                        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                                            <div className="text-center">
                                                <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500/50"/>
                                                <p>All Systems Nominal</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                            {alerts.map(alert => (
                                                <div key={alert.id} className={`p-3 rounded border flex items-start gap-3 ${
                                                    alert.severity === 'CRITICAL' 
                                                    ? 'bg-red-900/10 border-red-900/30 text-red-400' 
                                                    : alert.severity === 'WARNING' 
                                                    ? 'bg-yellow-900/10 border-yellow-900/30 text-yellow-400'
                                                    : 'bg-green-900/10 border-green-900/30 text-green-400'
                                                }`}>
                                                    {alert.severity === 'SUCCESS' ? <UserPlus size={16}/> : <AlertTriangle size={16} className="mt-0.5 shrink-0"/>}
                                                    <div>
                                                        <div className="text-xs font-bold">{alert.agentName}</div>
                                                        <div className="text-xs opacity-90">{alert.message}</div>
                                                        <div className="text-[10px] opacity-50 mt-1">{alert.timestamp}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Live Feed */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity size={18} className="text-green-400"/> Activity Stream</h3>
                                <div className="space-y-3 font-mono text-xs max-h-[250px] overflow-y-auto">
                                    {[1,2,3,4,5].map(i => (
                                        <div key={i} className="p-2 bg-black/20 rounded border border-white/5 text-slate-300">
                                            <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> <span className="text-teal-400 font-bold">{selectedAgent.name}:</span> Processing input chunk {i}/5...
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Integration Status (Manual Mode) */}
                        {selectedAgent.config?.manualIntegrations && selectedAgent.config.manualIntegrations.length > 0 && (
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Key size={18} className="text-orange-400"/> Manual Integration Status</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {selectedAgent.config.manualIntegrations.map(int => (
                                        <div key={int.id} className="bg-slate-950 p-3 rounded border border-slate-800 flex items-center justify-between">
                                            <div>
                                                <div className="text-xs font-bold text-slate-300">{int.name}</div>
                                                <div className="text-[10px] text-slate-500">{int.type}</div>
                                            </div>
                                            <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20">{int.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Hierarchy Status */}
                         <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Layers size={18} className="text-purple-400"/> Operational Hierarchy</h3>
                            <div className="flex flex-col gap-4 items-center justify-center h-64 border border-dashed border-slate-800 rounded bg-slate-950/50 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                                <div className={`p-4 border rounded-xl text-center min-w-[200px] z-10 transition-colors duration-500 ${
                                    selectedAgent.health === 'CRITICAL' ? 'bg-red-900/20 border-red-500' :
                                    selectedAgent.health === 'WARNING' ? 'bg-yellow-900/20 border-yellow-500' :
                                    'bg-indigo-900/30 border-indigo-500/50'
                                }`}>
                                    <div className={`font-bold ${
                                        selectedAgent.health === 'CRITICAL' ? 'text-red-400' :
                                        selectedAgent.health === 'WARNING' ? 'text-yellow-400' : 'text-indigo-300'
                                    }`}>{selectedAgent.name}</div>
                                    <div className="text-xs text-indigo-400/70">{selectedAgent.role}</div>
                                    <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded inline-block ${
                                         selectedAgent.health === 'CRITICAL' ? 'bg-red-500 text-white' :
                                         selectedAgent.health === 'WARNING' ? 'bg-yellow-500 text-black' :
                                         'bg-green-500 text-black'
                                    }`}>{selectedAgent.health}</div>
                                </div>
                                <div className="h-8 w-px bg-slate-700"></div>
                                <div className="flex gap-4">
                                    <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-slate-400">Sub-Agent Alpha</div>
                                    <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-slate-400">Sub-Agent Beta</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. WORKSTATION VIEW (Virtual Desktop) */}
                {viewMode === 'WORKSTATION' && (
                    <div className="h-full flex flex-col p-6">
                        {/* Remote Connection Header */}
                        <div className="bg-blue-900 text-white px-4 py-2 rounded-t-xl flex justify-between items-center text-xs font-bold shadow-lg border border-blue-800 border-b-0">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                Connected: {selectedAgent.workstation?.ipAddress || '10.254.x.x'} - {selectedAgent.name}
                            </div>
                            <div className="flex gap-4 opacity-80">
                                <span>{selectedAgent.workstation?.osVersion || 'Megam OS 2.0'}</span>
                                <span className="flex items-center gap-1"><Wifi size={10}/> 1Gbps</span>
                            </div>
                        </div>

                        {/* Desktop Area */}
                        <div className="flex-1 bg-[#0f172a] border-x border-b border-slate-700 rounded-b-xl relative overflow-hidden shadow-2xl p-8 flex gap-8">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>

                            {selectedAgent.workstation ? (
                                <>
                                    {/* Left Column: System & Assets */}
                                    <div className="w-1/3 flex flex-col gap-6 z-10">
                                        
                                        {/* System Info Card */}
                                        <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-6 rounded-xl shadow-lg">
                                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Server size={16} className="text-blue-400"/> Virtual System</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                                                    <span className="text-slate-400">Uptime</span>
                                                    <span className="text-white font-mono">{selectedAgent.workstation.uptime}</span>
                                                </div>
                                                <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                                                    <span className="text-slate-400">Assigned IP</span>
                                                    <span className="text-white font-mono">{selectedAgent.workstation.ipAddress}</span>
                                                </div>
                                                <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                                                    <span className="text-slate-400">OS Build</span>
                                                    <span className="text-white font-mono">{selectedAgent.workstation.osVersion}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Asset Inventory */}
                                        <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-6 rounded-xl shadow-lg flex-1">
                                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Briefcase size={16} className="text-orange-400"/> Asset Inventory</h3>
                                            <div className="space-y-3">
                                                {selectedAgent.workstation.assets.map(asset => (
                                                    <div key={asset.id} className="bg-slate-950 p-3 rounded border border-slate-800 flex items-start gap-3">
                                                        <div className={`p-2 rounded ${asset.type === 'EMAIL' ? 'bg-blue-900/30 text-blue-400' : asset.type === 'VIRTUAL_PC' ? 'bg-purple-900/30 text-purple-400' : 'bg-green-900/30 text-green-400'}`}>
                                                            {asset.type === 'EMAIL' ? <Mail size={14}/> : asset.type === 'VIRTUAL_PC' ? <Monitor size={14}/> : <Key size={14}/>}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-white">{asset.name}</div>
                                                            <div className="text-[10px] text-slate-500">{asset.detail}</div>
                                                        </div>
                                                        <span className="ml-auto text-[10px] font-bold text-green-500 bg-green-900/20 px-1.5 py-0.5 rounded">{asset.status}</span>
                                                    </div>
                                                ))}
                                                <button className="w-full py-2 border border-dashed border-slate-700 rounded text-slate-500 text-xs hover:bg-slate-800 hover:text-white transition">
                                                    + Assign New Asset
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Security & Productivity */}
                                    <div className="flex-1 flex flex-col gap-6 z-10">
                                        
                                        {/* Sentinel DLP Monitor */}
                                        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-red-900/30 p-6 rounded-xl shadow-lg relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={64}/></div>
                                            <div className="flex justify-between items-center mb-6 relative z-10">
                                                <h3 className="text-sm font-bold text-white flex items-center gap-2"><ShieldAlert size={16} className="text-red-500"/> Sentinel DLP Monitor</h3>
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20 font-bold uppercase tracking-wider">Active Protection</span>
                                                    <button onClick={runWorkstationScan} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 hover:text-white flex items-center gap-1">
                                                        {workstationScanning ? <RefreshCw size={10} className="animate-spin"/> : <RefreshCw size={10}/>} Scan
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
                                                <div className="bg-black/40 p-3 rounded border border-slate-800 text-center">
                                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Data Breaches</div>
                                                    <div className="text-xl font-bold text-green-500">0</div>
                                                </div>
                                                <div className="bg-black/40 p-3 rounded border border-slate-800 text-center">
                                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Policy Violations</div>
                                                    <div className="text-xl font-bold text-yellow-500">2</div>
                                                </div>
                                                <div className="bg-black/40 p-3 rounded border border-slate-800 text-center">
                                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Quality Score</div>
                                                    <div className="text-xl font-bold text-blue-500">98/100</div>
                                                </div>
                                            </div>

                                            <div className="bg-black/40 rounded border border-slate-800 p-3 h-32 overflow-y-auto font-mono text-[10px] text-slate-400 relative z-10">
                                                <div className="text-green-500">[SENTINEL] System integrity verified.</div>
                                                <div>[LOG] Email traffic monitored. No sensitive PII detected.</div>
                                                <div>[LOG] API Key usage within limits.</div>
                                                {workstationScanning && <div className="text-yellow-500 animate-pulse">[SCAN] Performing deep packet inspection...</div>}
                                            </div>
                                        </div>

                                        {/* Config Hub */}
                                        <div className="flex-1 bg-slate-900/90 backdrop-blur border border-slate-700 p-6 rounded-xl shadow-lg">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Plug size={16} className="text-teal-400"/> Configuration Hub</h3>
                                                <button className="text-xs text-teal-400 hover:underline">Manage Webhooks</button>
                                            </div>
                                            <div className="space-y-2">
                                                {selectedAgent.workstation.webhooks.map((hook, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full ${hook.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                            <div>
                                                                <div className="text-xs font-bold text-white truncate max-w-[200px]">{hook.url}</div>
                                                                <div className="text-[10px] text-slate-500">Event: {hook.event}</div>
                                                            </div>
                                                        </div>
                                                        <button className="text-slate-500 hover:text-white"><Settings size={12}/></button>
                                                    </div>
                                                ))}
                                                {selectedAgent.workstation.webhooks.length === 0 && (
                                                    <div className="text-center text-slate-500 text-xs py-4">No active webhooks configured.</div>
                                                )}
                                                
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mt-4 mb-2">Installed Software</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedAgent.workstation.installedSoftware.map(sw => (
                                                        <span key={sw} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300">
                                                            {sw}
                                                        </span>
                                                    ))}
                                                    <button className="px-2 py-1 bg-slate-800 border border-dashed border-slate-600 rounded text-[10px] text-slate-400 hover:text-white">
                                                        + Install
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center flex-col text-slate-500">
                                    <Monitor size={48} className="mb-4 opacity-50"/>
                                    <p>Workstation not provisioned for this agent.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. BUILDER VIEW */}
                {viewMode === 'BUILDER' && (
                    <div className="h-full flex flex-col">
                        <div className="border-b border-slate-800 bg-slate-900 px-6 py-3 flex justify-between items-center">
                            <div className="flex gap-4 text-xs font-bold text-slate-400">
                                <span>Model: <span className="text-white">{selectedAgent.config?.model}</span></span>
                                <span>Status: <span className="text-green-400">Active</span></span>
                            </div>
                            <button className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2">
                                <Save size={14}/> Save & Deploy
                            </button>
                        </div>
                        <div className="flex-1 flex">
                            {/* Editor & Manual Integration */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex-1 bg-[#1e1e1e] p-6 font-mono text-sm text-slate-300 overflow-y-auto relative border-b border-slate-800">
                                    <label className="block text-slate-500 text-xs uppercase font-bold mb-2 flex justify-between">
                                        System Prompt Configuration
                                        <span className="text-teal-400 flex items-center gap-1"><Sparkles size={12}/> AI Assisted</span>
                                    </label>
                                    <textarea 
                                        className="w-full h-[300px] bg-[#1e1e1e] outline-none resize-none text-[#d4d4d4]"
                                        value={selectedAgent.config?.systemPrompt}
                                        onChange={(e) => handleUpdateConfig({ systemPrompt: e.target.value })}
                                    />
                                    
                                    {/* Prompt Copilot Floating Bar */}
                                    <div className="absolute bottom-6 left-6 right-6 bg-slate-800 p-2 rounded-lg border border-slate-700 flex gap-2 shadow-2xl">
                                        <div className="p-2 bg-teal-500/20 rounded text-teal-400"><Wand2 size={18}/></div>
                                        <input 
                                            value={copilotGoal}
                                            onChange={(e) => setCopilotGoal(e.target.value)}
                                            placeholder="Ask Copilot: 'Optimize this prompt' or 'Make it more professional'..."
                                            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-slate-500"
                                            onKeyDown={(e) => e.key === 'Enter' && generatePrompt()}
                                        />
                                        <button 
                                            onClick={generatePrompt}
                                            disabled={isGeneratingPrompt}
                                            className="px-4 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isGeneratingPrompt ? <RefreshCw className="animate-spin" size={14}/> : 'Generate / Refine'}
                                        </button>
                                    </div>
                                </div>

                                {/* Manual Integrations Panel */}
                                <div className="h-64 bg-slate-900 p-6 overflow-y-auto">
                                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Key size={16} className="text-orange-400"/> Manual Integrations (Accounts & APIs)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            {selectedAgent.config?.manualIntegrations?.map(int => (
                                                <div key={int.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded">
                                                    <div>
                                                        <div className="text-xs font-bold text-white">{int.name}</div>
                                                        <div className="text-[10px] text-slate-500">{int.type} • {int.value.substring(0, 8)}...</div>
                                                    </div>
                                                    <span className="text-green-400 text-[10px] font-bold border border-green-500/30 px-2 py-0.5 rounded bg-green-500/10">CONNECTED</span>
                                                </div>
                                            ))}
                                            {(!selectedAgent.config?.manualIntegrations || selectedAgent.config.manualIntegrations.length === 0) && (
                                                <div className="text-xs text-slate-500 italic p-2">No manual integrations configured.</div>
                                            )}
                                        </div>
                                        <div className="bg-slate-950 border border-slate-800 rounded p-4">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Add New Connection</label>
                                            <div className="space-y-2">
                                                <input 
                                                    placeholder="Connection Name (e.g. AWS Root)" 
                                                    value={newIntegration.name}
                                                    onChange={e => setNewIntegration({...newIntegration, name: e.target.value})}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                                />
                                                <div className="flex gap-2">
                                                    <select 
                                                        value={newIntegration.type}
                                                        onChange={e => setNewIntegration({...newIntegration, type: e.target.value})}
                                                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                                    >
                                                        <option value="API_KEY">API Key</option>
                                                        <option value="SSH">SSH Key</option>
                                                        <option value="SIP_VOIP">VoIP / SIP</option>
                                                        <option value="DATABASE">DB Connection</option>
                                                    </select>
                                                    <input 
                                                        placeholder="Value / Key" 
                                                        value={newIntegration.value}
                                                        onChange={e => setNewIntegration({...newIntegration, value: e.target.value})}
                                                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                                    />
                                                </div>
                                                <button onClick={handleAddIntegration} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-1.5 rounded transition">
                                                    + Add Credential
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Configuration Panel */}
                            <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto">
                                <h3 className="font-bold text-white mb-4 text-sm">Capabilities & Tools</h3>
                                <div className="space-y-6">
                                    {/* Capability Matrix */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Core Capabilities</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {(['OS_KERNEL', 'SERVER_ADMIN', 'WEB_DEV', 'AI_DATA', 'DEVOPS', 'SECURITY', 'VOIP_COMMS'] as AgentCapability[]).map(cap => (
                                                <button
                                                    key={cap}
                                                    onClick={() => toggleCapability(cap)}
                                                    className={`px-2 py-1.5 rounded text-[10px] font-bold border transition text-left truncate ${
                                                        selectedAgent.config?.capabilities?.includes(cap) 
                                                        ? 'bg-teal-900/30 text-teal-400 border-teal-500/50' 
                                                        : 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-600'
                                                    }`}
                                                >
                                                    {cap.replace('_', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Base Model</label>
                                            <Info size={12} className="text-slate-600"/>
                                        </div>
                                        <select 
                                            value={selectedAgent.config?.model}
                                            onChange={(e) => handleUpdateConfig({ model: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white"
                                        >
                                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                                            <option value="gpt-4">GPT-4 (Emulated)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                             <label className="text-xs font-bold text-slate-500 uppercase">Temperature</label>
                                             <span className="text-xs font-mono text-teal-400">{selectedAgent.config?.temperature}</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="1" step="0.1" 
                                            value={selectedAgent.config?.temperature}
                                            onChange={(e) => handleUpdateConfig({ temperature: parseFloat(e.target.value) })}
                                            className="w-full accent-teal-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Attached MCP Tools</label>
                                        <div className="space-y-1">
                                            {selectedAgent.config?.tools.map(t => (
                                                <div key={t} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800 px-2 py-1.5 rounded group hover:bg-slate-700 cursor-pointer">
                                                    <Zap size={10} className="text-yellow-400"/> {t}
                                                    <button className="ml-auto text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100"><XCircle size={10}/></button>
                                                </div>
                                            ))}
                                            <button className="w-full text-xs text-slate-500 hover:text-white py-1 border border-dashed border-slate-700 rounded mt-2 hover:bg-slate-800 transition">
                                                + Attach Tool
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. WORKFLOW VIEW */}
                {viewMode === 'WORKFLOW' && (
                    <div className="h-full flex flex-col p-6 bg-[#0f172a] overflow-hidden relative">
                         <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
                         
                         <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8">
                             {/* Trigger */}
                             <div className="bg-slate-900 border-2 border-slate-700 p-4 rounded-xl shadow-lg w-72 text-center relative group">
                                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-2 text-[10px] font-bold text-orange-400 uppercase tracking-widest border border-slate-700 rounded-full">Trigger</div>
                                 <Workflow size={24} className="mx-auto text-orange-400 mb-2"/>
                                 <h3 className="font-bold text-white">On New Email</h3>
                                 <p className="text-xs text-slate-500">From: @important-client.com</p>
                                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full h-8 w-0.5 bg-slate-600"></div>
                             </div>

                             {/* Step 1 */}
                             <div className="bg-slate-900 border-2 border-slate-700 p-4 rounded-xl shadow-lg w-72 text-center relative group hover:border-teal-500 transition cursor-pointer">
                                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-2 text-[10px] font-bold text-teal-400 uppercase tracking-widest border border-slate-700 rounded-full">Step 1</div>
                                 <Bot size={24} className="mx-auto text-teal-400 mb-2"/>
                                 <h3 className="font-bold text-white">Agent Analysis</h3>
                                 <p className="text-xs text-slate-500">Analyze sentiment & intent</p>
                                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full h-8 w-0.5 bg-slate-600"></div>
                             </div>

                              {/* Step 2 */}
                             <div className="bg-slate-900 border-2 border-slate-700 p-4 rounded-xl shadow-lg w-72 text-center relative group hover:border-teal-500 transition cursor-pointer">
                                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-2 text-[10px] font-bold text-teal-400 uppercase tracking-widest border border-slate-700 rounded-full">Step 2</div>
                                 <Code size={24} className="mx-auto text-blue-400 mb-2"/>
                                 <h3 className="font-bold text-white">Execute Tool</h3>
                                 <p className="text-xs text-slate-500">query_database(crm)</p>
                             </div>
                             
                             <button className="bg-slate-800 hover:bg-slate-700 text-slate-400 px-4 py-2 rounded-full text-xs font-bold border border-dashed border-slate-600 transition">
                                 + Add Step
                             </button>
                         </div>
                    </div>
                )}

                {/* 5. TESTER VIEW */}
                {viewMode === 'TESTER' && (
                    <LiveTester agent={selectedAgent} />
                )}

                {/* 6. ANALYTICS VIEW */}
                {viewMode === 'ANALYTICS' && (
                     <div className="h-full p-8 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                             <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                 <div className="text-slate-500 text-xs font-bold uppercase">Throughput</div>
                                 <div className="text-2xl font-bold text-white mt-1">{selectedAgent.metrics?.tokensPerSec.toFixed(0)} <span className="text-sm text-slate-500 font-normal">tok/s</span></div>
                             </div>
                             <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                 <div className="text-slate-500 text-xs font-bold uppercase">Success Rate</div>
                                 <div className={`text-2xl font-bold mt-1 ${
                                     (selectedAgent.metrics?.successRate || 100) < 90 ? 'text-red-400' : 'text-green-400'
                                 }`}>
                                     {selectedAgent.metrics?.successRate.toFixed(1)}%
                                 </div>
                             </div>
                             <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                 <div className="text-slate-500 text-xs font-bold uppercase">Avg Latency</div>
                                 <div className={`text-2xl font-bold mt-1 ${
                                     (selectedAgent.metrics?.latency || 0) > 150 ? 'text-yellow-400' : 'text-white'
                                 }`}>
                                     {selectedAgent.metrics?.latency.toFixed(0)} <span className="text-sm text-slate-500 font-normal">ms</span>
                                 </div>
                             </div>
                             <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                 <div className="text-slate-500 text-xs font-bold uppercase">Revenue Generated</div>
                                 <div className="text-2xl font-bold text-green-400 mt-1">${(selectedAgent.metrics?.revenueGenerated || 0).toLocaleString()}</div>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-80">
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col">
                                <h4 className="font-bold text-slate-300 mb-4 text-xs uppercase">Token Usage (Last 12h)</h4>
                                <div className="flex-1">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={[
                                            {t: '00:00', v: 2400}, {t: '02:00', v: 1398}, {t: '04:00', v: 9800}, {t: '06:00', v: 3908}, {t: '08:00', v: 4800}, {t: '10:00', v: 3800}
                                        ]}>
                                            <defs>
                                                <linearGradient id="colorTok" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                            <XAxis dataKey="t" stroke="#64748b" fontSize={10} />
                                            <YAxis stroke="#64748b" fontSize={10} />
                                            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                                            <Area type="monotone" dataKey="v" stroke="#14b8a6" fillOpacity={1} fill="url(#colorTok)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col">
                                <h4 className="font-bold text-slate-300 mb-4 text-xs uppercase">Tool Usage Frequency</h4>
                                <div className="flex-1">
                                     <ResponsiveContainer width="100%" height="100%">
                                        <RechartsBarChart data={[
                                            {name: 'Search', count: 400}, {name: 'FS_Read', count: 300}, {name: 'Code_Exec', count: 200}, {name: 'Email', count: 150}
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                                            <YAxis stroke="#64748b" fontSize={10} />
                                            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                                            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                        </RechartsBarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                     </div>
                )}

            </div>
        </div>
    </div>
  );
};

const LiveTester: React.FC<{ agent: Agent }> = ({ agent }) => {
    const [messages, setMessages] = useState<{role: 'user' | 'agent', text: string}[]>([
        {role: 'agent', text: `Hello. I am ${agent.name}. How can I assist you with ${agent.department} tasks today?`}
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
        setInput('');
        setIsTyping(true);

        // Simulate agent response
        const response = await simulateAgentResponse(agent.role, agent.config?.systemPrompt || '', userMsg);
        
        setIsTyping(false);
        setMessages(prev => [...prev, {role: 'agent', text: response}]);
    };

    return (
        <div className="h-full flex gap-4 p-4">
            <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-300">Live Session: <span className="text-teal-400">{agent.name}</span></span>
                    <div className="flex gap-2 items-center">
                        {agent.config?.capabilities?.includes('VOIP_COMMS') && (
                            <div className="flex gap-1">
                                <button className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Voice Call"><Phone size={14}/></button>
                                <button className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Video Call"><Video size={14}/></button>
                            </div>
                        )}
                        <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">Online</span>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                             <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex gap-1">
                                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                             </div>
                        </div>
                    )}
                    <div ref={scrollRef}></div>
                </div>

                <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800">
                    <div className="relative">
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message to test the agent..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:border-teal-500 outline-none shadow-inner"
                        />
                        <button type="submit" disabled={!input.trim() || isTyping} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white transition disabled:opacity-50">
                            <Play size={14} fill="currentColor"/>
                        </button>
                    </div>
                </form>
            </div>

            {/* VoIP Side Panel (Placeholder for future build) */}
            {agent.config?.capabilities?.includes('VOIP_COMMS') && (
                <div className="w-72 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><Phone size={14}/> Digital Employee VoIP</h3>
                    <div className="flex-1 flex flex-col items-center justify-center bg-black/30 rounded-lg border border-slate-800 mb-4 text-center p-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-2 animate-pulse">
                            <Mic size={32} className="text-slate-500"/>
                        </div>
                        <p className="text-sm font-bold text-white">Call Standby</p>
                        <p className="text-[10px] text-slate-500">Waiting for incoming SIP request...</p>
                    </div>
                    <div className="space-y-2">
                        <div className="text-[10px] text-slate-500 flex justify-between"><span>SIP Status</span> <span className="text-green-400">Registered</span></div>
                        <div className="text-[10px] text-slate-500 flex justify-between"><span>Codec</span> <span className="text-slate-300">OPUS / G.711</span></div>
                        <div className="text-[10px] text-slate-500 flex justify-between"><span>Latency</span> <span className="text-slate-300">24ms</span></div>
                    </div>
                    <button className="mt-4 w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-bold shadow">
                        Test Voice Call
                    </button>
                </div>
            )}
        </div>
    );
};

export default AgentView;
