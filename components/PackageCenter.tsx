
import React, { useState } from 'react';
import { Package, Download, Search, Server, Database, Code, Shield, Box, CheckCircle2, Zap, Layers, BarChart3, Cpu, CreditCard, BookOpen, Terminal, Play, Wand2, Copy, Loader2, Settings, Layout, Globe, Lock, Video, Image as ImageIcon, Smartphone, Cloud, GitBranch, Key, Activity, Lightbulb, FileCode, ArrowRight, X } from 'lucide-react';
import { generatePackageScript } from '../services/geminiService';

interface PackageItem {
  id: string;
  name: string;
  category: 'WEB' | 'DATA' | 'DEVOPS' | 'OS' | 'SERVER' | 'APP' | 'DEV' | 'SECURITY' | 'API';
  description: string;
  version: string;
  installed: boolean;
  icon: any;
  tags: string[];
  installCmd?: string;
  configSnippet?: string;
}

interface SolutionRecipe {
    id: string;
    title: string;
    description: string;
    useCase: string;
    frameworks: string[];
    complexity: 'Low' | 'Medium' | 'High';
    codeSnippet: string;
}

const PACKAGES: PackageItem[] = [
  // --- EXISTING WEB ---
  { id: 'django', name: 'Django', category: 'WEB', description: 'The web framework for perfectionists with deadlines.', version: '5.0.3', installed: true, icon: Server, tags: ['Framework', 'ORM'], installCmd: 'pip install django', configSnippet: 'django-admin startproject mysite' },
  { id: 'flask', name: 'Flask', category: 'WEB', description: 'A lightweight WSGI web application framework.', version: '3.0.0', installed: true, icon: Code, tags: ['Microframework'], installCmd: 'pip install flask', configSnippet: 'app = Flask(__name__)' },
  { id: 'fastapi', name: 'FastAPI', category: 'WEB', description: 'High performance, easy to learn, fast to code.', version: '0.109.0', installed: false, icon: Zap, tags: ['Async', 'API'], installCmd: 'pip install fastapi uvicorn', configSnippet: 'app = FastAPI()' },
  { id: 'scrapy', name: 'Scrapy', category: 'WEB', description: 'Framework for extracting data from websites.', version: '2.11.0', installed: false, icon: Box, tags: ['Crawling'], installCmd: 'pip install scrapy', configSnippet: 'scrapy startproject myproject' },
  
  // --- EXISTING DATA ---
  { id: 'pandas', name: 'Pandas', category: 'DATA', description: 'Data structures for data analysis.', version: '2.2.0', installed: true, icon: Database, tags: ['Data Analysis'], installCmd: 'pip install pandas', configSnippet: 'import pandas as pd' },
  { id: 'pytorch', name: 'PyTorch', category: 'DATA', description: 'Deep learning with strong GPU acceleration.', version: '2.2.0', installed: true, icon: Database, tags: ['DL', 'GPU'], installCmd: 'pip install torch', configSnippet: 'import torch' },
  { id: 'tensorflow', name: 'TensorFlow', category: 'DATA', description: 'End-to-end platform for machine learning.', version: '2.15.0', installed: false, icon: Box, tags: ['DL', 'Production'], installCmd: 'pip install tensorflow', configSnippet: 'import tensorflow as tf' },
  { id: 'scikit-learn', name: 'Scikit-learn', category: 'DATA', description: 'Traditional ML: Classification, Regression.', version: '1.4.1', installed: false, icon: BarChart3, tags: ['ML', 'CPU'], installCmd: 'pip install scikit-learn', configSnippet: 'from sklearn import datasets' },

  // --- EXISTING DEVOPS ---
  { id: 'ansible', name: 'Ansible', category: 'DEVOPS', description: 'IT automation platform.', version: '9.2.0', installed: true, icon: Shield, tags: ['Automation'], installCmd: 'pip install ansible', configSnippet: 'ansible-playbook site.yml' },
  { id: 'docker-compose', name: 'Docker Compose', category: 'DEVOPS', description: 'Define and run multi-container applications.', version: '2.24.5', installed: true, icon: Box, tags: ['Container'], installCmd: 'apt-get install docker-compose', configSnippet: 'docker-compose up -d' },

  // --- EXISTING APIs ---
  { id: 'badal-auth', name: 'Badal Auth API', category: 'API', description: 'Unified Identity Management and SSO provider.', version: 'v2.1', installed: true, icon: Shield, tags: ['Megam OS', 'Auth'], installCmd: 'npm install @badal/auth', configSnippet: 'const auth = new BadalAuth({ key: process.env.BADAL_KEY });' },
  { id: 'badal-billing', name: 'Badal FinOps', category: 'API', description: 'Cost calculation engine.', version: 'v1.4', installed: false, icon: CreditCard, tags: ['Megam OS', 'Finance'], installCmd: 'npm install @badal/billing', configSnippet: 'const billing = new BadalBilling();' },

  // --- NEW: OS ---
  { id: 'linux-kernel', name: 'Linux Kernel', category: 'OS', description: 'The core component for many operating systems.', version: '6.8.0', installed: true, icon: Cpu, tags: ['Kernel', 'Core'], installCmd: 'apt-get install linux-image-generic', configSnippet: 'uname -r' },
  { id: 'ubuntu', name: 'Ubuntu', category: 'OS', description: 'Popular Linux distribution for both desktop and server.', version: '24.04 LTS', installed: true, icon: Layout, tags: ['Distro', 'Debian'], installCmd: 'do-release-upgrade', configSnippet: 'lsb_release -a' },
  { id: 'android-aosp', name: 'Android (AOSP)', category: 'OS', description: 'Open-source base for mobile operating systems.', version: '14.0', installed: false, icon: Smartphone, tags: ['Mobile', 'ARM'], installCmd: 'repo init -u https://android.googlesource.com/platform/manifest', configSnippet: 'source build/envsetup.sh' },
  { id: 'freebsd', name: 'FreeBSD', category: 'OS', description: 'Unix-like operating system known for stability.', version: '14.0', installed: false, icon: Server, tags: ['BSD', 'Unix'], installCmd: 'pkg install freebsd', configSnippet: 'freebsd-version' },

  // --- NEW: Server ---
  { id: 'apache', name: 'Apache HTTP Server', category: 'SERVER', description: 'Widely used, high-performance web server.', version: '2.4.58', installed: false, icon: Globe, tags: ['Web Server'], installCmd: 'apt-get install apache2', configSnippet: 'systemctl start apache2' },
  { id: 'nginx', name: 'Nginx', category: 'SERVER', description: 'High-performance HTTP server, reverse proxy, and LB.', version: '1.25.3', installed: true, icon: Globe, tags: ['Web Server', 'Proxy'], installCmd: 'apt-get install nginx', configSnippet: 'nginx -t' },
  { id: 'mysql', name: 'MySQL', category: 'SERVER', description: 'Robust open-source relational database.', version: '8.0.36', installed: false, icon: Database, tags: ['SQL', 'DB'], installCmd: 'apt-get install mysql-server', configSnippet: 'mysql -u root -p' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'SERVER', description: 'Advanced enterprise-class object-relational database.', version: '16.2', installed: true, icon: Database, tags: ['SQL', 'DB'], installCmd: 'apt-get install postgresql', configSnippet: 'psql -U postgres' },
  { id: 'mongodb', name: 'MongoDB', category: 'SERVER', description: 'Cross-platform document-oriented database.', version: '7.0.5', installed: false, icon: Database, tags: ['NoSQL', 'DB'], installCmd: 'apt-get install mongodb-org', configSnippet: 'mongosh' },
  { id: 'docker', name: 'Docker Engine', category: 'SERVER', description: 'OS-level virtualization to deliver software in containers.', version: '25.0.3', installed: true, icon: Box, tags: ['Container'], installCmd: 'apt-get install docker-ce', configSnippet: 'docker run hello-world' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'SERVER', description: 'Automating deployment, scaling, and management.', version: '1.29.2', installed: true, icon: Layers, tags: ['Orchestration'], installCmd: 'snap install microk8s', configSnippet: 'kubectl get nodes' },
  { id: 'nextcloud', name: 'Nextcloud', category: 'SERVER', description: 'Self-hosted productivity platform for file share.', version: '28.0.2', installed: false, icon: Cloud, tags: ['Storage', 'Sync'], installCmd: 'snap install nextcloud', configSnippet: 'nextcloud.enable-https' },
  { id: 'openstack', name: 'OpenStack', category: 'SERVER', description: 'Software for creating private and public clouds.', version: '2023.2', installed: false, icon: Cloud, tags: ['IaaS', 'Cloud'], installCmd: 'apt-get install openstack-dashboard', configSnippet: 'openstack server list' },

  // --- NEW: Apps ---
  { id: 'libreoffice', name: 'LibreOffice', category: 'APP', description: 'Full office suite: word processing, spreadsheets.', version: '7.6.4', installed: false, icon: Layout, tags: ['Office', 'Productivity'], installCmd: 'apt-get install libreoffice', configSnippet: 'libreoffice --writer' },
  { id: 'gimp', name: 'GIMP', category: 'APP', description: 'Cross-platform raster graphics editor.', version: '2.10.36', installed: false, icon: ImageIcon, tags: ['Graphics', 'Editor'], installCmd: 'apt-get install gimp', configSnippet: 'gimp image.png' },
  { id: 'vlc', name: 'VLC Media Player', category: 'APP', description: 'Portable multimedia player for audio and video.', version: '3.0.20', installed: false, icon: Video, tags: ['Media', 'Player'], installCmd: 'apt-get install vlc', configSnippet: 'vlc video.mp4' },

  // --- NEW: Dev Tools ---
  { id: 'vscode', name: 'VS Code (OSS)', category: 'DEV', description: 'Popular, open-source code editor.', version: '1.87.0', installed: true, icon: Code, tags: ['Editor', 'IDE'], installCmd: 'snap install code', configSnippet: 'code .' },
  { id: 'git', name: 'Git', category: 'DEV', description: 'Distributed version control system.', version: '2.43.0', installed: true, icon: GitBranch, tags: ['VCS', 'Source'], installCmd: 'apt-get install git', configSnippet: 'git init' },

  // --- NEW: AI/Data (More) ---
  { id: 'mlflow', name: 'MLflow', category: 'DATA', description: 'Manage the ML lifecycle (experiments, deployment).', version: '2.10.2', installed: false, icon: Activity, tags: ['MLOps'], installCmd: 'pip install mlflow', configSnippet: 'mlflow ui' },
  { id: 'superset', name: 'Apache Superset', category: 'DATA', description: 'Modern data exploration and visualization platform.', version: '3.1.0', installed: false, icon: BarChart3, tags: ['Analytics', 'BI'], installCmd: 'pip install apache-superset', configSnippet: 'superset run' },

  // --- NEW: Security ---
  { id: 'wireshark', name: 'Wireshark', category: 'SECURITY', description: 'Network protocol analyzer.', version: '4.2.3', installed: false, icon: Search, tags: ['Network', 'Audit'], installCmd: 'apt-get install wireshark', configSnippet: 'wireshark' },
  { id: 'openvpn', name: 'OpenVPN', category: 'SECURITY', description: 'Robust and highly flexible VPN daemon.', version: '2.6.9', installed: true, icon: Lock, tags: ['VPN', 'Tunnel'], installCmd: 'apt-get install openvpn', configSnippet: 'openvpn --config client.ovpn' },
  { id: 'pfsense', name: 'pfSense', category: 'SECURITY', description: 'Firewall and router software.', version: '2.7.2', installed: false, icon: Shield, tags: ['Firewall'], installCmd: 'Install via ISO', configSnippet: 'pfctl -s rules' },
];

const SOLUTIONS: SolutionRecipe[] = [
    {
        id: 'sol-1',
        title: 'Async Invoice Processing Pipeline',
        description: 'Offload heavy image processing tasks to background workers to keep your web app responsive.',
        useCase: 'A SaaS platform where users upload thousands of scanned invoices daily. The system needs to resize images, extract metadata, and store results without blocking the upload interface.',
        frameworks: ['Celery', 'Pillow', 'Redis', 'SQLAlchemy'],
        complexity: 'Medium',
        codeSnippet: `
# 1. task_queue.py
from celery import Celery
from PIL import Image
from sqlalchemy.orm import Session
from database import Invoice, engine

# Initialize Celery with Redis broker
app = Celery('invoices', broker='redis://localhost:6379/0')

@app.task
def process_invoice_image(invoice_id, image_path):
    """Background task to resize image and update DB"""
    
    # 1. Image Processing with Pillow
    with Image.open(image_path) as img:
        # Convert to grayscale and resize for archival
        img = img.convert('L') 
        img.thumbnail((1024, 1024))
        optimized_path = image_path.replace('.jpg', '_opt.jpg')
        img.save(optimized_path, "JPEG", quality=85)

    # 2. Database Update with SQLAlchemy
    with Session(engine) as session:
        invoice = session.query(Invoice).get(invoice_id)
        if invoice:
            invoice.status = 'PROCESSED'
            invoice.file_path = optimized_path
            session.commit()
            
    return f"Invoice {invoice_id} processed successfully."
`
    },
    {
        id: 'sol-2',
        title: 'Real-time Competitor Price Monitor',
        description: 'Build a robust spider to track competitor pricing changes instantly.',
        useCase: 'Retailers need to adjust their pricing strategies dynamically based on competitor moves. This spider crawls product pages, parses pricing data, and exports it for analysis.',
        frameworks: ['Scrapy', 'Beautiful Soup', 'Pandas'],
        complexity: 'Medium',
        codeSnippet: `
# 1. spider.py
import scrapy
from bs4 import BeautifulSoup
import pandas as pd

class PriceSpider(scrapy.Spider):
    name = "competitor_prices"
    start_urls = ['https://competitor-store.com/category/electronics']

    def parse(self, response):
        # 1. Use Beautiful Soup for resilient parsing
        soup = BeautifulSoup(response.text, 'html.parser')
        products = soup.find_all('div', class_='product-card')

        data = []
        for p in products:
            title = p.find('h2', class_='title').get_text().strip()
            price_str = p.find('span', class_='price').get_text()
            price = float(price_str.replace('$', ''))
            
            data.append({
                'product': title,
                'price': price,
                'timestamp': pd.Timestamp.now()
            })

        # 2. Real-time Analysis with Pandas
        df = pd.DataFrame(data)
        
        # Check for significant price drops (alert logic)
        avg_price = df['price'].mean()
        cheap_items = df[df['price'] < avg_price * 0.8]
        
        if not cheap_items.empty:
            print(f"[ALERT] Found {len(cheap_items)} heavily discounted items!")
            
        yield from data
`
    },
    {
        id: 'sol-3',
        title: 'Enterprise CLI Maintenance Tool',
        description: 'Create a custom command-line interface to manage server fleets.',
        useCase: 'DevOps teams need a safe, standardized way to trigger maintenance scripts across hundreds of servers. This CLI tool wraps Ansible playbooks with safety checks.',
        frameworks: ['Click', 'Ansible', 'Python'],
        complexity: 'Low',
        codeSnippet: `
# 1. main.py
import click
import subprocess
import sys

@click.group()
def cli():
    """Megam OS Infrastructure CLI Tool"""
    pass

@cli.command()
@click.option('--target', '-t', required=True, help='Target server group (e.g., "webservers")')
@click.option('--force', is_flag=True, help='Skip safety confirmation')
def restart_services(target, force):
    """Restart Nginx and Gunicorn on target fleet"""
    
    if not force:
        click.confirm(f"Are you sure you want to restart services on {target}?", abort=True)
    
    click.echo(f"🚀 Triggering Ansible playbook for {target}...")
    
    # Run Ansible Playbook via subprocess
    cmd = [
        "ansible-playbook", 
        "-i", "inventory.ini",
        "playbooks/restart_web.yml",
        "--limit", target
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        click.secho("✅ Services restarted successfully.", fg="green")
    else:
        click.secho("❌ Failed to restart services.", fg="red")
        click.echo(result.stderr)

if __name__ == '__main__':
    cli()
`
    },
    {
        id: 'sol-4',
        title: 'End-to-End Testing Bot',
        description: 'Automate UI testing to verify application health after every deploy.',
        useCase: 'Before routing traffic to a new build, a QA bot logs in, navigates through the critical user paths, and verifies that the UI elements are responsive.',
        frameworks: ['Selenium', 'Pytest'],
        complexity: 'High',
        codeSnippet: `
# 1. test_ui.py
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

@pytest.fixture
def driver():
    # Setup Chrome in headless mode for CI/CD
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    driver = webdriver.Chrome(options=options)
    yield driver
    driver.quit()

def test_login_flow(driver):
    """Verify user can login and see the dashboard"""
    driver.get("https://app.megamos.com/login")
    
    # 1. Fill Login Form
    driver.find_element(By.NAME, "email").send_keys("admin@test.com")
    driver.find_element(By.NAME, "password").send_keys("securePass123" + Keys.RETURN)
    
    # 2. Verify Redirect
    assert "dashboard" in driver.current_url
    
    # 3. Check for specific UI element
    welcome_msg = driver.find_element(By.ID, "welcome-header").text
    assert "Welcome, Admin" in welcome_msg
    
    print("✅ Login Flow Verified")
`
    },
    {
        id: 'sol-5',
        title: 'Customer Sentiment API',
        description: 'Microservice to analyze support ticket tone in real-time.',
        useCase: 'Connect this API to your Helpdesk software. It scores incoming tickets and flags "Angry" or "Urgent" requests for immediate manager escalation.',
        frameworks: ['FastAPI', 'NLTK', 'Scikit-learn'],
        complexity: 'Medium',
        codeSnippet: `
# 1. main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# Download NLTK lexicon (run once)
nltk.download('vader_lexicon')

app = FastAPI()
sia = SentimentIntensityAnalyzer()

class Ticket(BaseModel):
    id: str
    text: str

@app.post("/analyze/sentiment")
async def analyze_ticket(ticket: Ticket):
    """Score the sentiment of a support ticket"""
    
    scores = sia.polarity_scores(ticket.text)
    compound = scores['compound']
    
    # Determine Status
    if compound < -0.6:
        status = "URGENT_ESCALATION"
        priority = "HIGH"
    elif compound < -0.2:
        status = "NEGATIVE"
        priority = "MEDIUM"
    else:
        status = "NORMAL"
        priority = "LOW"
        
    return {
        "ticket_id": ticket.id,
        "sentiment_score": compound,
        "classification": status,
        "recommended_priority": priority,
        "automations_triggered": status == "URGENT_ESCALATION"
    }
`
    }
];

const PackageCenter: React.FC = () => {
  const [activeView, setActiveView] = useState<'STORE' | 'GUIDE' | 'MAGIC_BOX' | 'SOLUTIONS'>('STORE');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'WEB' | 'DATA' | 'DEVOPS' | 'OS' | 'SERVER' | 'APP' | 'DEV' | 'SECURITY' | 'API'>('ALL');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(PACKAGES);
  const [installingId, setInstallingId] = useState<string | null>(null);
  
  // Magic Box State
  const [magicPackage, setMagicPackage] = useState(PACKAGES[0].id);
  const [magicPrompt, setMagicPrompt] = useState('');
  const [magicCode, setMagicCode] = useState('');
  const [magicOutput, setMagicOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Guide State
  const [selectedGuidePkg, setSelectedGuidePkg] = useState(PACKAGES[0]);

  // Solutions State
  const [selectedSolution, setSelectedSolution] = useState<SolutionRecipe | null>(null);

  const toggleInstall = (id: string) => {
      // Find package
      const pkg = items.find(p => p.id === id);
      if (!pkg) return;

      if (pkg.installed) {
          // Instant uninstall
          setItems(prev => prev.map(p => p.id === id ? { ...p, installed: false } : p));
      } else {
          // Simulate Installation Process
          setInstallingId(id);
          setTimeout(() => {
              setItems(prev => prev.map(p => p.id === id ? { ...p, installed: true } : p));
              setInstallingId(null);
          }, 2000);
      }
  };

  const handleGenerateMagic = async () => {
      if (!magicPrompt) return;
      setIsGenerating(true);
      const pkgName = items.find(p => p.id === magicPackage)?.name || '';
      const code = await generatePackageScript(pkgName, magicPrompt);
      setMagicCode(code);
      setIsGenerating(false);
  };

  const handleRunMagic = () => {
      setIsRunning(true);
      setMagicOutput('Initializing Megam Sandbox environment...\nLoading Neural Bridge context...\n');
      setTimeout(() => {
          setMagicOutput(prev => prev + `\n> Executing script for ${items.find(p => p.id === magicPackage)?.name}...\n`);
          setTimeout(() => {
              setMagicOutput(prev => prev + `[SUCCESS] Script executed successfully.\nOutput: { status: 200, message: "Operation completed on Badal Cloud" }`);
              setIsRunning(false);
          }, 1500);
      }, 800);
  };

  const filteredPackages = items.filter(p => 
      (activeCategory === 'ALL' || p.category === activeCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg shadow-pink-900/20">
                    <Package size={24} className="text-white"/>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Megam Package Center</h1>
                    <p className="text-slate-400 text-xs">Manage Open Source Libraries & APIs</p>
                </div>
            </div>
            
            {/* Main Nav */}
            <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                <button onClick={() => setActiveView('STORE')} className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition ${activeView === 'STORE' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    <Box size={14}/> Store
                </button>
                <button onClick={() => setActiveView('GUIDE')} className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition ${activeView === 'GUIDE' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    <BookOpen size={14}/> Installation Guide
                </button>
                <button onClick={() => setActiveView('MAGIC_BOX')} className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition ${activeView === 'MAGIC_BOX' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    <Wand2 size={14}/> Magic Box
                </button>
                <button onClick={() => setActiveView('SOLUTIONS')} className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition ${activeView === 'SOLUTIONS' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    <Lightbulb size={14}/> Solution Bank
                </button>
            </div>

            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search packages..."
                    className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-pink-500 outline-none w-64"
                />
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
            
            {/* 1. STORE VIEW */}
            {activeView === 'STORE' && (
                <div className="h-full flex flex-col">
                    <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 overflow-x-auto">
                        {[
                            { id: 'ALL', label: 'All', icon: Box },
                            { id: 'OS', label: 'OS & Kernel', icon: Cpu },
                            { id: 'SERVER', label: 'Servers', icon: Server },
                            { id: 'WEB', label: 'Web Dev', icon: Code },
                            { id: 'DATA', label: 'AI & Data', icon: Database },
                            { id: 'DEVOPS', label: 'DevOps', icon: Layers },
                            { id: 'APP', label: 'Apps', icon: Layout },
                            { id: 'DEV', label: 'Dev Tools', icon: Terminal },
                            { id: 'SECURITY', label: 'Security', icon: Shield },
                            { id: 'API', label: 'Badal APIs', icon: Zap },
                        ].map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id as any)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeCategory === cat.id ? 'border-pink-500 text-pink-400 bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                            >
                                <cat.icon size={16} /> {cat.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredPackages.map(pkg => (
                                <div key={pkg.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-pink-500/50 transition flex flex-col justify-between group">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-300 group-hover:text-pink-400 transition">
                                                <pkg.icon size={24} />
                                            </div>
                                            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-500 border border-slate-700">{pkg.version}</span>
                                        </div>
                                        <h3 className="font-bold text-white mb-1">{pkg.name}</h3>
                                        <p className="text-xs text-slate-400 mb-4 line-clamp-2">{pkg.description}</p>
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {pkg.tags.map(t => (
                                                <span key={t} className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-500 font-bold">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => toggleInstall(pkg.id)}
                                        disabled={installingId === pkg.id}
                                        className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                                            installingId === pkg.id 
                                            ? 'bg-slate-800 text-pink-400 border border-pink-500/50'
                                            : pkg.installed 
                                            ? 'bg-slate-800 text-green-400 border border-slate-700 hover:bg-slate-700' 
                                            : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/20'
                                        }`}
                                    >
                                        {installingId === pkg.id ? (
                                            <><Loader2 size={14} className="animate-spin" /> Installing...</>
                                        ) : pkg.installed ? (
                                            <><CheckCircle2 size={14} /> Installed</>
                                        ) : (
                                            <><Download size={14} /> Install</>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. GUIDE VIEW */}
            {activeView === 'GUIDE' && (
                <div className="h-full flex">
                     {/* Sidebar */}
                     <div className="w-64 bg-slate-900 border-r border-slate-800 overflow-y-auto">
                         <div className="p-4 text-xs font-bold text-slate-500 uppercase">Select Package</div>
                         {items.map(pkg => (
                             <button
                                key={pkg.id}
                                onClick={() => setSelectedGuidePkg(pkg)}
                                className={`w-full text-left px-4 py-3 border-l-2 transition hover:bg-slate-800 flex items-center gap-3 ${selectedGuidePkg.id === pkg.id ? 'border-pink-500 bg-slate-800 text-white' : 'border-transparent text-slate-400'}`}
                             >
                                 <pkg.icon size={16}/>
                                 <span className="text-sm font-medium">{pkg.name}</span>
                             </button>
                         ))}
                     </div>

                     {/* Content */}
                     <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
                         <div className="max-w-3xl mx-auto space-y-8">
                             <div className="flex items-start gap-6 pb-6 border-b border-slate-800">
                                 <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                     <selectedGuidePkg.icon size={48} className="text-pink-500"/>
                                 </div>
                                 <div>
                                     <h2 className="text-3xl font-bold text-white mb-2">{selectedGuidePkg.name}</h2>
                                     <p className="text-slate-400 text-lg mb-4">{selectedGuidePkg.description}</p>
                                     <div className="flex gap-2">
                                         <span className={`px-2 py-1 rounded text-xs font-bold ${selectedGuidePkg.installed ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                                             {selectedGuidePkg.installed ? 'Installed' : 'Not Installed'}
                                         </span>
                                         <span className="px-2 py-1 rounded text-xs font-bold bg-slate-800 text-slate-400">{selectedGuidePkg.version}</span>
                                     </div>
                                 </div>
                             </div>

                             {/* Installation */}
                             <div className="space-y-4">
                                 <h3 className="text-xl font-bold text-white flex items-center gap-2"><Terminal size={20}/> Installation</h3>
                                 <div className="bg-black border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 flex justify-between items-center group">
                                     <span>{selectedGuidePkg.installCmd || 'No install command'}</span>
                                     <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition"><Copy size={16}/></button>
                                 </div>
                                 {!selectedGuidePkg.installed && (
                                     <button 
                                        onClick={() => toggleInstall(selectedGuidePkg.id)}
                                        disabled={installingId === selectedGuidePkg.id}
                                        className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2"
                                    >
                                         {installingId === selectedGuidePkg.id ? <Loader2 className="animate-spin" size={16}/> : <Download size={16}/>}
                                         {installingId === selectedGuidePkg.id ? 'Processing...' : 'Install Now'}
                                     </button>
                                 )}
                             </div>

                             {/* Configuration */}
                             <div className="space-y-4">
                                 <h3 className="text-xl font-bold text-white flex items-center gap-2"><Settings size={20}/> Configuration</h3>
                                 <div className="bg-[#1e1e1e] border border-slate-800 rounded-lg p-4 font-mono text-sm text-blue-300">
                                     {selectedGuidePkg.configSnippet || '# No configuration snippet available'}
                                 </div>
                             </div>

                             {/* Badal API Specific Flow */}
                             {selectedGuidePkg.category === 'API' && (
                                 <div className="bg-gradient-to-r from-indigo-900/20 to-blue-900/20 border border-indigo-500/30 rounded-xl p-6 space-y-4">
                                     <h3 className="text-lg font-bold text-white flex items-center gap-2"><Zap size={20} className="text-yellow-400"/> Badal API Connection</h3>
                                     <p className="text-sm text-slate-400">
                                         {selectedGuidePkg.installed 
                                            ? "This API is installed and connected to your Badal Cloud account." 
                                            : "This API is not yet connected. Install the package to provision your keys."}
                                     </p>
                                     {selectedGuidePkg.installed ? (
                                         <div className="flex gap-4">
                                              <div className="flex-1 bg-black/50 border border-slate-700 rounded p-3 text-xs font-mono text-green-400">
                                                  Status: Connected
                                                  <br/>Key: sk_live_badal_...89x
                                              </div>
                                              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded">Rotate Keys</button>
                                         </div>
                                     ) : (
                                         <button onClick={() => toggleInstall(selectedGuidePkg.id)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-900/20">
                                             Provision & Connect API
                                         </button>
                                     )}
                                 </div>
                             )}
                         </div>
                     </div>
                </div>
            )}

            {/* 3. MAGIC BOX VIEW */}
            {activeView === 'MAGIC_BOX' && (
                <div className="h-full flex flex-col lg:flex-row">
                    {/* Left: Input */}
                    <div className="lg:w-1/3 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto">
                        <div>
                             <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Wand2 className="text-pink-500"/> Magic Box</h2>
                             <p className="text-sm text-slate-400">Describe what you want to build, and we'll generate the solution script using your installed packages.</p>
                        </div>

                        <div className="space-y-4">
                             <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Package Context</label>
                                 <select 
                                    value={magicPackage}
                                    onChange={(e) => setMagicPackage(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-pink-500"
                                 >
                                     {items.filter(p => p.installed).map(p => (
                                         <option key={p.id} value={p.id}>{p.name}</option>
                                     ))}
                                 </select>
                             </div>

                             <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase block mb-2">What do you want to build?</label>
                                 <textarea 
                                    value={magicPrompt}
                                    onChange={(e) => setMagicPrompt(e.target.value)}
                                    className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-pink-500 resize-none"
                                    placeholder="e.g., Create a simple REST API with 2 endpoints..."
                                 />
                             </div>

                             <button 
                                onClick={handleGenerateMagic}
                                disabled={isGenerating || !magicPrompt}
                                className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold shadow-lg shadow-pink-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
                             >
                                 {isGenerating ? <Loader2 className="animate-spin" size={18}/> : <Wand2 size={18}/>}
                                 Generate Solution
                             </button>
                        </div>
                    </div>

                    {/* Right: Output */}
                    <div className="flex-1 bg-[#1e1e1e] flex flex-col">
                        <div className="flex-1 p-6 overflow-y-auto border-b border-black">
                             <div className="flex justify-between items-center mb-2">
                                 <span className="text-xs font-bold text-slate-400 uppercase">Generated Code</span>
                                 <button className="text-xs text-slate-500 hover:text-white flex items-center gap-1"><Copy size={12}/> Copy</button>
                             </div>
                             {magicCode ? (
                                 <pre className="font-mono text-sm text-blue-300 whitespace-pre-wrap">{magicCode}</pre>
                             ) : (
                                 <div className="h-full flex items-center justify-center text-slate-600 italic text-sm">
                                     Generated code will appear here...
                                 </div>
                             )}
                        </div>
                        <div className="h-1/3 bg-black p-4 font-mono text-xs flex flex-col">
                             <div className="flex justify-between items-center mb-2">
                                 <span className="text-slate-500 font-bold uppercase flex items-center gap-2"><Terminal size={12}/> Terminal Output</span>
                                 <button 
                                    onClick={handleRunMagic}
                                    disabled={!magicCode || isRunning}
                                    className="px-4 py-1 bg-green-700 hover:bg-green-600 text-white rounded font-bold flex items-center gap-2 disabled:opacity-50"
                                 >
                                     <Play size={12}/> Run Test
                                 </button>
                             </div>
                             <div className="flex-1 overflow-y-auto text-slate-300 space-y-1">
                                 {isRunning && <div className="text-yellow-500">Running...</div>}
                                 <pre className="whitespace-pre-wrap">{magicOutput}</pre>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. SOLUTION BANK VIEW */}
            {activeView === 'SOLUTIONS' && (
                <div className="h-full flex bg-slate-950">
                    {selectedSolution ? (
                        // Detailed View
                        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right duration-300">
                            <div className="border-b border-slate-800 bg-slate-900/50 p-6 flex justify-between items-center">
                                <button onClick={() => setSelectedSolution(null)} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-bold">
                                    <ArrowRight size={16} className="rotate-180"/> Back to Solutions
                                </button>
                                <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg font-bold text-xs transition">
                                    <Copy size={16}/> Copy to IDE
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="max-w-4xl mx-auto space-y-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-900/30 text-pink-400 border border-pink-500/30 uppercase">{selectedSolution.complexity} Complexity</span>
                                            <div className="flex gap-2">
                                                {selectedSolution.frameworks.map(fw => (
                                                    <span key={fw} className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs font-mono">{fw}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <h1 className="text-3xl font-bold text-white mb-2">{selectedSolution.title}</h1>
                                        <p className="text-lg text-slate-400">{selectedSolution.description}</p>
                                    </div>

                                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                        <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Lightbulb size={20} className="text-yellow-400"/> Real-Life Use Case</h3>
                                        <p className="text-slate-300 leading-relaxed text-sm">{selectedSolution.useCase}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><FileCode size={20} className="text-blue-400"/> Implementation Recipe</h3>
                                        <div className="bg-[#1e1e1e] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                                            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-black">
                                                <div className="flex gap-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                </div>
                                                <span className="text-xs font-mono text-slate-500">solution.py</span>
                                            </div>
                                            <pre className="p-6 font-mono text-sm text-blue-300 overflow-x-auto">
                                                {selectedSolution.codeSnippet}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // List View
                        <div className="flex-1 p-8 overflow-y-auto">
                            <div className="max-w-6xl mx-auto">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Lightbulb size={28} className="text-pink-500"/> Solution Bank</h2>
                                    <p className="text-slate-400">Discover production-ready architectures and code patterns using our powerful open-source library.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {SOLUTIONS.map(sol => (
                                        <div 
                                            key={sol.id} 
                                            onClick={() => setSelectedSolution(sol)}
                                            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-pink-500/50 transition cursor-pointer group hover:bg-slate-800 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition">
                                                <ArrowRight size={20} className="text-pink-500 -rotate-45"/>
                                            </div>
                                            <div className="mb-4">
                                                <div className="flex gap-2 mb-2">
                                                    {sol.frameworks.slice(0, 3).map(fw => (
                                                        <span key={fw} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">{fw}</span>
                                                    ))}
                                                    {sol.frameworks.length > 3 && <span className="text-[10px] text-slate-500 px-1">+{sol.frameworks.length - 3}</span>}
                                                </div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition">{sol.title}</h3>
                                            </div>
                                            <p className="text-sm text-slate-400 line-clamp-2 mb-4">{sol.description}</p>
                                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                                                <Activity size={12}/> {sol.complexity} Complexity
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    </div>
  );
};

export default PackageCenter;
