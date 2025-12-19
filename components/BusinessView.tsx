
import React, { useState } from 'react';
import { adminService } from '../services/adminService';
import { authService } from '../services/authService';
import { 
  Code, Target, Briefcase, Heart, Check, ArrowRight, 
  Globe, X, CheckCircle, Building2, User as UserIcon, 
  Zap, Database, Terminal, Shield, Target as TargetIcon,
  Heart as HeartIcon
} from 'lucide-react';
import { ApiPlan } from '../types';

export const BusinessView: React.FC = () => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [activeModal, setActiveModal] = useState<ApiPlan | null>(null);
  const [formData, setFormData] = useState({ email: '', org: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const currentUser = authService.getCurrentUser();

  const handleModalClose = () => {
    setActiveModal(null);
    setFormData({ email: '', org: '', message: '' });
    setLoading(false);
    setSuccess(false);
  };

  const handleUpgrade = async (plan: ApiPlan) => {
    if (!currentUser) return alert("Please sign in first.");
    setLoading(true);
    await adminService.upgradePlan(currentUser.id, plan);
    setLoading(false);
    setSuccess(true);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white animate-in fade-in duration-500 relative">
      {/* Hero Section - Updated to match Image Request */}
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
        
        {/* Tier-Based Access Section - Updated Heading to match Image 2 */}
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
                        disabled={currentUser?.apiPlan === 'free'}
                        className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all disabled:bg-gray-50 disabled:text-gray-400"
                    >
                        {currentUser?.apiPlan === 'free' ? 'Current Plan' : 'Get Started'}
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
                        disabled={currentUser?.apiPlan === 'pro'}
                        className="w-full py-3 rounded-xl bg-[#001c44] text-white font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20"
                    >
                        {currentUser?.apiPlan === 'pro' ? 'Current Plan' : 'Get Pro Access'}
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
                        onClick={() => setActiveModal('partner')}
                        className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all"
                    >
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>

        {/* Targeted Advertising Section (Image 2) */}
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

        {/* Institutional Partnerships Section */}
        <div id="partnerships" className="bg-gray-50 rounded-[3rem] p-12 md:p-20 text-center mb-24">
            <div className="inline-flex p-4 bg-white text-[#001c44] rounded-3xl shadow-sm mb-8">
                <Globe className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-bold text-[#001c44] mb-6">Institutional Partnerships</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-16 text-lg leading-relaxed">
                We are proud to partner with key national institutions to ensure data accuracy and promote digital literacy.
            </p>

            <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
                    <div className="w-12 h-12 bg-blue-50 text-[#001c44] rounded-2xl flex items-center justify-center mb-6">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#001c44] mb-4">Strategic Partners</h3>
                    <p className="text-gray-600 mb-8 flex-grow">
                        We work with the <strong>Ministry of Information, Cultural Affairs and Tourism (MICAT)</strong> and the <strong>University of Liberia</strong> to digitize archives.
                    </p>
                    <button className="text-[#001c44] font-bold hover:underline flex items-center">
                        Become a Partner <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>

                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
                    <div className="w-12 h-12 bg-red-50 text-[#BF0A30] rounded-2xl flex items-center justify-center mb-6">
                        <HeartIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#001c44] mb-4">Support AskLiberia</h3>
                    <p className="text-gray-600 mb-8 flex-grow">
                        Help us keep this knowledge engine free for Liberian students. Donate to our server fund through our NGO partners.
                    </p>
                    <button className="bg-[#BF0A30] text-white px-8 py-3 rounded-full font-bold hover:bg-red-800 transition-all shadow-lg shadow-red-900/20">
                        Donate Now
                    </button>
                </div>
            </div>
        </div>

      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-sm text-center animate-in zoom-in">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Access Granted!</h3>
                <p className="text-sm text-gray-500 mb-6">Your plan has been updated. You can find your API key in your Profile Dashboard.</p>
                <button onClick={handleModalClose} className="w-full py-3 bg-liberia-blue text-white rounded-xl font-bold">Go to Dashboard</button>
            </div>
        </div>
      )}
    </div>
  );
};
