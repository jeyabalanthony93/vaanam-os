
import React, { useState } from 'react';
import { Book, Shield, Lock, FileText, Code, Terminal, Key, CheckCircle2, AlertTriangle, Fingerprint, Loader2, ArrowRight, UserCheck, Layout, Server, Database, Globe, Cpu, Library, Download, Search, BarChart, Megaphone, Gauge, Zap } from 'lucide-react';

const DocumentationHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'PLATFORM' | 'INSTALL' | 'SETUP' | 'API' | 'DEV_GUIDE' | 'CONTENT_BANK' | 'MEGAM_SERVICES' | 'SEO_GUIDELINES'>('PLATFORM');
  
  // Developer Guide Auth State
  const [isAuth, setIsAuth] = useState(false);
  const [authStep, setAuthStep] = useState<'FORM' | '2FA' | 'SUCCESS'>('FORM');
  const [formData, setFormData] = useState({
      email: '',
      phone: '',
      business: '',
      purpose: '',
      consent: false
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsVerifying(true);
      setTimeout(() => {
          setAuthStep('2FA');
          setIsVerifying(false);
      }, 1500);
  };

  const handle2FA = () => {
      setIsVerifying(true);
      setTimeout(() => {
          setAuthStep('SUCCESS');
          setTimeout(() => {
              setIsAuth(true);
              setIsVerifying(false);
          }, 1000);
      }, 2000);
  };

  // Content Renderers
  const renderPlatformDoc = () => (
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div className="border-b border-slate-800 pb-6 mb-6">
              <h1 className="text-4xl font-bold text-white mb-4">Megam OS Platform Documentation</h1>
              <p className="text-lg text-slate-400">The definitive guide to the world's first AI-Native Cloud Operating System.</p>
          </div>
          
          <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-bold text-blue-400 mb-2">Introduction</h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                  Megam OS (formerly SuckSaas) is a browser-based, AI-powered Linux environment designed for infinite scalability. 
                  Built on the <strong>Badal Cloud</strong> infrastructure, it leverages the proprietary <strong>Neural Bridge™</strong> engine 
                  to transform standard CPU instructions into high-performance tensor operations, enabling real-time AI workload execution on commodity hardware.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Server size={18} className="text-purple-400"/> Core Architecture</h4>
                      <p className="text-sm text-slate-400">
                          Micro-kernel architecture running in WebAssembly, connected via secure WebSockets to the Badal Cloud SWGI (SuckSaas Web Gateway Interface).
                      </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Database size={18} className="text-green-400"/> Infinite Storage</h4>
                      <p className="text-sm text-slate-400">
                          Badal Storage uses a distributed sharding algorithm across geo-redundant nodes, offering virtually unlimited capacity to every user instance.
                      </p>
                  </div>
              </div>

              <h3 className="text-xl font-bold text-blue-400 mb-2">Key Features</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-300 mb-6">
                  <li><strong>Neural Bridge Engine:</strong> Real-time x86-to-CUDA translation.</li>
                  <li><strong>Megam360 Offline Suite:</strong> Full productivity tools with local-first sync.</li>
                  <li><strong>BadalChain:</strong> Integrated LLM orchestration and RAG pipeline builder.</li>
                  <li><strong>Agent Hierarchy:</strong> Autonomous multi-agent workforce management.</li>
              </ul>
          </div>
      </div>
  );

  const renderInstallGuide = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2">Installation Guide</h1>
              <p className="text-slate-400">Deploying Megam OS on your local infrastructure or private cloud.</p>
          </div>

          <div className="bg-[#1e1e1e] border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-black">
                  <span className="text-xs font-bold text-slate-400">Terminal</span>
                  <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
              </div>
              <div className="p-6 font-mono text-sm space-y-4">
                  <div>
                      <p className="text-slate-500 mb-1"># 1. Clone the repository</p>
                      <p className="text-blue-300">git clone https://github.com/megamos/core.git</p>
                  </div>
                  <div>
                      <p className="text-slate-500 mb-1"># 2. Initialize the Neural Bridge Adapter</p>
                      <p className="text-blue-300">./megam-cli init --gpu-mode=virtual</p>
                  </div>
                  <div>
                      <p className="text-slate-500 mb-1"># 3. Boot the Kernel</p>
                      <p className="text-blue-300">npm run boot:os</p>
                  </div>
              </div>
          </div>

          <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">System Requirements</h3>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <table className="w-full text-left text-sm text-slate-300">
                      <thead>
                          <tr className="border-b border-slate-700 text-slate-500">
                              <th className="pb-2">Component</th>
                              <th className="pb-2">Minimum</th>
                              <th className="pb-2">Recommended</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                          <tr>
                              <td className="py-2 font-bold">CPU</td>
                              <td className="py-2">2 Cores</td>
                              <td className="py-2">8 Cores (AVX2 Support)</td>
                          </tr>
                          <tr>
                              <td className="py-2 font-bold">RAM</td>
                              <td className="py-2">4 GB</td>
                              <td className="py-2">32 GB</td>
                          </tr>
                          <tr>
                              <td className="py-2 font-bold">Network</td>
                              <td className="py-2">Broadband</td>
                              <td className="py-2">Fiber (1 Gbps) for Neural Bridge</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  );

  const renderSetupGuide = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2">Self-Hosting Setup & Config</h1>
              <p className="text-slate-400">How to configure the Badal Cloud Controller on bare metal.</p>
          </div>

          <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Globe size={20} className="text-blue-400"/> 1. Network Configuration</h3>
                  <p className="text-sm text-slate-300 mb-4">Megam OS requires a specific port range to allow the SWGI WebSocket protocol to function correctly behind Nginx.</p>
                  <pre className="bg-black p-4 rounded text-xs text-green-400 font-mono">
                      server &#123; <br/>
                      &nbsp;&nbsp;listen 443 ssl;<br/>
                      &nbsp;&nbsp;server_name os.megam.local;<br/>
                      &nbsp;&nbsp;location /swgi &#123;<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;proxy_pass http://localhost:8080;<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;proxy_http_version 1.1;<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;proxy_set_header Upgrade $http_upgrade;<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;proxy_set_header Connection "Upgrade";<br/>
                      &nbsp;&nbsp;&#125;<br/>
                      &#125;
                  </pre>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Cpu size={20} className="text-purple-400"/> 2. Neural Bridge Tuning</h3>
                  <p className="text-sm text-slate-300 mb-4">By default, the translation layer allocates 50% of host CPU. Edit <code>/etc/megam/bridge.conf</code> to adjust.</p>
                  <pre className="bg-black p-4 rounded text-xs text-blue-300 font-mono">
                      [Bridge]<br/>
                      Mode=Virtual<br/>
                      Allocation_Ratio=0.85<br/>
                      Enable_Tensor_Emulation=true
                  </pre>
              </div>
          </div>
      </div>
  );

  const renderMegamServices = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2">Megam Digital Services</h1>
              <p className="text-slate-400">Integrated marketing and analytics suite for the decentralized web.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-indigo-500/50 transition group">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 group-hover:text-indigo-400"><Search size={20}/> Megam Search</h3>
                  <p className="text-sm text-slate-400 mb-4">
                      A privacy-first, AI-powered search engine. Unlike traditional engines, Megam Search generates direct answers using RAG over the live web index.
                  </p>
                  <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                      <li>Generative AI Summaries</li>
                      <li>Zero Tracking / No PII Storage</li>
                      <li>Neural Rank™ Algorithm</li>
                  </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-orange-500/50 transition group">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 group-hover:text-orange-400"><Megaphone size={20}/> Megam Ad Manager</h3>
                  <p className="text-sm text-slate-400 mb-4">
                      Contextual advertising platform. Reach users based on intent, not identity.
                  </p>
                  <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                      <li>CPC / CPM Bidding Strategies</li>
                      <li>Real-time ROI Simulation</li>
                      <li>Keyword & Semantic Targeting</li>
                  </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-blue-500/50 transition group">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 group-hover:text-blue-400"><BarChart size={20}/> Megam Analytics (MA4)</h3>
                  <p className="text-sm text-slate-400 mb-4">
                      Privacy-centric alternative to GA4. Measures engagement without cookies.
                  </p>
                  <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                      <li>Heatmaps & Session Replay</li>
                      <li>Conversion Funnels</li>
                      <li>Server-Side Tracking</li>
                  </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-green-500/50 transition group">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 group-hover:text-green-400"><Gauge size={20}/> Search Console</h3>
                  <p className="text-sm text-slate-400 mb-4">
                      Monitor your site's presence in Megam Search results.
                  </p>
                  <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                      <li>Index Coverage Reports</li>
                      <li>Core Web Vitals Monitoring</li>
                      <li>Sitemap Submission</li>
                  </ul>
              </div>
          </div>
      </div>
  );

  const renderSeoGuidelines = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2">Megam SEO Guidelines</h1>
              <p className="text-slate-400">Optimize your content for the Neural Rank™ algorithm.</p>
          </div>

          <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Zap size={20} className="text-yellow-400"/> Understanding Neural Rank</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                  Unlike PageRank (links) or traditional keyword density, Neural Rank evaluates the <strong>semantic utility</strong> of content. 
                  AI Agents crawl your site and simulate "user satisfaction" to determine ranking.
              </p>
          </div>

          <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="font-bold text-white mb-4">Technical Requirements</h3>
                  <ul className="space-y-3 text-sm text-slate-400">
                      <li className="flex gap-2">
                          <CheckCircle2 size={16} className="text-green-500 shrink-0"/>
                          <span><strong>Semantic HTML:</strong> Use proper header hierarchy (H1-H6) to help AI parse structure.</span>
                      </li>
                      <li className="flex gap-2">
                          <CheckCircle2 size={16} className="text-green-500 shrink-0"/>
                          <span><strong>Fast Loading:</strong> Megam Crawler times out after 200ms. Ensure efficient SWGI responses.</span>
                      </li>
                      <li className="flex gap-2">
                          <CheckCircle2 size={16} className="text-green-500 shrink-0"/>
                          <span><strong>Structured Data:</strong> Implement Schema.org JSON-LD for rich snippets in AI Overviews.</span>
                      </li>
                  </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="font-bold text-white mb-4">Content Strategy</h3>
                  <ul className="space-y-3 text-sm text-slate-400">
                      <li className="flex gap-2">
                          <CheckCircle2 size={16} className="text-blue-500 shrink-0"/>
                          <span><strong>Answer First:</strong> Provide direct answers to questions in the first paragraph.</span>
                      </li>
                      <li className="flex gap-2">
                          <CheckCircle2 size={16} className="text-blue-500 shrink-0"/>
                          <span><strong>Authority:</strong> Cite sources using outbound links to reputable Badal Knowledge Bases.</span>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
  );

  const renderApiReference = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2">Badal API Reference</h1>
              <p className="text-slate-400">Interact with the core OS services programmatically via REST/WebSocket.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                  <span className="font-bold text-white">Endpoints</span>
                  <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">v1.2 (Stable)</span>
              </div>
              <div className="divide-y divide-slate-800">
                  <div className="p-4 hover:bg-slate-800/30">
                      <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-blue-600 rounded text-xs font-bold text-white">POST</span>
                          <code className="text-slate-300 font-mono text-sm">/v1/auth/token</code>
                      </div>
                      <p className="text-sm text-slate-400">Exchange client credentials for a session JWT.</p>
                  </div>
                  <div className="p-4 hover:bg-slate-800/30">
                      <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-green-600 rounded text-xs font-bold text-white">GET</span>
                          <code className="text-slate-300 font-mono text-sm">/v1/storage/fs/ls</code>
                      </div>
                      <p className="text-sm text-slate-400">List files in a specific bucket directory.</p>
                  </div>
                  <div className="p-4 hover:bg-slate-800/30">
                      <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-purple-600 rounded text-xs font-bold text-white">WS</span>
                          <code className="text-slate-300 font-mono text-sm">wss://api.megamos.com/v1/agent/connect</code>
                      </div>
                      <p className="text-sm text-slate-400">Real-time bi-directional stream for AI Agent commands.</p>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderContentBank = () => (
      <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><Library size={32} className="text-indigo-500"/> Content Bank</h1>
              <p className="text-slate-400">Curated resources, whitepapers, and guides for the Megam Ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                  { type: 'BLOG', title: 'Scaling to Infinity with Badal Storage', date: 'Oct 24, 2024', desc: 'Deep dive into the sharding algorithms that power our petabyte-scale storage.' },
                  { type: 'RESOURCE', title: 'Neural Bridge Architecture Whitepaper', date: 'Sep 12, 2024', desc: 'Technical breakdown of x86-to-CUDA translation layers.' },
                  { type: 'GUIDE', title: 'Migrating from AWS to Badal Cloud', date: 'Aug 05, 2024', desc: 'Step-by-step guide to move your infrastructure and save 80%.' },
                  { type: 'BLOG', title: 'The Future of AI Agents in the Enterprise', date: 'Nov 01, 2024', desc: 'How autonomous agents are replacing traditional SaaS workflows.' },
              ].map((item, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-indigo-500/50 transition cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded border ${item.type === 'BLOG' ? 'bg-blue-900/20 text-blue-400 border-blue-500/30' : item.type === 'RESOURCE' ? 'bg-purple-900/20 text-purple-400 border-purple-500/30' : 'bg-green-900/20 text-green-400 border-green-500/30'}`}>
                              {item.type}
                          </span>
                          <span className="text-slate-500 text-xs">{item.date}</span>
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2 group-hover:text-indigo-400 transition">{item.title}</h3>
                      <p className="text-sm text-slate-400 mb-4">{item.desc}</p>
                      <div className="flex items-center text-xs font-bold text-slate-500 group-hover:text-white transition gap-2">
                          Read More <ArrowRight size={12}/>
                      </div>
                  </div>
              ))}
          </div>

          <div className="bg-gradient-to-r from-indigo-900/20 to-blue-900/20 border border-indigo-500/30 rounded-xl p-8 flex items-center justify-between">
              <div>
                  <h3 className="text-xl font-bold text-white mb-2">Megam Server ISO</h3>
                  <p className="text-slate-300 text-sm">Download the bare-metal installer for your own data center.</p>
              </div>
              <button className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-50 transition">
                  <Download size={18}/> Download v2.0
              </button>
          </div>
      </div>
  );

  const renderDevGuide = () => {
      if (!isAuth) {
          return (
              <div className="h-full flex items-center justify-center p-8">
                  <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                      
                      {authStep === 'FORM' && (
                          <div className="animate-in fade-in slide-in-from-right duration-300">
                              <div className="text-center mb-8">
                                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                      <Lock size={32} className="text-red-500"/>
                                  </div>
                                  <h2 className="text-2xl font-bold text-white">Restricted Access</h2>
                                  <p className="text-slate-400 text-sm mt-2">
                                      The Developer Architecture Guide contains sensitive proprietary framework information. 
                                      Please identify yourself to proceed.
                                  </p>
                              </div>

                              <form onSubmit={handleFormSubmit} className="space-y-4">
                                  <div>
                                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Business Email</label>
                                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm text-white focus:border-red-500 outline-none transition"/>
                                  </div>
                                  <div>
                                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Phone Number</label>
                                      <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm text-white focus:border-red-500 outline-none transition"/>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Business Name</label>
                                          <input required type="text" value={formData.business} onChange={e => setFormData({...formData, business: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm text-white focus:border-red-500 outline-none transition"/>
                                      </div>
                                      <div>
                                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Purpose</label>
                                          <select required value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm text-white focus:border-red-500 outline-none transition">
                                              <option value="">Select...</option>
                                              <option value="integration">Integration</option>
                                              <option value="partnership">Partnership</option>
                                              <option value="audit">Security Audit</option>
                                          </select>
                                      </div>
                                  </div>
                                  
                                  <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded border border-slate-800">
                                      <input required type="checkbox" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} className="mt-1 accent-red-500"/>
                                      <p className="text-xs text-slate-400">
                                          I consent to Megam OS collecting my browser cache fingerprints and session data for security verification purposes.
                                      </p>
                                  </div>

                                  <button type="submit" disabled={isVerifying} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 transition disabled:opacity-50">
                                      {isVerifying ? <Loader2 className="animate-spin" size={18}/> : <ArrowRight size={18}/>}
                                      Verify Identity
                                  </button>
                              </form>
                          </div>
                      )}

                      {authStep === '2FA' && (
                          <div className="text-center animate-in fade-in slide-in-from-right duration-300">
                              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                  <Fingerprint size={32} className="text-orange-500"/>
                              </div>
                              <h2 className="text-2xl font-bold text-white">Two-Factor Auth</h2>
                              <p className="text-slate-400 text-sm mt-2 mb-6">
                                  A verification signal has been sent to your registered device. Please confirm the biometrics.
                              </p>
                              <div className="flex justify-center gap-2 mb-8">
                                  {[1,2,3,4,5,6].map(i => (
                                      <div key={i} className="w-3 h-3 bg-slate-700 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>
                                  ))}
                              </div>
                              <button onClick={handle2FA} disabled={isVerifying} className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 transition disabled:opacity-50">
                                  {isVerifying ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle2 size={18}/>}
                                  Confirm Biometrics
                              </button>
                          </div>
                      )}

                      {authStep === 'SUCCESS' && (
                          <div className="text-center animate-in fade-in zoom-in duration-300 py-10">
                              <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4"/>
                              <h2 className="text-2xl font-bold text-white">Access Granted</h2>
                              <p className="text-green-400 text-sm mt-2">Redirecting to Secure Hub...</p>
                          </div>
                      )}
                  </div>
              </div>
          )
      }

      return (
          <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
              <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 p-6 rounded-xl flex items-center justify-between">
                  <div>
                      <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Lock size={24} className="text-red-500"/> Megam Core Developer Hub</h1>
                      <p className="text-slate-400 text-sm mt-1">Confidential • Internal Use Only • Session ID: {Date.now().toString(36).toUpperCase()}</p>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-xs font-bold flex items-center gap-2">
                      <UserCheck size={14}/> Verified: {formData.email || 'Admin'}
                  </div>
              </div>

              <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white">System Architecture Deep Dive</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Cpu size={18} className="text-purple-400"/> Neural Bridge (x86-CUDA)</h3>
                          <p className="text-sm text-slate-300 leading-relaxed">
                              The Neural Bridge uses a Just-In-Time (JIT) transpiler that intercepts PyTorch tensor operations. Instead of dispatching to a physical GPU, it breaks down matrix multiplications into vectorized AVX-512 instructions optimized for CPU caches.
                          </p>
                          <div className="mt-4 bg-black p-3 rounded text-xs font-mono text-purple-300">
                              // pseudocode<br/>
                              intercept(torch.matmul) -> translate(PTX) -> optimize(AVX512) -> execute(CPU)
                          </div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Globe size={18} className="text-blue-400"/> SWGI Protocol</h3>
                          <p className="text-sm text-slate-300 leading-relaxed">
                              SuckSaas Web Gateway Interface (SWGI) replaces traditional WSGI. It maintains persistent WebSocket connections for stateful AI agents, allowing server-initiated pushes for tool outputs and intermediate reasoning steps.
                          </p>
                      </div>
                  </div>

                  <h2 className="text-xl font-bold text-white mt-8">Architecture Decision Record (ADR): Why Open Source?</h2>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-slate-800/50 text-slate-400">
                              <tr>
                                  <th className="p-4">Proprietary Tool</th>
                                  <th className="p-4">Replaced With (Open Source)</th>
                                  <th className="p-4">Business Justification</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 text-slate-300">
                              {[
                                  { prop: 'AWS S3 / Google Drive', open: 'MinIO / Ceph (Badal Storage)', reason: 'Eliminated per-GB egress fees. Full data sovereignty and local encryption.' },
                                  { prop: 'OpenAI API (GPT-4)', open: 'Llama-3 / Mistral (BadalChain)', reason: 'Zero token costs. Fine-tuned on proprietary data without privacy leakage.' },
                                  { prop: 'Vercel / Netlify', open: 'Nginx + Docker (Megam Server)', reason: 'Avoided "Serverless Cold Start" latency. Fixed cost infrastructure scaling.' },
                                  { prop: 'Auth0 / Okta', open: 'Keycloak / Ory (Badal Auth)', reason: 'Unlimited MAU (Monthly Active Users) without licensing tiers.' },
                                  { prop: 'Datadog / NewRelic', open: 'Prometheus + Grafana', reason: 'Custom metric retention policies and no data ingestion overage fees.' },
                                  { prop: 'Microsoft 365', open: 'LibreOffice + Nextcloud (Megam360)', reason: 'Complete offline capability and ownership of document formats.' },
                              ].map((item, i) => (
                                  <tr key={i} className="hover:bg-slate-800/30">
                                      <td className="p-4 font-bold text-red-400">{item.prop}</td>
                                      <td className="p-4 font-bold text-green-400">{item.open}</td>
                                      <td className="p-4 text-slate-300 leading-relaxed">{item.reason}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <Book size={20}/>
              </div>
              <h1 className="text-lg font-bold text-white">Megam Docs Hub</h1>
          </div>
          <div className="flex gap-2">
              <input placeholder="Search documentation..." className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs w-64 focus:border-blue-500 outline-none text-white"/>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col p-4 gap-2">
              <button onClick={() => setActiveSection('PLATFORM')} className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center gap-3 ${activeSection === 'PLATFORM' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  <Layout size={16}/> Platform Overview
              </button>
              <button onClick={() => setActiveSection('MEGAM_SERVICES')} className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center gap-3 ${activeSection === 'MEGAM_SERVICES' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  <Globe size={16}/> Megam Services
              </button>
              <button onClick={() => setActiveSection('SEO_GUIDELINES')} className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center gap-3 ${activeSection === 'SEO_GUIDELINES' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  <Zap size={16}/> SEO Guidelines
              </button>
              <button onClick={() => setActiveSection('INSTALL')} className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center gap-3 ${activeSection === 'INSTALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  <Terminal size={16}/> Installation Guide
              </button>
              <button onClick={() => setActiveSection('SETUP')} className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center gap-3 ${activeSection === 'SETUP' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  <Code size={16}/> Setup & How-to
              </button>
              <button onClick={() => setActiveSection('API')} className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center gap-3 ${activeSection === 'API' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  <Key size={16}/> API Reference
              </button>
              <button onClick={() => setActiveSection('CONTENT_BANK')} className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center gap-3 ${activeSection === 'CONTENT_BANK' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  <Library size={16}/> Content Bank
              </button>
              
              <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2">Restricted Area</div>
                  <button onClick={() => setActiveSection('DEV_GUIDE')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition flex items-center gap-3 border ${activeSection === 'DEV_GUIDE' ? 'bg-red-600 text-white border-red-500' : 'text-red-400 border-red-900/30 hover:bg-red-900/10'}`}>
                      <Shield size={16}/> Developer Guide
                  </button>
              </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-slate-950 relative">
              {activeSection === 'PLATFORM' && renderPlatformDoc()}
              {activeSection === 'MEGAM_SERVICES' && renderMegamServices()}
              {activeSection === 'SEO_GUIDELINES' && renderSeoGuidelines()}
              {activeSection === 'INSTALL' && renderInstallGuide()}
              {activeSection === 'SETUP' && renderSetupGuide()}
              {activeSection === 'API' && renderApiReference()}
              {activeSection === 'CONTENT_BANK' && renderContentBank()}
              {activeSection === 'DEV_GUIDE' && renderDevGuide()}
          </div>
      </div>
    </div>
  );
};

export default DocumentationHub;
