
import React, { useState } from 'react';
import { User, ApiPlan } from '../types';
import { User as UserIcon, Mail, Calendar, Shield, CreditCard, Edit2, MapPin, Key, Copy, RefreshCw, Eye, EyeOff, BarChart3, Check, Loader2, Zap } from 'lucide-react';
import { adminService } from '../services/adminService';

interface ProfileViewProps {
  user: User;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user: initialUser }) => {
  const [user, setUser] = useState(initialUser);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const handleCopy = () => {
    if (user.apiKey) {
      navigator.clipboard.writeText(user.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRotateKey = async () => {
    if (!confirm("Are you sure you want to rotate your API key? The old one will stop working immediately.")) return;
    setIsRotating(true);
    try {
        const newKey = await adminService.rotateApiKey(user.id);
        setUser(prev => ({ ...prev, apiKey: newKey }));
    } catch (e) {
        alert("Failed to rotate key");
    } finally {
        setIsRotating(false);
    }
  };

  const usagePercent = Math.min((user.apiUsage.used / user.apiUsage.limit) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Developer Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your account, API credentials, and usage statistics.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-full px-4 py-1.5 flex items-center space-x-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-gray-700 uppercase">{user.apiPlan} Plan</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Identity Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
            <div className="h-24 bg-liberia-blue relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1547983539-f90147f7d52a?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center"></div>
            </div>
            <div className="px-6 pb-6 text-center relative">
              <div className="relative -mt-12 mb-4 inline-block">
                 <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto bg-white object-cover"
                 />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-6">{user.email}</p>
              
              <div className="border-t border-gray-100 pt-6 text-left space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                      <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                      <Shield className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="truncate">ID: {user.id}</span>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Stats */}
        <div className="md:col-span-2 space-y-8">
            
            {/* API Key Management (Step 4) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Key className="w-5 h-5 mr-2 text-liberia-blue" />
                        API Credentials
                    </h3>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">v1 API</div>
                </div>
                
                {user.apiKey ? (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Primary API Key</label>
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-4 group">
                                <div className="flex-grow font-mono text-sm overflow-hidden truncate mr-4">
                                    {showKey ? user.apiKey : '••••••••••••••••••••••••••••••••'}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => setShowKey(!showKey)} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500" title="Toggle Visibility">
                                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button onClick={handleCopy} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500" title="Copy to Clipboard">
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-400">Never share your API key publicly. Keep it safe.</p>
                            <button 
                                onClick={handleRotateKey} 
                                disabled={isRotating}
                                className="text-xs font-bold text-liberia-red hover:underline flex items-center"
                            >
                                {isRotating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1" />}
                                Rotate Key
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-sm mb-4">You haven't generated an API key yet.</p>
                        <button 
                            onClick={() => handleRotateKey()}
                            className="px-6 py-2 bg-liberia-blue text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20"
                        >
                            Generate First Key
                        </button>
                    </div>
                )}
            </div>

            {/* API Monitoring (Step 7) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-liberia-blue" />
                        Usage Monitoring
                    </h3>
                    <div className="text-xs font-bold text-liberia-blue bg-blue-50 px-3 py-1 rounded-full uppercase">Reset in 12 days</div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Requests Used</p>
                            <p className="text-2xl font-bold text-gray-900">{user.apiUsage.used.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Monthly Limit</p>
                            <p className="text-2xl font-bold text-gray-900">{user.apiUsage.limit.toLocaleString()}</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-gray-700">Quota Consumption</span>
                            <span className={usagePercent > 80 ? 'text-red-600' : 'text-liberia-blue'}>{usagePercent.toFixed(1)}%</span>
                        </div>
                        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                            <div 
                                className={`h-full transition-all duration-1000 ease-out ${usagePercent > 80 ? 'bg-red-500' : 'bg-liberia-blue'}`}
                                style={{ width: `${usagePercent}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-center space-x-3">
                         <Zap className="w-5 h-5 text-liberia-blue flex-shrink-0" />
                         <p className="text-xs text-gray-600 leading-relaxed">
                            Need more than <strong>{user.apiUsage.limit.toLocaleString()}</strong> requests? 
                            <a href="#" className="text-liberia-blue font-bold ml-1 hover:underline">Upgrade to Pro Tier</a> for full commercial rights.
                         </p>
                    </div>
                </div>
            </div>

            {/* Quick Support (Step 10) */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white flex items-center justify-between">
                <div>
                    <h4 className="font-bold">Developer Forum</h4>
                    <p className="text-xs text-slate-400">Get help from the community and AskLiberia engineers.</p>
                </div>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all">Join Discord</button>
            </div>

        </div>
      </div>
    </div>
  );
};
