
import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { SearchLog, ApiRequest, DonationLog, SponsoredItem } from '../types';
import { 
  LayoutDashboard, 
  Search, 
  Key, 
  CreditCard, 
  Image as ImageIcon, 
  LogOut, 
  TrendingUp, 
  Users, 
  DollarSign,
  Check,
  X,
  Trash2,
  Plus,
  Lock,
  Building2,
  Clock,
  ExternalLink,
  Edit2
} from 'lucide-react';

export const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'api' | 'donations' | 'cms'>('cms');
  const [isAuthenticated, setIsAuthenticated] = useState(adminService.isAuthenticated());
  const [password, setPassword] = useState('');

  // Data States
  const [stats, setStats] = useState(adminService.getStats());
  const [logs, setLogs] = useState<SearchLog[]>([]);
  const [apiRequests, setApiRequests] = useState<ApiRequest[]>([]);
  const [donations, setDonations] = useState<DonationLog[]>([]);
  const [sponsoredItems, setSponsoredItems] = useState<SponsoredItem[]>([]);

  // CMS Form State
  const [newItem, setNewItem] = useState<Partial<SponsoredItem>>({ tag: 'SPONSORED' });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, activeTab]);

  const refreshData = () => {
    setStats(adminService.getStats());
    setLogs(adminService.getLogs());
    setApiRequests(adminService.getApiRequests());
    setDonations(adminService.getDonations());
    setSponsoredItems(adminService.getSponsoredContent());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminService.login(password)) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    adminService.logout();
    setIsAuthenticated(false);
    onLogout();
  };

  const handleApiAction = (id: string, status: 'approved' | 'rejected') => {
    adminService.updateApiRequestStatus(id, status);
    // Visual feedback
    const action = status === 'approved' ? 'Approved' : 'Rejected';
    console.log(`Request ${id} ${action}`);
    refreshData();
  };

  const handleOpenEdit = (item: SponsoredItem) => {
    setNewItem(item);
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleOpenAdd = () => {
    setNewItem({ tag: 'SPONSORED' });
    setEditingId(null);
    setShowModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.title && newItem.imageUrl) {
      if (editingId) {
        adminService.updateSponsoredItem(editingId, newItem);
      } else {
        adminService.addSponsoredItem(newItem as Omit<SponsoredItem, 'id'>);
      }
      setShowModal(false);
      setNewItem({ tag: 'SPONSORED' });
      setEditingId(null);
      refreshData();
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      adminService.deleteSponsoredItem(id);
      refreshData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex justify-center mb-6">
             <div className="p-3 bg-slate-900 rounded-xl">
                <Lock className="w-8 h-8 text-white" />
             </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Access</h2>
          <p className="text-center text-gray-500 mb-6">AskLiberia Knowledge Engine</p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberia-blue outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin key..."
              />
            </div>
            <button type="submit" className="w-full py-2 bg-liberia-blue text-white rounded-lg font-bold hover:bg-blue-900 transition-colors">
              Login Dashboard
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">Demo Key: admin123</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-serif font-bold">AskLiberia <span className="text-liberia-red">Admin</span></h1>
          <p className="text-xs text-gray-500 mt-1">v1.1.0 Stable</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-liberia-blue text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <LayoutDashboard className="w-5 h-5" /> <span>Overview</span>
          </button>
          <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'logs' ? 'bg-liberia-blue text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <Search className="w-5 h-5" /> <span>Search Logs</span>
          </button>
          <button onClick={() => setActiveTab('api')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'api' ? 'bg-liberia-blue text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <Key className="w-5 h-5" /> <span>API Requests</span>
            {stats.pendingRequests > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">{stats.pendingRequests}</span>}
          </button>
          <button onClick={() => setActiveTab('donations')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'donations' ? 'bg-liberia-blue text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <CreditCard className="w-5 h-5" /> <span>Donations</span>
          </button>
          <button onClick={() => setActiveTab('cms')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'cms' ? 'bg-liberia-blue text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <ImageIcon className="w-5 h-5" /> <span>Sponsored CMS</span>
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-400 hover:text-white w-full px-4 py-2">
            <LogOut className="w-5 h-5" /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
             <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab.replace('-', ' ')} Dashboard</h1>
             <div className="flex items-center space-x-4">
                 <div className="text-sm text-gray-500 hidden md:block">{new Date().toLocaleDateString('en-LR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                 <button onClick={handleLogout} className="md:hidden text-gray-500"><LogOut className="w-5 h-5" /></button>
             </div>
        </header>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg text-liberia-blue"><Search className="w-6 h-6" /></div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Total Searches</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSearches}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Users className="w-6 h-6" /></div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Unique Visitors (Est)</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Key className="w-6 h-6" /></div>
                  {stats.pendingRequests > 0 && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Pending API Keys</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600"><DollarSign className="w-6 h-6" /></div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                      <th className="pb-3">Query</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3">Time</th>
                      <th className="pb-3">Language</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {logs.slice(0, 5).map((log) => (
                      <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900">{log.query}</td>
                        <td className="py-3 text-gray-600">{log.location}</td>
                        <td className="py-3 text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                         <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-xs ${log.language === 'Koloqua' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                                {log.language}
                            </span>
                        </td>
                      </tr>
                    ))}
                    {logs.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-gray-400">No activity yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Full Search History</h3>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                      <th className="p-4 rounded-tl-lg">Timestamp</th>
                      <th className="p-4">User Query</th>
                      <th className="p-4">Context (County)</th>
                      <th className="p-4 rounded-tr-lg">Mode</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="p-4 text-gray-500 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-4 font-medium text-gray-900">{log.query}</td>
                        <td className="p-4 text-gray-600">{log.location}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${log.language === 'Koloqua' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                {log.language}
                            </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>
        )}

        {/* API Requests Tab */}
        {activeTab === 'api' && (
           <div className="space-y-6">
             <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center space-x-3">
                <Key className="w-6 h-6 text-liberia-blue" />
                <div>
                    <h3 className="font-bold text-gray-900">API Access Governance</h3>
                    <p className="text-xs text-gray-600">Review organization requests for Partner and Enterprise tiers. Approving a request grants full commercial API rights.</p>
                </div>
             </div>

             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Access Requests List</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Real-time Sync</span>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {apiRequests.length === 0 ? (
                        <div className="text-center py-16">
                            <Key className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500">No developer access requests found.</p>
                        </div>
                    ) : (
                        apiRequests.map((req) => (
                            <div key={req.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <Building2 className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg">{req.organization || "Independent Developer"}</h4>
                                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                    <span>{req.email}</span>
                                                    <span>•</span>
                                                    <span>Requested {new Date(req.timestamp).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                                req.plan === 'partner' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                Tier: {req.plan}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                                req.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                                req.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                Status: {req.status}
                                            </span>
                                            {req.apiKey && (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-mono border border-gray-200">
                                                    Key: {req.apiKey}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        {req.status === 'pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleApiAction(req.id, 'approved')}
                                                    className="flex items-center px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
                                                >
                                                    <Check className="w-4 h-4 mr-2" /> Approve Request
                                                </button>
                                                <button 
                                                    onClick={() => handleApiAction(req.id, 'rejected')}
                                                    className="flex items-center px-5 py-2.5 bg-white text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-50 transition-all"
                                                >
                                                    <X className="w-4 h-4 mr-2" /> Reject
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex items-center text-sm font-medium text-gray-400">
                                                <Check className="w-4 h-4 mr-2" />
                                                Action Completed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
             </div>
           </div>
        )}

        {/* CMS Tab */}
        {activeTab === 'cms' && (
           <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Homepage "Featured" Content</h3>
                <button 
                    onClick={handleOpenAdd}
                    className="flex items-center px-4 py-2 bg-liberia-blue text-white rounded-lg font-medium hover:bg-blue-900"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add New
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sponsoredItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group relative flex flex-col">
                        <div className="h-40 bg-gray-200 overflow-hidden relative">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenEdit(item)} className="p-2 bg-white text-gray-700 rounded-lg shadow hover:text-liberia-blue" title="Edit Item"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteItem(item.id)} className="p-2 bg-white text-red-600 rounded-lg shadow hover:bg-red-50" title="Delete Item"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                            <div className="mb-2">
                                <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase">{item.tag}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                            <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-[10px] text-gray-400 font-mono">ID: {item.id}</span>
                                <button onClick={() => handleOpenEdit(item)} className="text-[10px] font-bold text-liberia-blue hover:underline uppercase tracking-wider">Quick Edit</button>
                            </div>
                        </div>
                    </div>
                ))}
             </div>

             {showModal && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">{editingId ? 'Edit Featured Content' : 'Add Featured Content'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        
                        <form onSubmit={handleSaveItem} className="space-y-4">
                            {/* Live Preview */}
                            {newItem.imageUrl && (
                                <div className="mb-4">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Image Preview</label>
                                    <div className="h-32 rounded-lg overflow-hidden border border-gray-100">
                                        <img src={newItem.imageUrl} className="w-full h-full object-cover" alt="Preview" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL')} />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                                <input type="text" required className="w-full px-3 py-2 border rounded-lg text-sm" value={newItem.title || ''} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                                <textarea required className="w-full px-3 py-2 border rounded-lg text-sm h-20 resize-none" value={newItem.description || ''} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
                                <input type="url" required placeholder="https://..." className="w-full px-3 py-2 border rounded-lg text-sm" value={newItem.imageUrl || ''} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Tag</label>
                                    <select className="w-full px-3 py-2 border rounded-lg text-sm" value={newItem.tag} onChange={e => setNewItem({...newItem, tag: e.target.value})}>
                                        <option value="TOURISM">Tourism</option>
                                        <option value="EDUCATION">Education</option>
                                        <option value="SPONSORED">Sponsored</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Btn Text</label>
                                    <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={newItem.buttonText || ''} onChange={e => setNewItem({...newItem, buttonText: e.target.value})} placeholder="Learn More" />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-liberia-blue text-white rounded-lg text-sm font-bold hover:bg-blue-900">
                                    {editingId ? 'Update Content' : 'Save Content'}
                                </button>
                            </div>
                        </form>
                    </div>
                 </div>
             )}
           </div>
        )}
        
        {activeTab === 'donations' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Donation History</h3>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                      <th className="p-4 rounded-tl-lg">Date</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method</th>
                      <th className="p-4 rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {donations.map((d) => (
                      <tr key={d.id}>
                        <td className="p-4 text-gray-500 font-mono text-xs">{new Date(d.timestamp).toLocaleDateString()}</td>
                        <td className="p-4 font-bold text-green-600">${d.amount}</td>
                        <td className="p-4 capitalize">{d.method === 'local' ? 'Mobile Money' : 'Card/Intl'}</td>
                        <td className="p-4"><span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">Completed</span></td>
                      </tr>
                    ))}
                     {donations.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-400">No donations yet.</td></tr>}
                  </tbody>
                </table>
             </div>
           </div>
        )}

      </main>
    </div>
  );
};
