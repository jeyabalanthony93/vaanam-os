





import React from 'react';
import { AppView } from '../../types';
import { 
  LayoutDashboard, 
  Terminal as TerminalIcon, 
  HardDrive, 
  Briefcase, 
  Network, 
  Shield, 
  Server, 
  Cpu, 
  Globe,
  Workflow,
  GitMerge,
  Package,
  CloudOff,
  UserCheck,
  Book,
  Database
} from 'lucide-react';

interface DesktopProps {
  onLaunchApp: (appId: AppView) => void;
}

const DesktopIcon: React.FC<{ 
  label: string; 
  icon: any; 
  onClick: () => void; 
  color?: string;
}> = ({ label, icon: Icon, onClick, color = "text-cyan-400" }) => (
  <button 
    onDoubleClick={onClick}
    className="flex flex-col items-center gap-1 w-24 p-2 rounded-lg hover:bg-white/10 group focus:bg-white/20 transition-colors focus:outline-none focus:ring-1 focus:ring-white/30"
  >
    <div className={`p-3 rounded-xl shadow-lg bg-slate-900/80 group-hover:scale-105 transition-transform duration-200 border border-slate-700 ${color}`}>
       <Icon size={32} />
    </div>
    <span className="text-xs font-medium text-white drop-shadow-md text-center line-clamp-2 px-1 bg-black/40 rounded mt-1">
      {label}
    </span>
  </button>
);

const Desktop: React.FC<DesktopProps> = ({ onLaunchApp }) => {
  return (
    <div className="absolute inset-0 p-4 grid grid-flow-col grid-rows-6 gap-4 content-start items-start justify-start w-fit">
       <DesktopIcon 
          label="Server Admin" 
          icon={Server} 
          onClick={() => onLaunchApp(AppView.SERVER)} 
          color="text-indigo-400"
       />
       <DesktopIcon 
          label="Terminal" 
          icon={TerminalIcon} 
          onClick={() => onLaunchApp(AppView.TERMINAL)} 
          color="text-slate-200"
       />
       <DesktopIcon 
          label="Cloud Apps" 
          icon={Briefcase} 
          onClick={() => onLaunchApp(AppView.WORKSPACE)} 
          color="text-emerald-400"
       />
       <DesktopIcon 
          label="Megam Browser" 
          icon={Globe} 
          onClick={() => onLaunchApp(AppView.BROWSER)} 
          color="text-indigo-300"
       />
       <DesktopIcon 
          label="Badal Storage" 
          icon={HardDrive} 
          onClick={() => onLaunchApp(AppView.FILES)} 
          color="text-blue-400"
       />
       <DesktopIcon 
          label="Infrastructure" 
          icon={Cpu} 
          onClick={() => onLaunchApp(AppView.INFRASTRUCTURE)} 
          color="text-purple-400"
       />
       <DesktopIcon 
          label="VPN & Network" 
          icon={Shield} 
          onClick={() => onLaunchApp(AppView.VPN)} 
          color="text-orange-400"
       />
       <DesktopIcon 
          label="Dashboard" 
          icon={LayoutDashboard} 
          onClick={() => onLaunchApp(AppView.DASHBOARD)} 
          color="text-pink-400"
       />
        <DesktopIcon 
          label="AI Agents" 
          icon={Network} 
          onClick={() => onLaunchApp(AppView.AGENTS)} 
          color="text-teal-400"
       />
        <DesktopIcon 
          label="SWGI MCP" 
          icon={Globe} 
          onClick={() => onLaunchApp(AppView.MCP_SERVER)} 
          color="text-yellow-400"
       />
       <DesktopIcon 
          label="SuckChain Studio" 
          icon={Workflow} 
          onClick={() => onLaunchApp(AppView.AI_STUDIO)} 
          color="text-red-400"
       />
       <DesktopIcon 
          label="ETL Studio" 
          icon={GitMerge} 
          onClick={() => onLaunchApp(AppView.ETL)} 
          color="text-purple-400"
       />
       <DesktopIcon 
          label="Package Center" 
          icon={Package} 
          onClick={() => onLaunchApp(AppView.PACKAGE_CENTER)} 
          color="text-rose-400"
       />
       <DesktopIcon 
          label="SS360 Offline" 
          icon={CloudOff} 
          onClick={() => onLaunchApp(AppView.SS360)} 
          color="text-orange-500"
       />
        <DesktopIcon 
          label="Badal Auth" 
          icon={UserCheck} 
          onClick={() => onLaunchApp(AppView.BADAL_AUTH)} 
          color="text-cyan-300"
       />
       <DesktopIcon 
          label="Megam Docs" 
          icon={Book} 
          onClick={() => onLaunchApp(AppView.DOCS)} 
          color="text-blue-500"
       />
       <DesktopIcon 
          label="Badal RAG Server" 
          icon={Database} 
          onClick={() => onLaunchApp(AppView.BADAL_RAG)} 
          color="text-emerald-500"
       />
    </div>
  );
};

export default Desktop;