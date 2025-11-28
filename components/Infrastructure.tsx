import React, { useState, useEffect, useRef } from 'react';
import { Server, Activity, Globe, Key, Settings, Sliders, Database, Cpu, Zap, Microchip, Play, Pause, Terminal as TerminalIcon, BarChart3, Layers, Code, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Infrastructure: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LB' | 'DNS' | 'API' | 'GPU'>('LB');
  
  // GPU State
  const [gpuMode, setGpuMode] = useState(false);
  const [trainingActive, setTrainingActive] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Llama-3-70B-Instruct');
  const [selectedFramework, setSelectedFramework] = useState('PyTorch');
  const [logs, setLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({
      vram: 0,
      utilization: 0,
      temp: 45,
      power: 120,
      loss: 2.5
  });
  const [chartData, setChartData] = useState<{time: number, loss: number, accuracy: number}[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Simulation Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (trainingActive && gpuMode) {
        let step = 0;
        interval = setInterval(() => {
            step++;
            // Update Metrics with some noise
            setMetrics(prev => ({
                vram: Math.min(320, prev.vram + (Math.random() * 5)),
                utilization: Math.min(100, 95 + (Math.random() * 5)),
                temp: Math.min(90, 75 + (Math.random() * 10)),
                power: Math.min(700, 650 + (Math.random() * 50)),
                loss: Math.max(0.1, prev.loss * 0.98) // Decaying loss
            }));

            // Update Chart
            setChartData(prev => {
                const newData = [...prev, {
                    time: step,
                    loss: Math.max(0.1, 2.5 * Math.pow(0.98, step)) + (Math.random() * 0.1),
                    accuracy: Math.min(0.99, 0.1 + (step * 0.01))
                }];
                return newData.slice(-20); // Keep last 20 points
            });

            // Generate Logs
            const timestamp = new Date().toISOString().split('T')[1].slice(0,8);
            const newLog = `[${timestamp}] [GPU-0] Epoch ${Math.floor(step/10)+1} Batch ${step%100}/1000 | Loss: ${metrics.loss.toFixed(4)} | Acc: ${(0.1 + (step * 0.01)).toFixed(2)} | ${selectedFramework}::DistributedDataParallel`;
            
            setLogs(prev => [...prev.slice(-15), newLog]);
            
            // Auto scroll
            if (logContainerRef.current) {
                logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
            }

        }, 800);
    } else {
        // Cooldown
        setMetrics(prev => ({
            vram: Math.max(0, prev.vram - 10),
            utilization: 0,
            temp: Math.max(45, prev.temp - 1),
            power: Math.max(120, prev.power - 10),
            loss: 2.5
        }));
    }
    return () => clearInterval(interval);
  }, [trainingActive, gpuMode, metrics.loss, selectedFramework]);

  const toggleGpu = () => {
      setGpuMode(!gpuMode);
      if (gpuMode) {
          setTrainingActive(false);
          setLogs([]);
          setChartData([]);
      } else {
          setLogs(['[SYSTEM] Initializing Neural Bridge Adapter v4.0...', '[SYSTEM] Handshaking with Virtual H100 Cluster... Connected.']);
      }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200">
      <div className="border-b border-slate-800 p-6 bg-slate-900/50">
        <h1 className="text-2xl font-bold flex items-center gap-3">
           <Server className="text-indigo-400" />
           Badal Cloud Infrastructure
        </h1>
        <p className="text-slate-400 mt-1">Manage Load Balancers, DNS Records, API Gateways, and AI Compute.</p>
      </div>

      <div className="flex border-b border-slate-800 overflow-x-auto">
         <button 
           onClick={() => setActiveTab('LB')}
           className={`px-6 py-4 font-medium flex items-center gap-2 transition whitespace-nowrap ${activeTab === 'LB' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
         >
            <Activity size={18} /> Load Balancer
         </button>
         <button 
           onClick={() => setActiveTab('DNS')}
           className={`px-6 py-4 font-medium flex items-center gap-2 transition whitespace-nowrap ${activeTab === 'DNS' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
         >
            <Globe size={18} /> DNS Manager
         </button>
         <button 
           onClick={() => setActiveTab('API')}
           className={`px-6 py-4 font-medium flex items-center gap-2 transition whitespace-nowrap ${activeTab === 'API' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
         >
            <Key size={18} /> API & Secrets
         </button>
         <button 
           onClick={() => setActiveTab('GPU')}
           className={`px-6 py-4 font-medium flex items-center gap-2 transition whitespace-nowrap ${activeTab === 'GPU' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
         >
            <Cpu size={18} /> GPU AI Compute
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
         
         {activeTab === 'LB' && (
            <div className="max-w-4xl space-y-8">
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="text-lg font-semibold text-white">Global Traffic Distribution</h3>
                        <p className="text-sm text-slate-500">Weighted Round Robin Configuration</p>
                     </div>
                     <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-mono uppercase">Healthy</span>
                  </div>

                  <div className="space-y-6">
                     {[
                        { region: 'US East (N. Virginia)', weight: 45, load: 'High' },
                        { region: 'EU West (Ireland)', weight: 30, load: 'Moderate' },
                        { region: 'Asia Pacific (Tokyo)', weight: 25, load: 'Low' },
                     ].map((node) => (
                        <div key={node.region} className="space-y-2">
                           <div className="flex justify-between text-sm">
                              <span className="font-medium text-slate-300">{node.region}</span>
                              <span className="text-slate-500">{node.weight}% Traffic</span>
                           </div>
                           <div className="flex items-center gap-4">
                              <input type="range" min="0" max="100" defaultValue={node.weight} className="flex-1 accent-cyan-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                              <div className="w-24 text-right text-xs text-slate-400 border border-slate-700 rounded px-2 py-1">Load: {node.load}</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                     <h4 className="font-semibold text-white mb-4 flex items-center gap-2"><Settings size={16} /> SSL Termination</h4>
                     <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg mb-2">
                        <span className="text-sm text-slate-300">Force HTTPS</span>
                        <div className="w-10 h-5 bg-cyan-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                         <span className="text-sm text-slate-300">HSTS Preload</span>
                         <div className="w-10 h-5 bg-slate-600 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                     </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                     <h4 className="font-semibold text-white mb-4 flex items-center gap-2"><Sliders size={16} /> Auto-Scaling Policies</h4>
                     <p className="text-sm text-slate-400 mb-4">Automatically adjust node count based on CPU utilization.</p>
                     <div className="flex gap-2">
                        <div className="flex-1 bg-slate-800 p-3 rounded text-center border border-slate-700 cursor-pointer hover:border-cyan-500">
                           <div className="text-xl font-bold text-white">Min: 2</div>
                        </div>
                        <div className="flex-1 bg-slate-800 p-3 rounded text-center border border-slate-700 cursor-pointer hover:border-cyan-500">
                           <div className="text-xl font-bold text-white">Max: 50</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'DNS' && (
            <div className="max-w-4xl">
               <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-800 text-slate-400">
                        <tr>
                           <th className="p-4 font-medium">Type</th>
                           <th className="p-4 font-medium">Name</th>
                           <th className="p-4 font-medium">Content</th>
                           <th className="p-4 font-medium">TTL</th>
                           <th className="p-4 font-medium">Proxy Status</th>
                           <th className="p-4 font-medium">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800">
                        {[
                           { type: 'A', name: '@', content: '192.0.2.1', ttl: 'Auto', proxy: true },
                           { type: 'CNAME', name: 'www', content: 'megamos.com', ttl: 'Auto', proxy: true },
                           { type: 'MX', name: '@', content: 'mail.megamos.com', ttl: '1 min', proxy: false },
                           { type: 'TXT', name: '@', content: 'v=spf1 include:_spf.google.com ~all', ttl: 'Auto', proxy: false },
                        ].map((record, i) => (
                           <tr key={i} className="hover:bg-slate-800/50">
                              <td className="p-4 font-bold text-indigo-400">{record.type}</td>
                              <td className="p-4 text-slate-300">{record.name}</td>
                              <td className="p-4 font-mono text-slate-400">{record.content}</td>
                              <td className="p-4 text-slate-500">{record.ttl}</td>
                              <td className="p-4">
                                 {record.proxy ? <span className="text-orange-400 flex items-center gap-1"><Globe size={12}/> Proxied</span> : <span className="text-slate-600 flex items-center gap-1"><Globe size={12}/> DNS Only</span>}
                              </td>
                              <td className="p-4 text-cyan-500 cursor-pointer hover:underline">Edit</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  <div className="p-4 border-t border-slate-800 bg-slate-800/30">
                     <button className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded font-medium transition">
                        + Add Record
                     </button>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'API' && (
             <div className="max-w-4xl space-y-6">
                 <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">API Tokens</h3>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-indigo-500/20 rounded text-indigo-400"><Key size={20} /></div>
                             <div>
                                <div className="font-medium text-white">Production API Key</div>
                                <div className="text-xs text-slate-500">Last used: Just now</div>
                             </div>
                          </div>
                          <div className="font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded text-sm select-all">sk_live_51Mz...q8j2</div>
                       </div>
                    </div>
                 </div>
                 <div className="bg-gradient-to-r from-indigo-900/40 to-cyan-900/40 border border-indigo-500/30 rounded-xl p-6">
                    <h3 className="font-semibold text-indigo-300 mb-2">MCP Server Endpoint</h3>
                    <p className="text-sm text-slate-400 mb-4">Use this endpoint to connect external agents to the Model Context Protocol server.</p>
                    <code className="block bg-black/40 p-3 rounded text-green-400 font-mono text-sm">
                       wss://api.megamos.com/v1/mcp/connect
                    </code>
                 </div>
             </div>
         )}

         {activeTab === 'GPU' && (
             <div className="max-w-7xl space-y-6">
                 {/* Header & Main Toggle */}
                 <div className="bg-gradient-to-r from-indigo-950 to-slate-900 rounded-2xl p-8 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 animate-pulse">
                        <Zap size={300} />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-200 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 border border-indigo-400/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                <Microchip size={14} className="fill-current" /> Neural Bridge™ Engine v3.0
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-2">Virtual GPU Acceleration</h2>
                            <p className="text-indigo-200 max-w-xl text-lg">
                                Real-time x86 to CUDA PTX translation layer. Transform standard CPU clusters into high-performance Tensor Cores for AI training.
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-4">
                             <button 
                                onClick={toggleGpu}
                                className={`group px-8 py-6 rounded-2xl font-bold text-lg flex items-center gap-4 transition-all border-2 ${
                                    gpuMode 
                                    ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_50px_rgba(34,197,94,0.3)]' 
                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-500'
                                }`}
                            >
                                <div className={`p-3 rounded-full transition-all ${gpuMode ? 'bg-green-500 text-slate-900' : 'bg-slate-700 text-slate-500'}`}>
                                   <Zap size={24} className={gpuMode ? 'fill-current animate-pulse' : ''} />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs uppercase tracking-wider font-semibold opacity-70">Status</div>
                                    <div className="text-xl">{gpuMode ? 'NEURAL BRIDGE ACTIVE' : 'ENABLE BRIDGE'}</div>
                                </div>
                            </button>
                        </div>
                    </div>
                 </div>

                 {/* GPU Dashboard Content */}
                 {gpuMode && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* Left Column: Configuration & Status */}
                        <div className="space-y-6">
                            {/* Model Selection */}
                            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                                    <Settings size={14} /> Workload Configuration
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">AI Framework</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['PyTorch', 'TensorFlow', 'JAX'].map(fw => (
                                                <button 
                                                    key={fw}
                                                    onClick={() => setSelectedFramework(fw)}
                                                    disabled={trainingActive}
                                                    className={`text-xs py-2 px-1 rounded border transition ${selectedFramework === fw ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                                                >
                                                    {fw}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Model Architecture</label>
                                        <select 
                                            value={selectedModel}
                                            onChange={(e) => setSelectedModel(e.target.value)}
                                            disabled={trainingActive}
                                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white outline-none focus:border-indigo-500"
                                        >
                                            <option>Llama-3-70B-Instruct</option>
                                            <option>Stable-Diffusion-XL-v1.0</option>
                                            <option>Mistral-Large-Latest</option>
                                            <option>Whisper-v3-Large</option>
                                        </select>
                                    </div>
                                    
                                    <button 
                                        onClick={() => setTrainingActive(!trainingActive)}
                                        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                                            trainingActive 
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
                                            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                                        }`}
                                    >
                                        {trainingActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                                        {trainingActive ? 'Stop Training' : 'Start Training Simulation'}
                                    </button>
                                </div>
                            </div>

                            {/* Live Metrics */}
                            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                                    <Activity size={14} /> Telemetry
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400">VRAM Allocation (Virtual)</span>
                                            <span className="text-cyan-400 font-mono">{metrics.vram.toFixed(1)} GB / 320 GB</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-cyan-500 transition-all duration-300 ease-out" 
                                                style={{ width: `${(metrics.vram / 320) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400">Compute Utilization</span>
                                            <span className="text-purple-400 font-mono">{metrics.utilization.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-purple-500 transition-all duration-300 ease-out" 
                                                style={{ width: `${metrics.utilization}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="bg-slate-800/50 p-2 rounded text-center">
                                            <div className="text-[10px] text-slate-500 uppercase">Power Draw</div>
                                            <div className="text-lg font-mono text-white">{metrics.power.toFixed(0)}W</div>
                                        </div>
                                        <div className="bg-slate-800/50 p-2 rounded text-center">
                                            <div className="text-[10px] text-slate-500 uppercase">Temp</div>
                                            <div className={`text-lg font-mono ${metrics.temp > 80 ? 'text-red-400' : 'text-green-400'}`}>
                                                {metrics.temp.toFixed(1)}°C
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Column: Visual Cluster & Graphs */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* H100 Grid Visualizer */}
                            <div className="bg-black/40 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                        <Layers size={14} /> Virtual Cluster Topology
                                    </h3>
                                    <div className="flex gap-2 text-[10px] font-mono">
                                        <span className="flex items-center gap-1 text-slate-500"><div className="w-2 h-2 rounded-full bg-slate-700"></div> IDLE</span>
                                        <span className="flex items-center gap-1 text-green-400"><div className="w-2 h-2 rounded-full bg-green-500"></div> ACTIVE</span>
                                        <span className="flex items-center gap-1 text-orange-400"><div className="w-2 h-2 rounded-full bg-orange-500"></div> WARN</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                                    {Array.from({ length: 32 }).map((_, i) => (
                                        <div 
                                            key={i}
                                            className={`
                                                aspect-square rounded border transition-all duration-500 flex items-center justify-center relative group
                                                ${trainingActive 
                                                    ? `bg-green-500/${Math.floor(Math.random() * 40 + 10)} border-green-500/30 shadow-[0_0_10px_inset_rgba(34,197,94,0.1)]` 
                                                    : 'bg-slate-900 border-slate-800'}
                                            `}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${trainingActive ? 'bg-green-400 animate-pulse' : 'bg-slate-800'}`}></div>
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-slate-900/90 flex items-center justify-center text-[10px] font-mono text-white pointer-events-none transition-opacity">
                                                GPU-{i}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-500 border-t border-slate-800/50 pt-2">
                                    <span>Architecture: NVIDIA Hopper H100 (Virtual)</span>
                                    <span>Interconnect: 900 GB/s NVLink</span>
                                </div>
                            </div>

                            {/* Charts & Terminal Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-64">
                                {/* Training Chart */}
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
                                    <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2">
                                        <BarChart3 size={14} /> Training Loss / Accuracy
                                    </h4>
                                    <div className="flex-1 min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                                <XAxis hide />
                                                <YAxis hide domain={[0, 3]} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }}
                                                    itemStyle={{ padding: 0 }}
                                                />
                                                <Area type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorLoss)" />
                                                <Area type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorAcc)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Live Terminal */}
                                <div className="bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-hidden flex flex-col">
                                    <h4 className="text-slate-500 mb-2 flex items-center gap-2 border-b border-slate-900 pb-2">
                                        <TerminalIcon size={14} /> /var/log/gpu-cluster.log
                                    </h4>
                                    <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-1 text-slate-300">
                                        {logs.length === 0 && <span className="text-slate-600 italic">Waiting for job submission...</span>}
                                        {logs.map((log, i) => (
                                            <div key={i} className="break-all">
                                                <span className="text-blue-500 mr-2">➜</span>
                                                {log}
                                            </div>
                                        ))}
                                        {trainingActive && (
                                            <div className="animate-pulse text-green-500">_</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 )}

                 {/* Instruction Bridge Visual (Only when active) */}
                 {gpuMode && trainingActive && (
                     <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 flex items-center justify-center gap-8 overflow-hidden">
                         <div className="font-mono text-xs text-slate-500">x86_64 Instruction Stream</div>
                         <div className="flex-1 flex gap-1 justify-center opacity-50">
                             {Array.from({length: 12}).map((_, i) => (
                                 <div key={i} className="w-1 h-3 bg-cyan-500/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                             ))}
                         </div>
                         <div className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded">NEURAL BRIDGE</div>
                         <div className="flex-1 flex gap-1 justify-center opacity-50">
                             {Array.from({length: 12}).map((_, i) => (
                                 <div key={i} className="w-1 h-3 bg-green-500/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                             ))}
                         </div>
                         <div className="font-mono text-xs text-slate-500">CUDA Kernel Execution</div>
                     </div>
                 )}
             </div>
         )}
      </div>
    </div>
  );
};

export default Infrastructure;