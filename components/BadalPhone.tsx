
import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Battery, Wifi, Signal, Phone, MessageSquare, Camera, Chrome, Settings, MoreVertical, ChevronLeft, Mic, Video, User, PhoneCall, X, Aperture, Image as ImageIcon, Zap, Cloud, Cpu, HardDrive, Share2, Globe, Search, ArrowLeft, ArrowRight, RotateCw, Lock, Bell, Menu, Grid, Layers, Play, Pause, Music, MapPin, Mail, Calendar, Clock, Plus } from 'lucide-react';
import { simulateCloudCall, enhancePhotoNPU, getPhoneSystemStats, performSearch } from '../services/geminiService';

const WALLPAPER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop";

const BadalPhone: React.FC = () => {
  const [systemState, setSystemState] = useState<'BOOT' | 'LOCKED' | 'HOME' | 'APP'>('LOCKED');
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState<{id: string, title: string, msg: string, app: string}[]>([
      { id: 'n1', title: 'System Update', msg: 'Megam OS 2.1 is ready to install.', app: 'Settings' },
      { id: 'n2', title: 'Missed Call', msg: 'From: HQ Server (2)', app: 'Phone' }
  ]);

  // Phone State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callStatus, setCallStatus] = useState<'IDLE' | 'CALLING' | 'CONNECTED'>('IDLE');
  
  // Camera State
  const [cameraMode, setCameraMode] = useState<'PHOTO' | 'VIDEO' | 'PRO'>('PHOTO');
  
  // Browser State
  const [browserUrl, setBrowserUrl] = useState('megam://search');
  
  // Chat State
  const [messages, setMessages] = useState([
      { id: 1, sender: 'System', text: 'Welcome to BadalPhone X1. Your NPU is online.', time: '10:00 AM' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (appName: string) => {
      setActiveApp(appName);
      setSystemState('APP');
  };

  const goHome = () => {
      setSystemState('HOME');
      setActiveApp(null);
  };

  const goBack = () => {
      // Simple back logic for now
      goHome();
  };

  // --- SUB-APPS ---

  const MobileBrowser = () => {
      const [searchQ, setSearchQ] = useState('');
      const [loading, setLoading] = useState(false);
      const [pageContent, setPageContent] = useState<any>(null);

      const handleSearch = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);
          const res = await performSearch(searchQ);
          setPageContent(res);
          setLoading(false);
      };

      return (
          <div className="h-full bg-white flex flex-col pt-12 pb-8">
              {/* Address Bar */}
              <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                  <div className="flex-1 bg-white border border-slate-200 rounded-full h-10 flex items-center px-4 shadow-sm">
                      <Lock size={12} className="text-green-500 mr-2"/>
                      <form onSubmit={handleSearch} className="flex-1">
                          <input 
                            className="w-full text-xs outline-none text-slate-700" 
                            placeholder="Search or enter website"
                            value={searchQ}
                            onChange={e => setSearchQ(e.target.value)}
                          />
                      </form>
                  </div>
                  <button className="p-2 rounded-full hover:bg-slate-200"><RotateCw size={16} className="text-slate-500"/></button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                  {loading ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                          <span className="text-xs">Loading via Neural Bridge...</span>
                      </div>
                  ) : pageContent ? (
                      <div className="space-y-4">
                          {pageContent.aiOverview && (
                              <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                                  <h3 className="font-bold text-indigo-900 text-sm mb-2 flex items-center gap-2"><Zap size={14}/> AI Summary</h3>
                                  <p className="text-xs text-slate-600 leading-relaxed">{pageContent.aiOverview}</p>
                              </div>
                          )}
                          {pageContent.organicResults?.map((res: any, i: number) => (
                              <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                  <div className="text-[10px] text-slate-400 mb-1 truncate">{res.url}</div>
                                  <div className="text-blue-600 font-medium text-sm mb-1">{res.title}</div>
                                  <div className="text-xs text-slate-500 line-clamp-2">{res.desc}</div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full opacity-30">
                          <Globe size={48} className="mb-4"/>
                          <p className="text-xs">Megam Browser Mobile</p>
                      </div>
                  )}
              </div>
              
              {/* Bottom Nav */}
              <div className="h-12 border-t border-slate-200 flex justify-around items-center text-slate-500">
                  <ChevronLeft size={24}/>
                  <ChevronLeft size={24} className="rotate-180"/>
                  <Plus size={24}/>
                  <Layers size={20}/>
              </div>
          </div>
      );
  };

  const MessagesApp = () => {
      const [inputText, setInputText] = useState('');
      
      const sendMsg = () => {
          if (!inputText.trim()) return;
          setMessages(prev => [...prev, { id: Date.now(), sender: 'Me', text: inputText, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
          setInputText('');
          
          // Simulate Auto-Reply
          setTimeout(() => {
              setMessages(prev => [...prev, { id: Date.now(), sender: 'System', text: `I received: "${inputText}". I am a simulated agent running on the cloud.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
          }, 1000);
      };

      return (
          <div className="h-full bg-white flex flex-col pt-12 pb-8">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <button onClick={goBack}><ChevronLeft size={24} className="text-blue-500"/></button>
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">S</div>
                  <div>
                      <div className="text-sm font-bold text-slate-900">System Agent</div>
                      <div className="text-[10px] text-green-500">Online</div>
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'Me' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                              {msg.text}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                      </div>
                  ))}
              </div>

              <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                  <input 
                    className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none"
                    placeholder="iMessage..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMsg()}
                  />
                  <button onClick={sendMsg} className="p-2 bg-blue-500 rounded-full text-white"><ArrowRight size={16}/></button>
              </div>
          </div>
      );
  };

  const SettingsApp = () => {
      return (
          <div className="h-full bg-[#f2f2f7] flex flex-col pt-12 pb-8 text-slate-900 overflow-y-auto">
              <div className="px-4 mb-6">
                  <h1 className="text-3xl font-bold">Settings</h1>
              </div>

              <div className="px-4 mb-6">
                  <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">JD</div>
                      <div>
                          <div className="font-bold text-lg">John Doe</div>
                          <div className="text-sm text-slate-500">Badal Cloud ID • Pro</div>
                      </div>
                  </div>
              </div>

              <div className="px-4 space-y-6">
                  <div className="bg-white rounded-xl overflow-hidden">
                      <div className="p-3 flex items-center gap-3 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                          <div className="w-7 h-7 rounded bg-orange-500 flex items-center justify-center text-white"><Signal size={16}/></div>
                          <span className="flex-1 text-sm font-medium">Cellular</span>
                          <span className="text-xs text-slate-400">5G On</span>
                          <ChevronLeft size={16} className="text-slate-300 rotate-180"/>
                      </div>
                      <div className="p-3 flex items-center gap-3 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                          <div className="w-7 h-7 rounded bg-blue-500 flex items-center justify-center text-white"><Wifi size={16}/></div>
                          <span className="flex-1 text-sm font-medium">Wi-Fi</span>
                          <span className="text-xs text-slate-400">Megam-Mesh</span>
                          <ChevronLeft size={16} className="text-slate-300 rotate-180"/>
                      </div>
                  </div>

                  <div className="bg-white rounded-xl overflow-hidden">
                      <div className="p-3 flex items-center gap-3 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                          <div className="w-7 h-7 rounded bg-slate-500 flex items-center justify-center text-white"><Settings size={16}/></div>
                          <span className="flex-1 text-sm font-medium">General</span>
                          <ChevronLeft size={16} className="text-slate-300 rotate-180"/>
                      </div>
                      <div className="p-3 flex items-center gap-3 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                          <div className="w-7 h-7 rounded bg-indigo-500 flex items-center justify-center text-white"><Cpu size={16}/></div>
                          <span className="flex-1 text-sm font-medium">Neural Bridge NPU</span>
                          <span className="text-xs text-slate-400">Active</span>
                          <ChevronLeft size={16} className="text-slate-300 rotate-180"/>
                      </div>
                  </div>

                  <div className="px-2">
                      <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">About Phone</h3>
                      <div className="bg-white rounded-xl p-4 text-xs text-slate-600 space-y-2 font-mono">
                          <div className="flex justify-between"><span>Model</span><span>BadalPhone X1</span></div>
                          <div className="flex justify-between"><span>OS</span><span>Megam Mobile 2.1</span></div>
                          <div className="flex justify-between"><span>Kernel</span><span>Linux 6.8.0-megam</span></div>
                          <div className="flex justify-between"><span>Framework</span><span>React Native / AOSP</span></div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const GalleryApp = () => (
      <div className="h-full bg-white flex flex-col pt-12 pb-8">
          <div className="px-4 py-2 flex justify-between items-center">
              <h2 className="text-xl font-bold">Photos</h2>
              <button className="text-blue-500 text-sm font-bold">Select</button>
          </div>
          <div className="flex-1 overflow-y-auto p-1">
              <div className="grid grid-cols-3 gap-1">
                  {[...Array(12)].map((_, i) => (
                      <div key={i} className="aspect-square bg-slate-200 relative overflow-hidden group">
                          <img src={`https://source.unsplash.com/random/200x200?sig=${i}`} className="w-full h-full object-cover" alt="gallery"/>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <Zap size={16} className="text-yellow-400"/>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          <div className="h-12 border-t border-slate-100 flex justify-around items-center">
              <span className="text-blue-500 font-bold text-xs">Library</span>
              <span className="text-slate-400 text-xs">For You</span>
              <span className="text-slate-400 text-xs">Albums</span>
              <span className="text-slate-400 text-xs">Search</span>
          </div>
      </div>
  );

  return (
    <div className="h-full flex items-center justify-center bg-slate-900 overflow-hidden p-8">
        <div className="relative w-[380px] h-[780px] bg-black rounded-[50px] shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)] border-[8px] border-[#2a2a2a] ring-2 ring-slate-700 overflow-hidden">
            
            {/* Status Bar */}
            <div className="absolute top-0 left-0 w-full h-12 z-50 px-6 flex justify-between items-center text-white pointer-events-none">
                <span className="text-xs font-bold w-12">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <div className="w-28 h-7 bg-black rounded-b-2xl absolute left-1/2 -translate-x-1/2 top-0 flex items-center justify-center gap-2">
                    {/* Dynamic Island Area */}
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                    <div className="w-8 h-1.5 rounded-full bg-slate-800/50"></div>
                </div>
                <div className="flex gap-1.5 w-12 justify-end">
                    <Signal size={12} fill="currentColor"/>
                    <Wifi size={12}/>
                    <Battery size={14} fill="currentColor"/>
                </div>
            </div>

            {/* Screen Content Switcher */}
            <div className="w-full h-full bg-black relative">
                
                {systemState === 'LOCKED' && (
                    <div 
                        className="w-full h-full bg-cover bg-center flex flex-col items-center pt-20 text-white cursor-pointer"
                        style={{ backgroundImage: `url(${WALLPAPER})` }}
                        onClick={() => setSystemState('HOME')}
                    >
                        <Lock size={20} className="mb-4 opacity-80"/>
                        <div className="text-7xl font-thin tracking-tighter mb-2">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </div>
                        <div className="text-lg font-medium opacity-80">
                            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                        
                        <div className="mt-auto mb-8 flex flex-col items-center animate-pulse opacity-60">
                            <div className="w-12 h-1 bg-white rounded-full mb-2"></div>
                            <span className="text-xs font-bold uppercase tracking-widest">Swipe up to unlock</span>
                        </div>
                    </div>
                )}

                {systemState === 'HOME' && (
                    <div 
                        className="w-full h-full bg-cover bg-center pt-14 pb-8 px-4 flex flex-col justify-between"
                        style={{ backgroundImage: `url(${WALLPAPER})` }}
                    >
                        {/* Widgets */}
                        <div className="grid grid-cols-2 gap-4 h-36">
                            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between border border-white/10 text-white">
                                <div className="text-xs font-bold text-blue-200 uppercase">Weather</div>
                                <div>
                                    <div className="text-2xl font-bold">24°</div>
                                    <div className="text-xs">Sunny • H:26 L:18</div>
                                </div>
                            </div>
                            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between border border-white/10 text-white">
                                <div className="text-xs font-bold text-green-300 uppercase flex items-center gap-1"><Zap size={10}/> Battery</div>
                                <div>
                                    <div className="text-2xl font-bold">89%</div>
                                    <div className="text-xs text-green-400">Charging</div>
                                </div>
                            </div>
                        </div>

                        {/* App Grid */}
                        <div className="grid grid-cols-4 gap-y-6 gap-x-2 mt-auto mb-4">
                            <AppIcon icon={Mail} label="Mail" color="bg-blue-500" onClick={() => openApp('MAIL')}/>
                            <AppIcon icon={Calendar} label="Calendar" color="bg-white text-red-500" onClick={() => openApp('CALENDAR')}/>
                            <AppIcon icon={ImageIcon} label="Photos" color="bg-white text-slate-900" onClick={() => openApp('GALLERY')}/>
                            <AppIcon icon={Camera} label="Camera" color="bg-slate-300 text-slate-800" onClick={() => openApp('CAMERA')}/>
                            
                            <AppIcon icon={MapPin} label="Maps" color="bg-green-500" onClick={() => openApp('MAPS')}/>
                            <AppIcon icon={Clock} label="Clock" color="bg-black border border-white/20" onClick={() => openApp('CLOCK')}/>
                            <AppIcon icon={Settings} label="Settings" color="bg-slate-500" onClick={() => openApp('SETTINGS')}/>
                            <AppIcon icon={HardDrive} label="Files" color="bg-blue-400" onClick={() => openApp('FILES')}/>
                        </div>

                        {/* Dock */}
                        <div className="bg-white/20 backdrop-blur-xl rounded-[35px] p-4 flex justify-between items-center px-6 border border-white/10">
                            <button onClick={() => openApp('DIALER')} className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition"><Phone size={28} fill="currentColor"/></button>
                            <button onClick={() => openApp('BROWSER')} className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-lg active:scale-95 transition"><Chrome size={28}/></button>
                            <button onClick={() => openApp('MESSAGES')} className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition"><MessageSquare size={28} fill="currentColor"/></button>
                            <button onClick={() => openApp('MUSIC')} className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition"><Music size={28}/></button>
                        </div>
                    </div>
                )}

                {systemState === 'APP' && (
                    <div className="w-full h-full bg-white animate-in slide-in-from-bottom duration-300">
                        {activeApp === 'BROWSER' && <MobileBrowser />}
                        {activeApp === 'MESSAGES' && <MessagesApp />}
                        {activeApp === 'GALLERY' && <GalleryApp />}
                        {activeApp === 'SETTINGS' && <SettingsApp />}
                        
                        {/* Placeholder for others */}
                        {['DIALER', 'MAIL', 'CALENDAR', 'CAMERA', 'MAPS', 'CLOCK', 'FILES', 'MUSIC'].includes(activeApp || '') && activeApp !== 'BROWSER' && activeApp !== 'MESSAGES' && activeApp !== 'GALLERY' && activeApp !== 'SETTINGS' && (
                            <div className="h-full flex flex-col items-center justify-center bg-slate-50">
                                <div className="w-20 h-20 rounded-3xl bg-slate-200 flex items-center justify-center mb-4 text-slate-400">
                                    <Grid size={40}/>
                                </div>
                                <h3 className="text-lg font-bold text-slate-700">{activeApp}</h3>
                                <p className="text-sm text-slate-400">App simulation loading...</p>
                                <button onClick={goHome} className="mt-8 px-6 py-2 bg-slate-200 rounded-full text-sm font-bold text-slate-600">Go Home</button>
                            </div>
                        )}
                    </div>
                )}

                {/* Home Indicator */}
                <div 
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/20 rounded-full z-50 cursor-pointer hover:bg-black/40 transition backdrop-blur-sm" 
                    onClick={goHome}
                ></div>
            </div>
        </div>
    </div>
  );
};

const AppIcon = ({ icon: Icon, label, color, onClick }: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group w-full">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105 group-active:scale-95 ${color}`}>
            <Icon size={28} className="opacity-90"/>
        </div>
        <span className="text-[10px] font-medium text-white drop-shadow-md truncate w-full text-center px-1">{label}</span>
    </button>
);

export default BadalPhone;
