

import React, { useState, useEffect, useRef } from 'react';
import { Network, Database, Play, Save, Settings, Layers, FileText, Zap, Box, ArrowRight, Terminal, RefreshCw, UploadCloud, Search, Plus, Trash2, Cpu, Library, Download, ThumbsUp, Activity, GitBranch, Share2, BarChart3, Sliders, Lock, Code, CheckCircle2, Copy, BrainCircuit, X, File, Bot, GraduationCap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { runSuckChainPipeline, compileSuckChainCode, simulateLLMTraining, simulateRAGIngestion, simulateAdvancedTrainingMetrics, simulateIQTest } from '../services/geminiService';
import { ChainNode, RAGIndex, ModelHubItem, FineTuneJob, LLMArchitecture, IQScore } from '../types';

const AIStudio: React.FC = () => {
  const [activeView, setActiveView] = useState<'BUILDER' | 'LLM_BUILDER' | 'HUB' | 'RAG' | 'FINE_TUNE' | 'TEST' | 'SETTINGS'>('BUILDER');
  
  // Pipeline State
  const [nodes, setNodes] = useState<ChainNode[]>([
      { id: '1', type: 'TRIGGER', label: 'User Input', config: { variable: 'query' }, status: 'IDLE', position: { x: 50, y: 150 } },
      { id: '2', type: 'RETRIEVER', label: 'RAG Retriever', config: { k: 3, source: 'Badal Storage' }, status: 'IDLE', position: { x: 300, y: 150 } },
      { id: '3', type: 'PROMPT', label: 'Contextual Prompt', config: { template: 'Answer {query} based on {context}' }, status: 'IDLE', position: { x: 550, y: 150 } },
      { id: '4', type: 'LLM', label: 'Badal-Llama-3', config: { model: 'llama-3-70b', temperature: 0.7 }, status: 'IDLE', position: { x: 800, y: 150 } },
      { id: '5', type: 'OUTPUT_PARSER', label: 'JSON Parser', config: { schema: 'auto' }, status: 'IDLE', position: { x: 1050, y: 150 } },
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showCodeView, setShowCodeView] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  // Neural Bridge Telemetry
  const [bridgeMetrics, setBridgeMetrics] = useState({ ops: 0, latency: 0, translation: 0 });

  // LLM Builder State
  const [customArch, setCustomArch] = useState<LLMArchitecture>({ name: 'My-Badal-GPT', params: '7B', layers: 32, embeddingDim: 4096, type: 'TRANSFORMER', baseModel: 'Llama-3-Open-Source' });
  const [trainingJob, setTrainingJob] = useState<{status: string, progress: number, log: string[], iqScore?: IQScore}>({ status: 'IDLE', progress: 0, log: [] });

  // RAG State
  const [ragIndices, setRagIndices] = useState<RAGIndex[]>([
      { id: 'idx1', name: 'Company Wiki', documents: 1402, vectors: 45000, size: '240MB', status: 'READY' },
      { id: 'idx2', name: 'Codebase v2', documents: 8900, vectors: 120000, size: '1.2GB', status: 'INDEXING' }
  ]);
  const [ingestionStep, setIngestionStep] = useState<'IDLE' | 'UPLOADING' | 'CHUNKING' | 'EMBEDDING' | 'INDEXING' | 'DONE'>('IDLE');
  const [ingestLog, setIngestLog] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Fine-Tuning State
  const [fineTuneParams, setFineTuneParams] = useState({
      epochs: 3,
      batchSize: 32,
      learningRate: 0.0002,
      loraRank: 64,
      loraAlpha: 16,
      dropout: 0.1
  });
  const [ftStatus, setFtStatus] = useState<'IDLE' | 'TRAINING' | 'COMPLETED'>('IDLE');
  const [ftMetrics, setFtMetrics] = useState<{loss: number[], vram: number, logs: string[]}>({loss: [], vram: 0, logs: []});

  // Model Hub State
  const [models, setModels] = useState<ModelHubItem[]>([
      { id: 'm1', name: 'Badal-Llama-3-70B', description: 'Optimized for Badal Cloud H100s. High reasoning.', tags: ['NLP', 'Reasoning'], downloads: '12K', likes: 450, author: 'Megam AI', updated: '2d ago', contextWindow: '128k' },
      { id: 'm2', name: 'SuckCode-34B', description: 'Specialized coding model trained on internal repos.', tags: ['Code', 'Python'], downloads: '8.5K', likes: 320, author: 'Internal', updated: '1w ago', contextWindow: '64k' },
      { id: 'm3', name: 'Megam-Vision-Pro', description: 'Multimodal image analysis model.', tags: ['Vision', 'Multimodal'], downloads: '3K', likes: 150, author: 'Megam AI', updated: '3d ago', contextWindow: '32k' }
  ]);

  // Simulation Loop for Neural Bridge
  useEffect(() => {
      const interval = setInterval(() => {
          setBridgeMetrics({
              ops: Math.floor(Math.random() * 500) + 1200,
              latency: Math.floor(Math.random() * 5) + 2,
              translation: 99.9
          });
      }, 1000);
      return () => clearInterval(interval);
  }, []);

  const handleGenerateCode = async () => {
      setShowCodeView(true);
      setGeneratedCode('# Compiling LCEL Graph...\n');
      const code = await compileSuckChainCode(nodes);
      setGeneratedCode(code);
  };

  const startTrainingSimulation = () => {
      setTrainingJob({ status: 'RUNNING', progress: 0, log: ['Initializing Neural Bridge...', 'Allocating Virtual Tensor Cores...'] });
      let progress = 0;
      const interval = setInterval(async () => {
          progress += 5;
          const metric = await simulateLLMTraining(customArch);
          setTrainingJob(prev => ({
              status: progress >= 95 ? 'EVALUATING' : 'RUNNING',
              progress: progress,
              log: [`[Epoch ${Math.ceil(progress/10)}] Loss: ${metric.loss.toFixed(4)} Acc: ${metric.acc.toFixed(3)} - ${metric.log}`, ...prev.log].slice(0, 10)
          }));

          if (progress >= 100) {
              clearInterval(interval);
              // Run IQ Test
              setTrainingJob(prev => ({...prev, log: ['Running IQ Evaluation Protocol (MMLU, HumanEval)...', ...prev.log]}));
              const iq = await simulateIQTest();
              setTrainingJob(prev => ({ 
                  ...prev, 
                  status: 'COMPLETED', 
                  progress: 100,
                  iqScore: iq,
                  log: [`[IQ Test] MMLU: ${iq.mmlu.toFixed(1)} | Reasoning: ${iq.reasoning.toFixed(1)} | Code: ${iq.coding.toFixed(1)}`, 'Training Complete. Model Quantized and pushed to Registry.', ...prev.log] 
              }));
          }
      }, 800);
  };

  const startRAGIngestion = async () => {
      if (!uploadedFile) return;
      setIngestionStep('UPLOADING');
      setIngestLog('Uploading document to Badal Object Store...');
      await new Promise(r => setTimeout(r, 1000));
      
      setIngestionStep('CHUNKING');
      setIngestLog(await simulateRAGIngestion(uploadedFile, 'CHUNKING'));
      
      setIngestionStep('EMBEDDING');
      setIngestLog(await simulateRAGIngestion(uploadedFile, 'EMBEDDING'));
      
      setIngestionStep('INDEXING');
      setIngestLog(await simulateRAGIngestion(uploadedFile, 'INDEXING'));
      
      setIngestionStep('DONE');
      setIngestLog('Knowledge Base updated successfully. Ready for queries.');
      setRagIndices(prev => [...prev, { id: Date.now().toString(), name: uploadedFile, documents: 1, vectors: 512, size: '2MB', status: 'READY' }]);
      setUploadedFile(null);
  };

  const startFineTuning = async () => {
      setFtStatus('TRAINING');
      setFtMetrics({ loss: [], vram: 0, logs: ['[AutoML] Data Scientist Agent initialized.', '[AutoML] Analyzing dataset distribution...'] });
      
      let step = 0;
      const interval = setInterval(async () => {
          step++;
          const metrics = await simulateAdvancedTrainingMetrics(step);
          
          setFtMetrics(prev => ({
              loss: [...prev.loss, { step, value: metrics.loss } as any],
              vram: metrics.vram,
              logs: [metrics.agentLog, ...prev.logs].slice(0, 8)
          }));

          if (step >= 20) {
              clearInterval(interval);
              setFtStatus('COMPLETED');
              setFtMetrics(prev => ({ ...prev, logs: ['[AutoML] Training converged. Model saved.', ...prev.logs] }));
          }
      }, 1000);
  };

  const renderBuilder = () => (
      <div className="flex h-full relative">
          {/* Sidebar */}
          <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800">
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Node Library</h3>
                  <div className="space-y-2">
                      {['TRIGGER', 'PROMPT', 'LLM', 'RETRIEVER', 'TOOL', 'MEMORY', 'ROUTER'].map(type => (
                          <div key={type} className="p-3 bg-slate-800 border border-slate-700 rounded cursor-grab hover:border-red-500 hover:text-white text-slate-400 text-xs font-bold flex items-center gap-2 transition">
                              <Box size={14}/> {type}
                          </div>
                      ))}
                  </div>
              </div>
              
              {/* Property Inspector */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-900/50">
                   <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Properties</h3>
                   {selectedNodeId ? (
                       <div className="space-y-4">
                           {nodes.find(n => n.id === selectedNodeId) && (
                               <>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Label</label>
                                    <input className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" defaultValue={nodes.find(n => n.id === selectedNodeId)?.label} />
                                </div>
                                {nodes.find(n => n.id === selectedNodeId)?.type === 'LLM' && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400">Model</label>
                                            <select className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white">
                                                <option>llama-3-70b</option>
                                                <option>gpt-4-turbo</option>
                                                <option>mistral-large</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400">Temperature</label>
                                            <input type="range" className="w-full accent-red-500" min="0" max="1" step="0.1" defaultValue="0.7"/>
                                        </div>
                                    </>
                                )}
                                {nodes.find(n => n.id === selectedNodeId)?.type === 'PROMPT' && (
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400">Template</label>
                                        <textarea className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white h-24" defaultValue={nodes.find(n => n.id === selectedNodeId)?.config.template} />
                                    </div>
                                )}
                               </>
                           )}
                       </div>
                   ) : (
                       <div className="text-center text-slate-600 text-xs mt-10">Select a node to edit properties</div>
                   )}
              </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col">
              {/* Toolbar */}
              <div className="h-12 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-4 z-10">
                  <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-slate-400">Pipeline:</span>
                       <span className="text-sm font-bold text-white">RAG Q&A V1</span>
                  </div>
                  <div className="flex items-center gap-2">
                       <button onClick={handleGenerateCode} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold border border-slate-700">
                           <Code size={14}/> Code View
                       </button>
                       <button className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold shadow-lg shadow-red-900/20">
                           <Play size={14}/> Run Test
                       </button>
                       <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold shadow-lg shadow-indigo-900/20">
                           <UploadCloud size={14}/> Deploy as Tool
                       </button>
                  </div>
              </div>

              {/* Graph Visualizer */}
              <div className="flex-1 relative overflow-auto" onClick={() => setSelectedNodeId(null)}>
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                  
                  {/* Connection Lines (Simulated) */}
                  <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
                      {nodes.map((node, i) => {
                          if (i === nodes.length - 1) return null;
                          const next = nodes[i+1];
                          return (
                              <path 
                                key={i}
                                d={`M ${node.position!.x + 200} ${node.position!.y + 40} C ${node.position!.x + 250} ${node.position!.y + 40}, ${next.position!.x - 50} ${next.position!.y + 40}, ${next.position!.x} ${next.position!.y + 40}`}
                                stroke="#475569" 
                                strokeWidth="2" 
                                fill="none"
                              />
                          )
                      })}
                  </svg>

                  {/* Nodes */}
                  {nodes.map(node => (
                      <div 
                        key={node.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                        className={`absolute w-52 p-4 rounded-xl border-2 shadow-xl cursor-pointer transition group z-10 ${selectedNodeId === node.id ? 'border-red-500 bg-slate-800' : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`}
                        style={{ left: node.position?.x, top: node.position?.y }}
                      >
                          <div className="flex justify-between items-center mb-2">
                              <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${node.type === 'TRIGGER' ? 'bg-green-500/20 text-green-400' : node.type === 'LLM' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-300'}`}>
                                  {node.type}
                              </div>
                              <MoreHorizontal size={14} className="text-slate-500"/>
                          </div>
                          <div className="font-bold text-white text-sm mb-1">{node.label}</div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">{JSON.stringify(node.config)}</div>
                          
                          {/* Ports */}
                          {node.type !== 'TRIGGER' && <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-500 rounded-full border-2 border-slate-900"></div>}
                          {node.type !== 'OUTPUT_PARSER' && <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-500 rounded-full border-2 border-slate-900"></div>}
                      </div>
                  ))}
              </div>

              {/* Telemetry Bar */}
              <div className="h-8 bg-black border-t border-slate-800 flex items-center justify-between px-4 text-[10px] font-mono text-slate-500 z-10">
                  <div className="flex gap-4">
                      <span className="flex items-center gap-1"><Cpu size={12} className="text-green-500"/> Neural Bridge: Active</span>
                      <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-500"/> Translation: {bridgeMetrics.translation}%</span>
                      <span>Ops/s: {bridgeMetrics.ops} TFLOPS</span>
                  </div>
                  <div>
                      Memory: 4.2GB / 128GB
                  </div>
              </div>
          </div>

          {/* Code View Overlay */}
          {showCodeView && (
              <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
                  <div className="w-[600px] bg-[#1e1e1e] h-full shadow-2xl flex flex-col border-l border-slate-700 animate-in slide-in-from-right duration-300">
                      <div className="h-12 flex items-center justify-between px-4 border-b border-black bg-[#252526]">
                          <span className="text-sm font-bold text-slate-300 flex items-center gap-2"><Code size={16}/> Generated Python Code</span>
                          <div className="flex gap-2">
                              <button className="p-1 hover:bg-white/10 rounded text-slate-400"><Copy size={16}/></button>
                              <button onClick={() => setShowCodeView(false)} className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded text-slate-400"><X size={16}/></button>
                          </div>
                      </div>
                      <div className="flex-1 overflow-auto p-4">
                          <pre className="font-mono text-xs text-blue-300 leading-relaxed whitespace-pre-wrap">
                              {generatedCode}
                          </pre>
                      </div>
                      <div className="p-4 border-t border-black bg-[#252526] flex justify-end gap-2">
                          <button className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded">Copy to Clipboard</button>
                          <button className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded">Save to Badal Storage</button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  const renderLLMBuilder = () => (
      <div className="h-full p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><BrainCircuit size={28} className="text-purple-400"/> Custom LLM Architect</h2>
                  <p className="text-slate-400">Design and train proprietary models using Badal Cloud's Neural Bridge technology. Zero-cost open source training pipeline.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <h3 className="font-bold text-white mb-6 border-b border-slate-800 pb-2">Model Architecture</h3>
                          
                          <div className="mb-4">
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Base Open Source Foundation</label>
                              <select 
                                value={customArch.baseModel} 
                                onChange={e => setCustomArch({...customArch, baseModel: e.target.value})} 
                                className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm text-white focus:border-purple-500 outline-none"
                              >
                                  <option>Llama-3-Open-Source (Meta)</option>
                                  <option>Mistral-7B-Instruct (Apache 2.0)</option>
                                  <option>Gemma-7B (Google)</option>
                                  <option>Falcon-40B (TII)</option>
                              </select>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                               <div>
                                   <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Model Name</label>
                                   <input value={customArch.name} onChange={e => setCustomArch({...customArch, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm text-white focus:border-purple-500 outline-none" />
                               </div>
                               <div>
                                   <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Parameter Size</label>
                                   <select value={customArch.params} onChange={e => setCustomArch({...customArch, params: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm text-white focus:border-purple-500 outline-none">
                                       <option>1B (Mobile)</option>
                                       <option>7B (Standard)</option>
                                       <option>13B (Advanced)</option>
                                       <option>70B (Ultra)</option>
                                   </select>
                               </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                               <div>
                                   <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Attention Layers</label>
                                   <div className="flex items-center gap-4">
                                        <input type="range" min="12" max="96" value={customArch.layers} onChange={e => setCustomArch({...customArch, layers: parseInt(e.target.value)})} className="flex-1 accent-purple-500"/>
                                        <span className="font-mono text-purple-400 font-bold w-8">{customArch.layers}</span>
                                   </div>
                               </div>
                               <div>
                                   <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Architecture Type</label>
                                   <div className="flex gap-2">
                                       {['TRANSFORMER', 'MoE', 'SSM'].map(t => (
                                           <button key={t} onClick={() => setCustomArch({...customArch, type: t as any})} className={`flex-1 py-2 text-xs font-bold rounded border ${customArch.type === t ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                               {t}
                                           </button>
                                       ))}
                                   </div>
                               </div>
                          </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                           <h3 className="font-bold text-white mb-6 border-b border-slate-800 pb-2 flex items-center justify-between">
                               <span>Training Job</span>
                               <span className={`text-xs px-2 py-1 rounded font-bold ${trainingJob.status === 'RUNNING' ? 'bg-blue-500/20 text-blue-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>{trainingJob.status}</span>
                           </h3>
                           
                           {trainingJob.status === 'IDLE' ? (
                               <div className="text-center py-8">
                                   <button onClick={startTrainingSimulation} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-900/30 flex items-center gap-2 mx-auto transition transform hover:scale-105">
                                       <Cpu size={18}/> Start Training on Neural Bridge
                                   </button>
                                   <p className="text-xs text-slate-500 mt-4">Est. Cost: $0.00 (Open Source Infrastructure)</p>
                               </div>
                           ) : (
                               <div className="space-y-4">
                                   <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                       <div className="h-full bg-purple-500 transition-all duration-300" style={{width: `${trainingJob.progress}%`}}></div>
                                   </div>
                                   <div className="bg-black rounded-lg p-4 font-mono text-xs text-slate-300 h-40 overflow-y-auto border border-slate-800">
                                       {trainingJob.log.map((l, i) => (
                                           <div key={i}>{l}</div>
                                       ))}
                                   </div>
                                   
                                   {trainingJob.iqScore && (
                                       <div className="grid grid-cols-4 gap-2 mt-4">
                                           <div className="bg-slate-800 p-2 rounded text-center">
                                               <div className="text-[10px] text-slate-500 font-bold uppercase">MMLU</div>
                                               <div className="text-lg font-bold text-white">{trainingJob.iqScore.mmlu.toFixed(1)}</div>
                                           </div>
                                           <div className="bg-slate-800 p-2 rounded text-center">
                                               <div className="text-[10px] text-slate-500 font-bold uppercase">Reasoning</div>
                                               <div className="text-lg font-bold text-white">{trainingJob.iqScore.reasoning.toFixed(1)}</div>
                                           </div>
                                           <div className="bg-slate-800 p-2 rounded text-center">
                                               <div className="text-[10px] text-slate-500 font-bold uppercase">Coding</div>
                                               <div className="text-lg font-bold text-white">{trainingJob.iqScore.coding.toFixed(1)}</div>
                                           </div>
                                           <div className="bg-slate-800 p-2 rounded text-center">
                                               <div className="text-[10px] text-slate-500 font-bold uppercase">Safety</div>
                                               <div className="text-lg font-bold text-green-400">{trainingJob.iqScore.safety.toFixed(1)}</div>
                                           </div>
                                       </div>
                                   )}
                               </div>
                           )}
                      </div>
                  </div>

                  <div className="space-y-6">
                       <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 border border-indigo-500/30">
                            <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Activity size={18}/> Live Telemetry</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                    <span className="text-xs text-indigo-200">Active Tensor Cores</span>
                                    <span className="text-lg font-bold text-white">4,096</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                    <span className="text-xs text-indigo-200">VRAM Consumption</span>
                                    <span className="text-lg font-bold text-white">682 GB</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-indigo-200">Bridge Efficiency</span>
                                    <span className="text-lg font-bold text-green-400">99.9%</span>
                                </div>
                            </div>
                       </div>
                       
                       <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-slate-400 text-xs uppercase mb-4 flex items-center gap-2">
                                <GraduationCap size={14}/> Deployment Criteria (IQ Test)
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-slate-300">Min. MMLU Score</span>
                                    <span className="font-mono text-purple-400 bg-slate-950 px-2 rounded">65.0</span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-slate-300">Safety Check</span>
                                    <span className="font-mono text-green-400 bg-slate-950 px-2 rounded">PASS</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2">Models failing the IQ evaluation will be automatically rejected to ensure quality.</p>
                            </div>
                       </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderRAGBuilder = () => (
      <div className="h-full flex">
          {/* Left Panel: Builder */}
          <div className="w-1/3 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
              <h2 className="text-xl font-bold text-white mb-6">Knowledge Ingestion</h2>
              
              {/* Drag Drop Zone */}
              <div 
                className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center mb-6 transition cursor-pointer ${uploadedFile ? 'border-green-500 bg-green-500/10' : 'border-slate-700 hover:border-blue-500 hover:bg-slate-800'}`}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); setUploadedFile('Company_Handbook_2024.pdf'); setIngestionStep('IDLE'); }}
              >
                  {uploadedFile ? (
                      <div className="text-center">
                          <FileText size={32} className="text-green-400 mx-auto mb-2"/>
                          <p className="font-bold text-white text-sm">{uploadedFile}</p>
                          <p className="text-xs text-green-400">Ready to ingest</p>
                      </div>
                  ) : (
                      <div className="text-center text-slate-500">
                          <UploadCloud size={32} className="mx-auto mb-2"/>
                          <p className="text-sm font-bold">Drag PDF/Text files here</p>
                          <p className="text-xs">Supports PDF, MD, TXT, CSV</p>
                      </div>
                  )}
              </div>

              {/* Progress Stepper */}
              <div className="flex-1">
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Pipeline Status</h3>
                  <div className="space-y-6 relative">
                      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-800"></div>
                      {[
                          { id: 'CHUNKING', label: 'BadalChain Native Chunking' },
                          { id: 'EMBEDDING', label: 'Vector Embedding' },
                          { id: 'INDEXING', label: 'HNSW Indexing' }
                      ].map((step, i) => (
                          <div key={step.id} className="relative flex items-center gap-4">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 text-[10px] font-bold ${
                                  ingestionStep === step.id ? 'bg-blue-500 text-white animate-pulse' : 
                                  ingestionStep === 'DONE' || (['CHUNKING', 'EMBEDDING', 'INDEXING'].indexOf(ingestionStep) > i) ? 'bg-green-500 text-white' : 
                                  'bg-slate-800 text-slate-500 border border-slate-700'
                              }`}>
                                  {i + 1}
                              </div>
                              <span className={`text-sm font-bold ${ingestionStep === step.id ? 'text-blue-400' : 'text-slate-400'}`}>{step.label}</span>
                          </div>
                      ))}
                  </div>
                  
                  {ingestLog && (
                      <div className="mt-6 bg-black p-3 rounded font-mono text-xs text-green-400 border border-slate-800">
                          {ingestLog}
                      </div>
                  )}
              </div>

              <button 
                onClick={startRAGIngestion}
                disabled={!uploadedFile || ingestionStep !== 'IDLE'}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                  {ingestionStep === 'IDLE' ? 'Start Ingestion Pipeline' : 'Processing...'}
              </button>
          </div>

          {/* Right Panel: Visualization & Testing */}
          <div className="flex-1 bg-slate-950 p-8 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Semantic Index Viewer</h2>
                  <div className="flex gap-2">
                      <input placeholder="Test Query..." className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs w-64 outline-none focus:border-blue-500 text-white"/>
                      <button className="bg-slate-800 px-3 py-1.5 rounded text-xs font-bold hover:text-white">Search</button>
                  </div>
              </div>

              {/* Visual Grid of Vectors */}
              <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl p-4 overflow-hidden relative">
                  <div className="grid grid-cols-12 gap-1 h-full content-start opacity-50">
                      {Array.from({length: 144}).map((_, i) => (
                          <div 
                            key={i} 
                            className={`aspect-square rounded-sm transition-colors duration-500 ${ingestionStep === 'INDEXING' || ingestionStep === 'DONE' ? `bg-blue-500/${Math.floor(Math.random()*40+10)}` : 'bg-slate-800'}`}
                          ></div>
                      ))}
                  </div>
                  {ingestionStep === 'DONE' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-slate-950/80 backdrop-blur-md p-6 rounded-xl border border-green-500/30 text-center">
                              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-2"/>
                              <h3 className="font-bold text-white text-lg">Index Ready</h3>
                              <p className="text-slate-400 text-sm">1,402 chunks vectorized in 1.2s</p>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      </div>
  );

  const renderFineTuning = () => (
      <div className="h-full flex flex-col p-8 bg-slate-950">
          <div className="flex justify-between items-start mb-8">
              <div>
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Sliders size={24} className="text-orange-400"/> Training Job Control Center</h2>
                  <p className="text-slate-400">Fine-tune foundational models using LoRA (Low-Rank Adaptation) on the Neural Bridge.</p>
              </div>
              <div className="flex gap-4">
                  <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 text-right">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">VRAM Usage</div>
                      <div className="text-xl font-mono text-orange-400">{ftMetrics.vram.toFixed(1)} GB</div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
              {/* Config Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 h-fit">
                  <h3 className="font-bold text-white border-b border-slate-800 pb-2">Hyperparameters</h3>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">Training Epochs</label>
                          <input type="range" min="1" max="10" value={fineTuneParams.epochs} onChange={e => setFineTuneParams({...fineTuneParams, epochs: parseInt(e.target.value)})} className="w-full accent-orange-500"/>
                          <div className="text-right text-xs text-orange-400 font-mono">{fineTuneParams.epochs}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-slate-500 block mb-1">LoRA Rank (r)</label>
                              <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" value={fineTuneParams.loraRank} onChange={e => setFineTuneParams({...fineTuneParams, loraRank: parseInt(e.target.value)})}>
                                  <option value="8">8</option>
                                  <option value="16">16</option>
                                  <option value="32">32</option>
                                  <option value="64">64</option>
                              </select>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-500 block mb-1">LoRA Alpha</label>
                              <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" value={fineTuneParams.loraAlpha} onChange={e => setFineTuneParams({...fineTuneParams, loraAlpha: parseInt(e.target.value)})}/>
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">Learning Rate</label>
                          <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white font-mono" value={fineTuneParams.learningRate}/>
                      </div>
                  </div>

                  <button 
                    onClick={startFineTuning}
                    disabled={ftStatus === 'TRAINING'}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                      {ftStatus === 'TRAINING' ? <RefreshCw className="animate-spin"/> : <Zap size={18}/>}
                      {ftStatus === 'TRAINING' ? 'Training in Progress...' : 'Start LoRA Fine-Tuning'}
                  </button>
              </div>

              {/* Main Monitor */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Chart */}
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
                      <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">Training Loss Curve</h4>
                      <div className="flex-1 min-h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={ftMetrics.loss}>
                                  <defs>
                                      <linearGradient id="colorFt" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                  <XAxis hide />
                                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 4]}/>
                                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                                  <Area type="monotone" dataKey="value" stroke="#f97316" fillOpacity={1} fill="url(#colorFt)" />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Auto-ML Agent Log */}
                  <div className="h-48 bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-hidden flex flex-col">
                      <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-2">
                          <Bot size={14} className="text-blue-400"/>
                          <span className="font-bold text-blue-400">Data Scientist Agent (Auto-ML)</span>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-1">
                          {ftMetrics.logs.length === 0 && <span className="text-slate-600 italic">Waiting to start job...</span>}
                          {ftMetrics.logs.map((log, i) => (
                              <div key={i} className="text-slate-300">
                                  <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                  {log}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
        {/* Main Header */}
        <div className="border-b border-slate-800 bg-slate-900/50 p-4 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-4">
                 <div className="p-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg shadow-lg shadow-red-900/20">
                     <BrainCircuit size={24} className="text-white"/>
                 </div>
                 <div>
                     <h1 className="text-lg font-bold text-white leading-none">BadalChain Studio</h1>
                     <p className="text-[10px] text-slate-400 mt-1 font-medium">Enterprise AI Orchestration & LLM Ops</p>
                 </div>
             </div>
             <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
                  {[
                      { id: 'BUILDER', icon: Workflow, label: 'Pipeline Builder' },
                      { id: 'LLM_BUILDER', icon: Cpu, label: 'LLM Builder' },
                      { id: 'HUB', icon: Library, label: 'Model Hub' },
                      { id: 'RAG', icon: Database, label: 'RAG Manager' },
                      { id: 'FINE_TUNE', icon: Sliders, label: 'Fine-Tuning' },
                  ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id as any)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition ${activeView === tab.id ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-white'}`}
                      >
                          {/* @ts-ignore */}
                          <tab.icon size={14} /> {tab.label}
                      </button>
                  ))}
             </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
            {activeView === 'BUILDER' && renderBuilder()}
            {activeView === 'LLM_BUILDER' && renderLLMBuilder()}
            {activeView === 'RAG' && renderRAGBuilder()}
            {activeView === 'FINE_TUNE' && renderFineTuning()}
            
            {activeView === 'HUB' && (
                <div className="h-full p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {models.map(m => (
                            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-red-500/50 transition group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-slate-800 rounded-lg text-red-400 group-hover:bg-red-500 group-hover:text-white transition">
                                        <Box size={24}/>
                                    </div>
                                    <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded border border-slate-700">{m.updated}</span>
                                </div>
                                <h3 className="font-bold text-white text-lg mb-2 group-hover:text-red-400 transition">{m.name}</h3>
                                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{m.description}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {m.tags.map(t => (
                                        <span key={t} className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-500 font-bold uppercase">{t}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                                    <div className="flex gap-4 text-xs text-slate-500 font-bold">
                                        <span className="flex items-center gap-1"><Download size={12}/> {m.downloads}</span>
                                        <span className="flex items-center gap-1"><ThumbsUp size={12}/> {m.likes}</span>
                                    </div>
                                    <button className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1">Deploy <ArrowRight size={12}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

// Helper components for Graph
const MoreHorizontal = ({size, className}: {size:number, className?:string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
)

const Workflow = ({size, className}: {size:number, className?:string}) => (
     <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>
)

export default AIStudio;