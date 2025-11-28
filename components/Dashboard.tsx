import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Server, ShieldCheck, Database, Cpu, Globe, Wifi } from 'lucide-react';
import { SystemStats } from '../types';

interface DashboardProps {
  stats: SystemStats;
}

const trafficData = [
  { name: '00:00', in: 4000, out: 2400 },
  { name: '04:00', in: 3000, out: 1398 },
  { name: '08:00', in: 2000, out: 9800 },
  { name: '12:00', in: 2780, out: 3908 },
  { name: '16:00', in: 1890, out: 4800 },
  { name: '20:00', in: 2390, out: 3800 },
  { name: '24:00', in: 3490, out: 4300 },
];

const resourceData = [
  { name: 'Node 1', cpu: 45, ram: 30 },
  { name: 'Node 2', cpu: 65, ram: 45 },
  { name: 'Node 3', cpu: 25, ram: 20 },
  { name: 'Node 4', cpu: 85, ram: 70 },
  { name: 'Node 5', cpu: 15, ram: 10 },
];

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm">Virtual CPU</p>
              <h3 className="text-2xl font-bold text-white">∞ Cores</h3>
              <span className="text-xs text-green-400">Load Balanced</span>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <Cpu size={24} />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm">Cloud Storage</p>
              <h3 className="text-2xl font-bold text-white">99.9 PB</h3>
              <span className="text-xs text-cyan-400">Badal Vault (Encrypted)</span>
            </div>
            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
              <Database size={24} />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm">Active VPS</p>
              <h3 className="text-2xl font-bold text-white">12,402</h3>
              <span className="text-xs text-emerald-400">99.999% Uptime</span>
            </div>
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <Server size={24} />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm">Security</p>
              <h3 className="text-2xl font-bold text-white">Protected</h3>
              <span className="text-xs text-purple-400">Megam Sentinel Active</span>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700">
          <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Globe size={18} /> Global Traffic Load Balancer
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} 
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="in" stroke="#06b6d4" fillOpacity={1} fill="url(#colorIn)" />
                <Area type="monotone" dataKey="out" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700">
          <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Server size={18} /> Cluster Resource Allocation
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.2}}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} 
                />
                <Legend />
                <Bar dataKey="cpu" name="CPU Load %" fill="#ec4899" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ram" name="RAM Usage %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Network Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Wifi size={20} />
                </div>
                <div>
                    <h5 className="font-semibold text-slate-200">WIFI Connector</h5>
                    <p className="text-xs text-slate-500">Virtual Bridge Active</p>
                </div>
            </div>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 text-orange-400 rounded-lg">
                    <Globe size={20} />
                </div>
                <div>
                    <h5 className="font-semibold text-slate-200">Mesh VPN</h5>
                    <p className="text-xs text-slate-500">10.0.0.1/24 (Secure)</p>
                </div>
            </div>
            <button className="px-3 py-1 text-xs bg-orange-500/20 text-orange-300 rounded hover:bg-orange-500/30 transition">
                Configure
            </button>
        </div>

        <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Server size={20} />
                </div>
                <div>
                    <h5 className="font-semibold text-slate-200">Badal SWGI</h5>
                    <p className="text-xs text-slate-500">High Tokenized (Open)</p>
                </div>
            </div>
             <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700 text-green-400">
                RUNNING
            </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;