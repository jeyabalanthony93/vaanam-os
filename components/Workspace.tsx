import React, { useState } from 'react';
import { FileText, Wand2, Save, Share2, Code, Table, Play, TerminalSquare, Layout, FileSpreadsheet, Mail, Inbox, Send, AlertOctagon, PenSquare, Settings, CheckCircle2, Shield, Globe, Server, Trash2, Search, Paperclip, MoreHorizontal, X, Reply, Kanban, Plus, UserCircle2, Clock, Box } from 'lucide-react';
import { generateDocumentContent, runIdeCode, generateSheetFormula, generateEmailContent } from '../services/geminiService';
import { Email, KanbanTask } from '../types';

type ToolType = 'DOCS' | 'SHEETS' | 'IDE' | 'SLIDES' | 'MAIL' | 'PROJECTS';

const Workspace: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('DOCS');
  
  // Docs State
  const [docContent, setDocContent] = useState<string>("# Project Alpha Architecture\n\n## Introduction\nThis document outlines the scalable architecture for the new cloud deployment.\n\n");
  
  // IDE State
  const [codeContent, setCodeContent] = useState<string>("// Python Cloud Function\ndef main(request):\n    print('Handling secure request...')\n    return {'status': 200, 'message': 'Scalable Success'}");
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Sheets State
  const [sheetData, setSheetData] = useState<string[][]>([
     ['Metric', 'Q1', 'Q2', 'Q3', 'Growth'],
     ['Revenue', '12000', '15500', '18200', '=FORMULA'],
     ['Users', '450', '890', '1200', '=FORMULA'],
     ['Cost', '5000', '5200', '5400', '=FORMULA']
  ]);

  // Projects (Kanban) State
  const [tasks, setTasks] = useState<KanbanTask[]>([
      { id: 't1', title: 'Design DB Schema', tag: 'Backend', status: 'DONE', assignee: 'Architect' },
      { id: 't2', title: 'Integrate ETL Pipeline', tag: 'Data', status: 'IN_PROGRESS', assignee: 'Data Engineer' },
      { id: 't3', title: 'Q3 Financial Report', tag: 'Finance', status: 'TODO', assignee: 'CFO Agent' },
      { id: 't4', title: 'Audit Security Logs', tag: 'SecOps', status: 'REVIEW', assignee: 'SecBot' },
  ]);

  // Mail State
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'spam' | 'drafts' | 'trash'>('inbox');
  const [showMailSettings, setShowMailSettings] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1', from: 'admin@megamos.com', to: 'me@megamos.com', subject: 'Server Capacity Upgrade', 
      preview: 'Your request for additional GPU clusters has been approved...',
      content: 'Your request for additional GPU clusters has been approved. The virtual H100s are now available in your infrastructure panel.\n\nPlease configure your neural bridge settings accordingly.\n\nRegards,\nAdmin Team',
      date: '10:42 AM', read: false, folder: 'inbox', tags: ['System']
    },
    {
        id: '2', from: 'security@cloud-guard.ai', to: 'me@megamos.com', subject: 'Security Alert: New Login', 
        preview: 'We detected a new login from IP 10.0.0.5...',
        content: 'We detected a new login from IP 10.0.0.5 via the VPN gateway. If this was not you, please rotate your API keys immediately.',
        date: 'Yesterday', read: true, folder: 'inbox', tags: ['Urgent']
    }
  ]);

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Handlers
  const handleAiAction = async () => {
    if (!aiPrompt.trim()) return;
    setIsProcessing(true);

    if (activeTool === 'DOCS') {
        const newContent = await generateDocumentContent(aiPrompt, docContent);
        setDocContent(prev => prev + '\n' + newContent);
    } else if (activeTool === 'IDE') {
        const newCode = `\n# AI Generated: ${aiPrompt}\nprint("AI Code Implementation")`;
        setCodeContent(prev => prev + newCode);
    } else if (activeTool === 'SHEETS') {
         const result = await generateSheetFormula(aiPrompt);
         alert(`AI Suggestion: ${result}`);
    } else if (activeTool === 'MAIL') {
        let request = aiPrompt;
        
        // If we are composing and have a selected email (replying), or simply reading an email
        if (selectedEmail && (isComposing || !isComposing)) {
             request = `CONTEXT: User is replying to an email.\nFROM: ${selectedEmail.from}\nSUBJECT: ${selectedEmail.subject}\nORIGINAL CONTENT: "${selectedEmail.content}"\n\nTASK: Write a reply based on this user instruction: ${aiPrompt}`;
        }

        const generatedContent = await generateEmailContent(request);

        if (isComposing) {
            setComposeBody(generatedContent);
        } else if (selectedEmail) {
            // Reading mode - initiate reply with generated content
            handleReply(selectedEmail, generatedContent);
        } else {
            // New email composition
            handleCompose();
            setComposeBody(generatedContent);
        }
    }

    setAiPrompt('');
    setIsProcessing(false);
  };

  const executeCode = async () => {
      setIsProcessing(true);
      setConsoleOutput("Compiling and deploying to container...");
      const result = await runIdeCode(codeContent, 'python');
      setConsoleOutput(result);
      setIsProcessing(false);
  };

  const applyTemplate = (template: string) => {
      let code = '';
      if (template === 'FastAPI') {
          code = `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef read_root():\n    return {"Hello": "Megam OS"}\n\n@app.get("/items/{item_id}")\ndef read_item(item_id: int, q: str = None):\n    return {"item_id": item_id, "q": q}`;
      } else if (template === 'PyTorch') {
          code = `import torch\nimport torch.nn as nn\nimport torch.optim as optim\n\n# Define model\nclass NeuralNet(nn.Module):\n    def __init__(self):\n        super(NeuralNet, self).__init__()\n        self.fc1 = nn.Linear(10, 5)\n        self.fc2 = nn.Linear(5, 1)\n\n    def forward(self, x):\n        return self.fc2(torch.relu(self.fc1(x)))\n\nmodel = NeuralNet()\nprint(model)`;
      } else if (template === 'Django') {
          code = `from django.http import HttpResponse\nfrom django.urls import path\n\ndef index(request):\n    return HttpResponse("Hello, world. You're at the polls index.")\n\nurlpatterns = [\n    path('', index, name='index'),\n]`;
      } else if (template === 'Scrapy') {
          code = `import scrapy\n\nclass QuotesSpider(scrapy.Spider):\n    name = "quotes"\n    start_urls = ['http://quotes.toscrape.com/page/1/']\n\n    def parse(self, response):\n        for quote in response.css('div.quote'):\n            yield {\n                'text': quote.css('span.text::text').get(),\n                'author': quote.css('small.author::text').get(),\n            }`;
      }
      setCodeContent(code);
      setShowTemplates(false);
  };

  const handleCompose = () => {
      setIsComposing(true);
      setShowMailSettings(false);
      setSelectedEmail(null); // Clear context for fresh email
      setComposeSubject('');
      setComposeBody('');
      setComposeTo('');
  };

  const handleReply = (email: Email, predefinedBody?: string) => {
      setComposeTo(email.from);
      setComposeSubject(`Re: ${email.subject}`);
      setComposeBody(predefinedBody || `\n\n> On ${email.date}, ${email.from} wrote:\n> ${email.preview}`);
      setIsComposing(true);
      // We do NOT nullify selectedEmail here, so AI knows context
  };

  const handleDelete = (id: string) => {
      setEmails(prev => prev.filter(e => e.id !== id));
      setSelectedEmail(null);
  };

  const handleSendEmail = () => {
      setIsProcessing(true);
      setTimeout(() => {
          const newEmail: Email = {
              id: Date.now().toString(),
              from: 'superuser@megamos.com',
              to: composeTo,
              subject: composeSubject,
              preview: composeBody.substring(0, 50) + '...',
              content: composeBody,
              date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              read: true,
              folder: 'sent',
              tags: []
          };
          setEmails(prev => [newEmail, ...prev]);
          setIsComposing(false);
          setComposeTo('');
          setComposeSubject('');
          setComposeBody('');
          setIsProcessing(false);
          setActiveFolder('sent');
      }, 1000);
  };

  const renderKanban = () => (
      <div className="flex-1 overflow-x-auto p-8 bg-slate-100">
          <div className="flex gap-6 h-full min-w-max">
              {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map(status => (
                  <div key={status} className="w-72 flex flex-col bg-slate-200/50 rounded-xl p-4 border border-slate-300">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-slate-600 text-sm uppercase">{status.replace('_', ' ')}</h3>
                          <span className="bg-white px-2 py-0.5 rounded text-xs text-slate-500 font-bold border border-slate-200">
                              {tasks.filter(t => t.status === status).length}
                          </span>
                      </div>
                      <div className="flex-1 space-y-3 overflow-y-auto">
                          {tasks.filter(t => t.status === status).map(task => (
                              <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab hover:shadow-md transition">
                                  <div className="text-xs font-bold text-indigo-500 mb-1">{task.tag}</div>
                                  <div className="text-sm font-semibold text-slate-800 mb-3">{task.title}</div>
                                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                      <div className="flex items-center gap-2 text-xs text-slate-500">
                                          <UserCircle2 size={14}/> {task.assignee || 'Unassigned'}
                                      </div>
                                      <Clock size={14} className="text-slate-400"/>
                                  </div>
                              </div>
                          ))}
                          <button 
                            onClick={() => {
                                const newTitle = prompt("Task Title:");
                                if(newTitle) setTasks([...tasks, { id: Date.now().toString(), title: newTitle, tag: 'General', status: status as any, assignee: 'Me' }])
                            }}
                            className="w-full py-2 border border-dashed border-slate-400 rounded-lg text-slate-500 hover:bg-white transition text-xs font-bold flex items-center justify-center gap-2"
                          >
                              <Plus size={14}/> Add Task
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderMailApp = () => (
      <div className="flex-1 flex bg-white overflow-hidden">
        {/* Mail Sidebar */}
        <div className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col justify-between">
            <div>
                <div className="p-4">
                    <button 
                        onClick={handleCompose}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
                    >
                        <PenSquare size={18} /> Compose
                    </button>
                </div>
                <nav className="space-y-1 px-3">
                    <FolderButton icon={Inbox} label="Inbox" count={emails.filter(e => e.folder === 'inbox' && !e.read).length} isActive={activeFolder === 'inbox' && !showMailSettings} onClick={() => { setActiveFolder('inbox'); setShowMailSettings(false); setIsComposing(false); }} />
                    <FolderButton icon={Send} label="Sent" isActive={activeFolder === 'sent' && !showMailSettings} onClick={() => { setActiveFolder('sent'); setShowMailSettings(false); setIsComposing(false); }} />
                    <FolderButton icon={FileText} label="Drafts" isActive={activeFolder === 'drafts' && !showMailSettings} onClick={() => { setActiveFolder('drafts'); setShowMailSettings(false); setIsComposing(false); }} />
                    <FolderButton icon={AlertOctagon} label="Spam" isActive={activeFolder === 'spam' && !showMailSettings} onClick={() => { setActiveFolder('spam'); setShowMailSettings(false); setIsComposing(false); }} />
                    <FolderButton icon={Trash2} label="Trash" isActive={activeFolder === 'trash' && !showMailSettings} onClick={() => { setActiveFolder('trash'); setShowMailSettings(false); setIsComposing(false); }} />
                </nav>
            </div>
            
            <div className="p-3 border-t border-slate-200">
                 <button 
                    onClick={() => { setShowMailSettings(true); setIsComposing(false); setSelectedEmail(null); }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-3 transition ${showMailSettings ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <Settings size={18} /> Admin Settings
                </button>
            </div>
        </div>

        {/* Mail Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
            
            {/* 1. SETTINGS VIEW */}
            {showMailSettings ? (
                <div className="flex-1 overflow-y-auto p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Server className="text-indigo-600"/> Mail Server Configuration
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Globe size={18}/> Domain Records</h3>
                            <div className="space-y-4">
                                <DnsRecord type="MX" host="@" value="mail.megamos.com" priority={10} status="Active" />
                                <DnsRecord type="SPF" host="@" value="v=spf1 include:_spf.megam.com ~all" status="Active" />
                                <DnsRecord type="DKIM" host="default._domainkey" value="v=DKIM1; k=rsa; p=MIIBIj..." status="Active" />
                                <DnsRecord type="DMARC" host="_dmarc" value="v=DMARC1; p=reject; rua=mailto:..." status="Pending" />
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                             <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Shield size={18}/> Security Policies</h3>
                             <div className="space-y-3">
                                 <div className="flex items-center justify-between p-3 bg-white rounded border border-slate-200">
                                     <div className="text-sm font-medium text-slate-700">TLS Encryption (StartTLS)</div>
                                     <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Enforced</div>
                                 </div>
                                 <div className="flex items-center justify-between p-3 bg-white rounded border border-slate-200">
                                     <div className="text-sm font-medium text-slate-700">Spam Filtering (AI)</div>
                                     <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold">High Sensitivity</div>
                                 </div>
                                 <div className="flex items-center justify-between p-3 bg-white rounded border border-slate-200">
                                     <div className="text-sm font-medium text-slate-700">Storage Quota</div>
                                     <div className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-bold">Unlimited</div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            ) : isComposing ? (
                /* 2. COMPOSE VIEW */
                <div className="flex-1 flex flex-col animate-in fade-in duration-200">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-semibold text-slate-700 flex items-center gap-2"><PenSquare size={18}/> New Message</h3>
                        <div className="flex gap-2">
                             <button onClick={() => setIsComposing(false)} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={18} className="text-slate-500"/></button>
                        </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <input 
                                placeholder="To" 
                                value={composeTo}
                                onChange={e => setComposeTo(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-indigo-500 transition"
                            />
                            <div className="flex gap-2">
                                <input 
                                    placeholder="Cc" 
                                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs focus:ring-2 focus:ring-indigo-500 transition"
                                />
                                <input 
                                    placeholder="Bcc" 
                                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs focus:ring-2 focus:ring-indigo-500 transition"
                                />
                            </div>
                        </div>
                        <input 
                            placeholder="Subject" 
                            value={composeSubject}
                            onChange={e => setComposeSubject(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition"
                        />
                        <div className="flex-1 relative">
                            <textarea 
                                placeholder="Write your message here... Use AI Copilot for help." 
                                value={composeBody}
                                onChange={e => setComposeBody(e.target.value)}
                                className="w-full h-full resize-none outline-none text-sm text-slate-700 p-4 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition font-serif leading-relaxed"
                            />
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button className="p-2 bg-slate-200 hover:bg-slate-300 rounded text-slate-600 transition" title="Attach File"><Paperclip size={18}/></button>
                                <button className="p-2 bg-slate-200 hover:bg-slate-300 rounded text-slate-600 transition" title="Formatting"><Layout size={18}/></button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <div className="text-xs text-slate-400">
                                Draft saved automatically
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setIsComposing(false)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition">Discard</button>
                                <button 
                                    onClick={handleSendEmail}
                                    disabled={!composeTo || isProcessing}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    {isProcessing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={16} />}
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* 3. MAIL LIST & READER VIEW */
                <div className="flex-1 flex overflow-hidden">
                    {/* List */}
                    <div className={`${selectedEmail ? 'hidden lg:flex lg:w-80' : 'w-full'} flex-col border-r border-slate-200 bg-white`}>
                        <div className="p-3 border-b border-slate-200">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input placeholder="Search mail..." className="w-full bg-slate-100 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {emails.filter(e => e.folder === activeFolder).length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">Folder is empty</div>
                            ) : (
                                emails.filter(e => e.folder === activeFolder).map(email => (
                                    <div 
                                        key={email.id} 
                                        onClick={() => setSelectedEmail(email)}
                                        className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition ${selectedEmail?.id === email.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'} ${!email.read ? 'bg-slate-50' : ''}`}
                                    >
                                        <div className="flex justify-between mb-1">
                                            <span className={`text-sm truncate max-w-[140px] ${!email.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                                {activeFolder === 'sent' ? `To: ${email.to}` : email.from}
                                            </span>
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{email.date}</span>
                                        </div>
                                        <div className={`text-xs mb-1 truncate ${!email.read ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{email.subject}</div>
                                        <div className="text-xs text-slate-400 truncate">{email.preview}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Reader */}
                    {selectedEmail ? (
                        <div className="flex-1 flex flex-col bg-white animate-in fade-in duration-200">
                             <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setSelectedEmail(null)} className="lg:hidden p-2 hover:bg-slate-200 rounded-full"><X size={18}/></button>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleReply(selectedEmail)} className="p-2 text-slate-500 hover:bg-slate-200 rounded hover:text-indigo-600 transition" title="Reply"><Reply size={18}/></button>
                                        <button onClick={() => handleDelete(selectedEmail.id)} className="p-2 text-slate-500 hover:bg-slate-200 rounded hover:text-red-600 transition" title="Delete"><Trash2 size={18}/></button>
                                        <button className="p-2 text-slate-500 hover:bg-slate-200 rounded transition" title="Forward"><Share2 size={18}/></button>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={18}/></button>
                             </div>
                             
                             <div className="p-8 overflow-y-auto flex-1">
                                 <div className="flex items-start justify-between mb-6">
                                     <h2 className="text-2xl font-bold text-slate-800 leading-tight">{selectedEmail.subject}</h2>
                                     {selectedEmail.tags && selectedEmail.tags.length > 0 && (
                                         <div className="flex gap-2">
                                             {selectedEmail.tags.map(t => (
                                                 <span key={t} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded uppercase">{t}</span>
                                             ))}
                                         </div>
                                     )}
                                 </div>
                                 
                                 <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-md">
                                         {selectedEmail.from[0].toUpperCase()}
                                     </div>
                                     <div className="flex-1">
                                         <div className="flex justify-between items-baseline">
                                             <div className="font-bold text-slate-900 text-sm">{selectedEmail.from}</div>
                                             <div className="text-xs text-slate-500">{selectedEmail.date}</div>
                                         </div>
                                         <div className="text-xs text-slate-500">to <span className="text-slate-700">{selectedEmail.to}</span></div>
                                     </div>
                                 </div>
                                 
                                 <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                     {selectedEmail.content}
                                 </div>
                                 
                                 {/* Attachments Mock */}
                                 <div className="mt-8 pt-6 border-t border-slate-100">
                                     <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Attachments (0)</h4>
                                     <div className="text-xs text-slate-400 italic">No attachments found.</div>
                                 </div>
                             </div>
                             
                             {/* Quick Reply */}
                             <div className="p-4 bg-slate-50 border-t border-slate-200">
                                <div className="flex gap-2 mb-2">
                                    <button onClick={() => handleReply(selectedEmail, "Agreed, thanks.")} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition">Agreed, thanks.</button>
                                    <button onClick={() => handleReply(selectedEmail, "Will review shortly.")} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition">Will review shortly.</button>
                                    <button onClick={() => handleReply(selectedEmail, "Please schedule a call.")} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition">Please schedule a call.</button>
                                </div>
                                <button 
                                    onClick={() => handleReply(selectedEmail)}
                                    className="w-full text-left px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-500 hover:border-indigo-400 transition"
                                >
                                    Click here to <span className="text-indigo-600 font-medium">Reply</span> or <span className="text-indigo-600 font-medium">Forward</span>
                                </button>
                             </div>
                        </div>
                    ) : (
                        <div className="flex-1 hidden lg:flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                                <Mail size={48} className="text-slate-400" />
                            </div>
                            <p className="text-sm font-medium">Select an email to read</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
  );

  return (
    <div className="h-full flex bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Sidebar App Switcher */}
      <div className="w-16 bg-slate-900 flex flex-col items-center py-6 gap-6 border-r border-slate-800 z-20 shrink-0">
         <button onClick={() => setActiveTool('DOCS')} className={`p-3 rounded-xl transition ${activeTool === 'DOCS' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
            <FileText size={24} />
         </button>
         <button onClick={() => setActiveTool('SHEETS')} className={`p-3 rounded-xl transition ${activeTool === 'SHEETS' ? 'bg-green-600 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
            <FileSpreadsheet size={24} />
         </button>
         <button onClick={() => setActiveTool('IDE')} className={`p-3 rounded-xl transition ${activeTool === 'IDE' ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
            <Code size={24} />
         </button>
         <button onClick={() => setActiveTool('SLIDES')} className={`p-3 rounded-xl transition ${activeTool === 'SLIDES' ? 'bg-orange-500 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
            <Layout size={24} />
         </button>
         <button onClick={() => setActiveTool('MAIL')} className={`p-3 rounded-xl transition ${activeTool === 'MAIL' ? 'bg-red-500 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
            <Mail size={24} />
         </button>
         <button onClick={() => setActiveTool('PROJECTS')} className={`p-3 rounded-xl transition ${activeTool === 'PROJECTS' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
            <Kanban size={24} />
         </button>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0">
             <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                    activeTool === 'DOCS' ? 'bg-indigo-600' : 
                    activeTool === 'IDE' ? 'bg-cyan-600' : 
                    activeTool === 'SHEETS' ? 'bg-green-600' : 
                    activeTool === 'MAIL' ? 'bg-red-500' :
                    activeTool === 'PROJECTS' ? 'bg-purple-600' :
                    'bg-orange-500'
                }`}>
                   {activeTool}
                </span>
                <span className="font-semibold text-slate-700">
                    {activeTool === 'MAIL' ? 'Megam Mail - Enterprise' : activeTool === 'PROJECTS' ? 'Project Kanban Board' : 'Badal Apps - Untitled Project'}
                </span>
             </div>
             <div className="flex gap-2">
                 {activeTool === 'SHEETS' && (
                     <button onClick={() => alert("Connecting to SuckSaas ETL Pipeline...")} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition">
                        <Server size={16} /> Data Connect
                     </button>
                 )}
                 {activeTool === 'IDE' && (
                     <div className="relative">
                        <button 
                            onClick={() => setShowTemplates(!showTemplates)} 
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition"
                        >
                            <Box size={16} /> Templates
                        </button>
                        {showTemplates && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                                <button onClick={() => applyTemplate('FastAPI')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600">FastAPI Service</button>
                                <button onClick={() => applyTemplate('PyTorch')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600">PyTorch Model</button>
                                <button onClick={() => applyTemplate('Django')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600">Django App</button>
                                <button onClick={() => applyTemplate('Scrapy')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600">Scrapy Spider</button>
                            </div>
                        )}
                     </div>
                 )}
                 {activeTool === 'IDE' && (
                     <button onClick={executeCode} className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition">
                        <Play size={16} /> Run
                     </button>
                 )}
                 {activeTool !== 'MAIL' && (
                     <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition">
                        <Save size={16} /> Save
                    </button>
                 )}
             </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
             
             {/* Dynamic Main Editor Area */}
             {activeTool === 'MAIL' ? renderMailApp() : activeTool === 'PROJECTS' ? renderKanban() : (
                 <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col">
                    
                    {activeTool === 'DOCS' && (
                        <div className="flex-1 p-8 overflow-y-auto">
                            <div className="max-w-4xl mx-auto bg-white min-h-[800px] shadow-lg border border-slate-200 p-12 rounded-lg">
                                <textarea 
                                className="w-full h-full min-h-[600px] resize-none outline-none text-slate-800 leading-relaxed font-serif bg-transparent"
                                value={docContent}
                                onChange={(e) => setDocContent(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {activeTool === 'IDE' && (
                        <div className="flex-1 flex flex-col">
                            <div className="flex-1 bg-[#1e1e1e] text-blue-200 p-4 font-mono text-sm overflow-y-auto">
                                <textarea 
                                    className="w-full h-full bg-transparent outline-none resize-none text-[#d4d4d4]"
                                    value={codeContent}
                                    onChange={(e) => setCodeContent(e.target.value)}
                                    spellCheck={false}
                                />
                            </div>
                            <div className="h-48 bg-[#0f0f0f] border-t border-[#333] p-4 font-mono text-xs text-slate-300 overflow-y-auto">
                                <div className="flex items-center gap-2 text-slate-500 mb-2 uppercase tracking-wider font-bold">
                                    <TerminalSquare size={14} /> Console Output
                                </div>
                                <pre className="whitespace-pre-wrap">{consoleOutput || 'Ready to execute...'}</pre>
                            </div>
                        </div>
                    )}

                    {activeTool === 'SHEETS' && (
                        <div className="flex-1 overflow-auto bg-white">
                            <div className="inline-block min-w-full">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="w-10 bg-slate-100 border border-slate-300"></th>
                                        {['A','B','C','D','E','F'].map(h => (
                                            <th key={h} className="bg-slate-100 border border-slate-300 px-4 py-1 text-xs font-bold text-slate-500">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sheetData.map((row, rI) => (
                                        <tr key={rI}>
                                            <td className="bg-slate-50 border border-slate-300 text-center text-xs text-slate-400 font-mono">{rI + 1}</td>
                                            {row.map((cell, cI) => (
                                                <td key={cI} className="border border-slate-300 p-0">
                                                    <input 
                                                        className="w-full h-full px-2 py-1 outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 inset-0 border-none"
                                                        value={cell}
                                                        onChange={(e) => {
                                                            const newData = [...sheetData];
                                                            newData[rI][cI] = e.target.value;
                                                            setSheetData(newData);
                                                        }}
                                                    />
                                                </td>
                                            ))}
                                            <td className="border border-slate-300"></td>
                                            <td className="border border-slate-300"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    )}

                    {activeTool === 'SLIDES' && (
                        <div className="flex-1 flex items-center justify-center bg-slate-200">
                            <div className="aspect-video w-3/4 bg-white shadow-2xl rounded flex items-center justify-center flex-col gap-4">
                            <h1 className="text-4xl font-bold text-slate-800">Q3 Cloud Strategy</h1>
                            <p className="text-xl text-slate-500">Presented by Megam AI</p>
                            </div>
                        </div>
                    )}
                 </div>
             )}

             {/* AI Sidebar - Shared */}
             <div className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-xl z-10 shrink-0">
                <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Wand2 size={18} className="text-indigo-600" />
                        AI Copilot
                    </h3>
                </div>
                <div className="p-4 flex flex-col gap-4 flex-1">
                    <div className="flex-1 overflow-y-auto space-y-4">
                        <p className="text-sm text-slate-600">
                            I can help you write code, generate formulas, draft content or emails. Context is based on your active tool: <span className="font-bold">{activeTool}</span>.
                        </p>
                        {activeTool === 'MAIL' && isComposing && (
                            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded text-xs text-indigo-700">
                                Tip: Ask me to "Draft a formal apology for server downtime" or "Write a follow-up for the invoice".
                            </div>
                        )}
                        {activeTool === 'MAIL' && selectedEmail && !isComposing && (
                            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded text-xs text-indigo-700">
                                Tip: I can write a reply to this email for you. Just tell me what you want to say.
                            </div>
                        )}
                        {activeTool === 'PROJECTS' && (
                             <div className="p-3 bg-purple-50 border border-purple-100 rounded text-xs text-purple-700">
                                Tip: Ask me to "Generate a list of tasks for launching the new marketing campaign".
                            </div>
                        )}
                        {activeTool === 'IDE' && (
                             <div className="p-3 bg-cyan-50 border border-cyan-100 rounded text-xs text-cyan-700">
                                Tip: I can generate code for Django, Flask, PyTorch, etc. Try asking for "A Flask API with 2 endpoints".
                            </div>
                        )}
                    </div>
                    <div>
                        <textarea 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder={activeTool === 'MAIL' ? "Draft a polite response..." : "Describe task..."}
                            className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-2"
                        />
                        <button 
                        onClick={handleAiAction}
                        disabled={isProcessing}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm flex justify-center items-center gap-2 transition disabled:opacity-70"
                        >
                            {isProcessing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Wand2 size={16} />}
                            Generate
                        </button>
                    </div>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

const FolderButton = ({ icon: Icon, label, count, isActive, onClick }: { icon: any, label: string, count?: number, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between gap-3 transition ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
        <div className="flex items-center gap-3">
            <Icon size={18} /> {label}
        </div>
        {count ? <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">{count}</span> : null}
    </button>
)

const DnsRecord = ({ type, host, value, priority, status }: { type: string, host: string, value: string, priority?: number, status: string }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded border border-slate-200">
        <div className="flex-1">
             <div className="flex items-center gap-2 mb-1">
                 <span className="font-bold text-slate-800 text-xs w-12">{type}</span>
                 <span className="text-slate-500 text-xs font-mono">{host}</span>
             </div>
             <div className="text-xs text-slate-600 font-mono truncate max-w-[200px]">{value}</div>
        </div>
        <div className="flex items-center gap-2">
            {status === 'Active' ? <CheckCircle2 size={14} className="text-green-500" /> : <Settings size={14} className="text-orange-400 animate-spin" />}
            <span className={`text-xs font-medium ${status === 'Active' ? 'text-green-600' : 'text-orange-500'}`}>{status}</span>
        </div>
    </div>
)

export default Workspace;