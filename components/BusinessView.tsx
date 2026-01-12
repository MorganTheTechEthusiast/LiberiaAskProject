
import React, { useState } from 'react';
import { adminService } from '../services/adminService';
import { 
  Code, Target, Briefcase, Heart, Check, ArrowRight, 
  Globe, X, CheckCircle, Building2, User as UserIcon, 
  Zap, Database, Terminal, Shield, Target as TargetIcon,
  Heart as HeartIcon, Key, Copy, Eye, EyeOff, Loader2, Send
} from 'lucide-react';
import { ApiPlan, User } from '../types';

interface BusinessViewProps {
    currentUser: User | null;
    onUserUpdate?: (user: User) => void;
}

export const BusinessView: React.FC<BusinessViewProps> = ({ currentUser, onUserUpdate }) => {
  const [activeModal, setActiveModal] = useState<ApiPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Request Form State
  const [orgName, setOrgName] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleModalClose = () => {
    setActiveModal(null);
    setLoading(false);
    setSuccess(false);
    setRequestSubmitted(false);
    setOrgName('');
  };

  const handleUpgrade = async (plan: ApiPlan) => {
    if (!currentUser) return alert("Please sign in first.");
    
    // Partner plan requires a manual request submission
    if (plan === 'partner') {
        setActiveModal('partner');
        return;
    }

    setLoading(true);
    try {
        await adminService.upgradePlan(currentUser.id, plan);
        // Refresh user data locally
        const updatedUser = adminService.getUsers().find(u => u.id === currentUser.id);
        if (updatedUser && onUserUpdate) {
            onUserUpdate(updatedUser);
        }
        setSuccess(true);
    } catch (err) {
        console.error(err);
        alert("Action failed. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleSubmitPartnerRequest = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser) return;
      setLoading(true);
      try {
          adminService.submitApiRequest({
              userId: currentUser.id,
              email: currentUser.email,
              organization: orgName,
              plan: 'partner'
          });
          setRequestSubmitted(true);
          setSuccess(true);
      } catch (err) {
          alert("Failed to submit request.");
      } finally {
          setLoading(false);
      }
  };

  const handleCopyKey = () => {
      if (currentUser?.apiKey) {
          navigator.clipboard.writeText(currentUser.apiKey);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white animate-in fade-in duration-500 relative">
      {/* Hero Section */}
      <div className="relative bg-[#0d1b2a] text-white py-24 px-4 overflow-hidden min-h-[500px] flex items-center">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b2a]/80 to-[#0d1b2a]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-2 rounded-full border border-white/30 mb-8 bg-white/5 backdrop-blur-sm">
             <span className="text-sm font-bold text-liberia-gold tracking-widest uppercase">Monetization & Growth</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 tracking-tight">
            Grow with <span className="text-liberia-gold">AskLiberia</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12">
            We offer powerful tools for developers, advertising solutions for local businesses, and partnerships for institutions building Liberia's digital future.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => scrollToSection('plans')}
              className="flex items-center justify-center space-x-2 px-10 py-4 bg-[#001c44] hover:bg-blue-900 text-white rounded-full font-bold transition-all w-full sm:w-auto shadow-xl"
            >
              <span>Get API Key</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scrollToSection('advertising')}
              className="px-10 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-full font-bold transition-all w-full sm:w-auto shadow-lg"
            >
              Advertise with Us
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Developer Dashboard Section */}
        {currentUser && (
            <div className="mb-16 bg-slate-50 border border-slate-200 rounded-[2rem] p-8 md:p-12 animate-in slide-in-from-bottom-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-liberia-blue text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Developer Console</span>
                            <span className="text-xs text-slate-400 font-mono">ID: {currentUser.id}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Welcome, {currentUser.name.split(' ')[0]}</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase">Current Tier</p>
                            <p className="font-bold text-liberia-blue capitalize">{currentUser.apiPlan} Access</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* API Key Box */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
                            <Key className="w-4 h-4 mr-2 text-liberia-blue" />
                            Active API Key
                        </h3>
                        {currentUser.apiKey ? (
                            <div className="space-y-4">
                                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-3">
                                    <code className="flex-1 font-mono text-sm truncate mr-4 text-slate-600">
                                        {showKey ? currentUser.apiKey : '••••••••••••••••••••••••'}
                                    </code>
                                    <div className="flex items-center space-x-1">
                                        <button onClick={() => setShowKey(!showKey)} className="p-2 hover:bg-white rounded-lg text-slate-400">
                                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button onClick={handleCopyKey} className="p-2 hover:bg-white rounded-lg text-slate-400">
                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 italic">This key is unique to your account. Do not share it.</p>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-slate-500 mb-4">You haven't generated a key yet.</p>
                                <button 
                                    onClick={() => handleUpgrade('free')}
                                    disabled={loading}
                                    className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-liberia-blue text-white rounded-xl font-bold text-sm hover:bg-blue-900 transition-all w-full"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                    <span>Generate Free API Key</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Usage Progress */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
                            <Database className="w-4 h-4 mr-2 text-liberia-blue" />
                            Monthly Quota
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-slate-500">USAGE</span>
                                <span className="text-slate-900">{currentUser.apiUsage.used.toLocaleString()} / {currentUser.apiUsage.limit.toLocaleString()}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-liberia-blue transition-all duration-1000"
                                    style={{ width: `${Math.min((currentUser.apiUsage.used / currentUser.apiUsage.limit) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <button 
                                onClick={() => scrollToSection('plans')}
                                className="text-xs font-bold text-liberia-blue hover:underline"
                            >
                                Need a higher limit? Upgrade Tier &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Tier-Based Access Section */}
        <div id="plans" className="mb-24 pt-12">
            <div className="text-center mb-16">
                <div className="flex items-center justify-center mb-4 space-x-3">
                    <Code className="w-8 h-8 text-[#001c44]" />
                    <h2 className="text-4xl font-bold text-[#001c44]">AskLiberia Knowledge API</h2>
                </div>
                <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed">
                    Empowering researchers, startups, and educational institutions with structured data about Liberia.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Free Tier */}
                <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col relative">
                    <div className="mb-6">
                        <span className="bg-[#e7f6ed] text-[#22c55e] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Education</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[#001c44] mb-2">Free Tier</h3>
                    <div className="text-5xl font-bold text-[#001c44] mb-2">$0<span className="text-base font-normal text-gray-400">/mo</span></div>
                    <ul className="space-y-4 my-8 text-gray-600 text-sm flex-grow">
                        <li className="flex items-start"><Check className="w-4 h-4 text-[#22c55e] mr-2 mt-0.5" /> 1,000 requests / month</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-[#22c55e] mr-2 mt-0.5" /> Basic History & Culture endpoints</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-[#22c55e] mr-2 mt-0.5" /> Community Support</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-[#22c55e] mr-2 mt-0.5" /> Non-commercial use only</li>
                    </ul>
                    <button 
                        onClick={() => handleUpgrade('free')}
                        disabled={loading || currentUser?.apiPlan === 'free' && currentUser?.apiKey !== undefined}
                        className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all disabled:bg-gray-50 disabled:text-gray-400"
                    >
                        {loading ? 'Processing...' : currentUser?.apiPlan === 'free' && currentUser?.apiKey ? 'Current Plan' : 'Get Started'}
                    </button>
                </div>

                {/* Pro Tier (Popular) */}
                <div className="bg-white border-2 border-[#001c44] rounded-2xl p-8 shadow-xl flex flex-col relative transform md:-translate-y-4">
                    <div className="absolute top-0 right-0 bg-[#001c44] text-white px-4 py-1.5 rounded-bl-lg text-[10px] font-bold uppercase tracking-widest">Popular</div>
                    <div className="mb-6">
                        <span className="bg-[#eef2ff] text-[#4f46e5] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Startup</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[#001c44] mb-2">Pro Tier</h3>
                    <div className="text-5xl font-bold text-[#001c44] mb-2">$49<span className="text-base font-normal text-gray-400">/mo</span></div>
                    <ul className="space-y-4 my-8 text-gray-600 text-sm flex-grow">
                        <li className="flex items-start"><Check className="w-4 h-4 text-[#4f46e5] mr-2 mt-0.5" /> 50,000 requests / month</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-[#4f46e5] mr-2 mt-0.5" /> Full Knowledge Graph Access</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-[#4f46e5] mr-2 mt-0.5" /> Business & Tourism Directories</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-[#4f46e5] mr-2 mt-0.5" /> Commercial License</li>
                    </ul>
                    <button 
                        onClick={() => handleUpgrade('pro')}
                        disabled={loading || currentUser?.apiPlan === 'pro'}
                        className="w-full py-3 rounded-xl bg-[#001c44] text-white font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 disabled:bg-slate-400"
                    >
                        {loading ? 'Processing...' : currentUser?.apiPlan === 'pro' ? 'Current Plan' : 'Get Pro Access'}
                    </button>
                </div>

                {/* Partner Tier */}
                <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col relative">
                    <div className="mb-6">
                        <span className="bg-[#f5f3ff] text-[#7c3aed] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Enterprise</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[#001c44] mb-2">Partner</h3>
                    <div className="text-5xl font-bold text-[#001c44] mb-2">Custom</div>
                    <ul className="space-y-4 my-8 text-gray-600 text-sm flex-grow">
                        <li className="flex items-start"><Check className="w-4 h-4 text-[#7c3aed] mr-2 mt-0.5" /> Unlimited requests</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-[#7c3aed] mr-2 mt-0.5" /> Custom Data Ingestion</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-[#7c3aed] mr-2 mt-0.5" /> Dedicated Support</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-[#7c3aed] mr-2 mt-0.5" /> SLA Guarantees</li>
                    </ul>
                    <button 
                        onClick={() => handleUpgrade('partner')}
                        disabled={loading || currentUser?.apiPlan === 'partner'}
                        className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all disabled:bg-slate-50 disabled:text-gray-400"
                    >
                        {currentUser?.apiPlan === 'partner' ? 'Current Plan' : 'Request Access'}
                    </button>
                </div>
            </div>
        </div>

        {/* Targeted Advertising Section */}
        <div id="advertising" className="mb-24 flex flex-col lg:flex-row items-center gap-12 pt-12">
            <div className="lg:w-1/2">
                <div className="mb-4 inline-flex p-3 bg-orange-50 text-orange-600 rounded-2xl">
                    <TargetIcon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-[#001c44] mb-6 leading-tight">
                    Targeted Advertising for Liberian Businesses
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                    Get your hotel, restaurant, or service in front of high-intent users searching specifically for Liberian tourism and business information.
                </p>
                <div className="space-y-4">
                    <div className="flex items-start p-6 bg-gray-50 rounded-2xl">
                        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-orange-600 font-bold mr-4 shadow-sm">1</div>
                        <div>
                            <h4 className="font-bold text-[#001c44] mb-1">Keyword Targeting</h4>
                            <p className="text-sm text-gray-500">Show up when users search for "Best hotels in Monrovia" or "Car rental Liberia".</p>
                        </div>
                    </div>
                    <div className="flex items-start p-6 bg-gray-50 rounded-2xl">
                        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-orange-600 font-bold mr-4 shadow-sm">2</div>
                        <div>
                            <h4 className="font-bold text-[#001c44] mb-1">Contextual Sidebar Ads</h4>
                            <p className="text-sm text-gray-500">Non-intrusive placements alongside relevant research results.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:w-1/2 w-full relative">
                <div className="bg-gray-100 rounded-2xl p-8 border border-gray-200 shadow-sm min-h-[300px] flex flex-col justify-center relative overflow-hidden">
                    {/* Skeleton UI for Search Results */}
                    <div className="space-y-4 max-w-md">
                        <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                        <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                    </div>
                    
                    {/* Floating Ad Card */}
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 w-64 animate-in slide-in-from-right-10 duration-700">
                        <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Advertisement</div>
                        <img 
                            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" 
                            className="w-full h-24 object-cover rounded-lg mb-3" 
                            alt="Farmington"
                        />
                        <h4 className="font-bold text-[#001c44] text-sm mb-1">Farmington Hotel</h4>
                        <p className="text-[10px] text-gray-500 mb-3">Luxury accommodation near RIA.</p>
                        <button className="text-xs font-bold text-liberia-blue flex items-center hover:underline">
                            Book Now <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preview of Search Result Page</span>
                </div>
            </div>
        </div>

      </div>

      {/* Partner Request Modal */}
      {activeModal === 'partner' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-300">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-serif font-bold text-gray-900">Partner Access Request</h3>
                      <button onClick={handleModalClose} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
                  </div>

                  {requestSubmitted ? (
                      <div className="text-center py-8">
                          <div className="w-16 h-16 bg-blue-50 text-liberia-blue rounded-full flex items-center justify-center mx-auto mb-6">
                              <CheckCircle className="w-8 h-8" />
                          </div>
                          <h4 className="text-xl font-bold mb-2">Request Received!</h4>
                          <p className="text-sm text-gray-500">Our administrators will review your organization's request for Enterprise access. You'll receive a notification in your dashboard when approved.</p>
                          <button onClick={handleModalClose} className="mt-8 w-full py-3 bg-liberia-blue text-white rounded-xl font-bold">Great, Thanks</button>
                      </div>
                  ) : (
                      <form onSubmit={handleSubmitPartnerRequest} className="space-y-6">
                        <p className="text-sm text-gray-500">Please provide your organization details to request custom API limits and data integration.</p>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Organization Name</label>
                            <input 
                                type="text" 
                                required 
                                value={orgName} 
                                onChange={e => setOrgName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-liberia-blue transition-all"
                                placeholder="e.g. University of Liberia or Tech Startup"
                            />
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <Shield className="w-5 h-5 text-liberia-blue" />
                            <p className="text-xs text-gray-500">Our review process takes 24-48 hours. Upon approval, your API key will be automatically upgraded.</p>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading || !orgName}
                            className="w-full py-4 bg-liberia-blue text-white rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-900 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            <span>Submit Enterprise Request</span>
                        </button>
                      </form>
                  )}
              </div>
          </div>
      )}

      {/* Success Modal (General Upgrades) */}
      {success && !requestSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-sm text-center animate-in zoom-in">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Access Granted!</h3>
                <p className="text-sm text-gray-500 mb-6">Your plan has been updated. You can find your API key above or in your Profile Dashboard.</p>
                <button onClick={handleModalClose} className="w-full py-3 bg-liberia-blue text-white rounded-xl font-bold">Close</button>
            </div>
        </div>
      )}
    </div>
  );
};
