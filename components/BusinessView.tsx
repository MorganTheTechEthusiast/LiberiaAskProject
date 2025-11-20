
import React, { useState } from 'react';
import { Code, Target, Briefcase, Heart, Check, ArrowRight, TrendingUp, Shield, Globe, X, Smartphone, CreditCard, Copy, CheckCircle, Mail, Building2, User, Loader2 } from 'lucide-react';

export const BusinessView: React.FC = () => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationType, setDonationType] = useState<'local' | 'international'>('local');
  const [selectedAmount, setSelectedAmount] = useState('20');
  const [copied, setCopied] = useState<string | null>(null);

  // State for Tier Modals
  const [activeModal, setActiveModal] = useState<'free' | 'pro' | 'partner' | null>(null);
  const [formData, setFormData] = useState({ email: '', org: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const handleDonateClick = () => {
    setShowDonationModal(true);
  };

  const closeDonationModal = () => {
    setShowDonationModal(false);
  };

  const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setFormData({ email: '', org: '', message: '' });
    setLoading(false);
    setSuccess(false);
    setGeneratedKey(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        if (activeModal === 'free') {
            setGeneratedKey(`ask_lib_${Math.random().toString(36).substring(2, 10)}`);
        }
    }, 1500);
  };

  const renderModalContent = () => {
    if (loading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-10 h-10 text-liberia-blue animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Processing request...</p>
            </div>
        );
    }

    if (success) {
        if (activeModal === 'free') {
            return (
                <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">API Key Generated!</h3>
                    <p className="text-sm text-gray-500 mb-6">Here is your personal access token. Keep it safe.</p>
                    
                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 flex items-center justify-between mb-6">
                        <code className="text-sm font-mono text-liberia-blue font-bold">{generatedKey}</code>
                        <button 
                            onClick={() => generatedKey && handleCopy(generatedKey)}
                            className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                            title="Copy Key"
                        >
                            {copied === generatedKey ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                        </button>
                    </div>
                    <button onClick={handleModalClose} className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800">Close</button>
                </div>
            );
        }
        if (activeModal === 'pro') {
             return (
                <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-liberia-blue text-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to Pro!</h3>
                    <p className="text-sm text-gray-500 mb-6">Your subscription is active. We have sent a verification link to your email to access the dashboard.</p>
                    <button onClick={handleModalClose} className="w-full py-2.5 bg-liberia-blue text-white rounded-lg font-medium hover:bg-blue-800">Go to Dashboard</button>
                </div>
            );
        }
        return (
            <div className="p-8 text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Inquiry Received</h3>
                <p className="text-sm text-gray-500 mb-6">Thank you for your interest. Our partnerships team will review your request and contact you within 24 hours.</p>
                <button onClick={handleModalClose} className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800">Done</button>
            </div>
        );
    }

    // Form Content
    return (
        <form onSubmit={handleFormSubmit} className="p-6">
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    {activeModal === 'free' && <><Code className="w-5 h-5 text-gray-500 mr-2" /> Get Free API Key</>}
                    {activeModal === 'pro' && <><Target className="w-5 h-5 text-liberia-blue mr-2" /> Upgrade to Pro</>}
                    {activeModal === 'partner' && <><Briefcase className="w-5 h-5 text-purple-600 mr-2" /> Partner Inquiry</>}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    {activeModal === 'free' && "Start building with 1,000 free requests/month."}
                    {activeModal === 'pro' && "Unlock full access and commercial rights."}
                    {activeModal === 'partner' && "Let's build the future of Liberia together."}
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input 
                            type="email" 
                            required 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberia-blue focus:border-liberia-blue outline-none text-sm"
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>

                {activeModal === 'partner' && (
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Organization / Company</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                required 
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberia-blue focus:border-liberia-blue outline-none text-sm"
                                placeholder="Ministry of Tourism"
                                value={formData.org}
                                onChange={(e) => setFormData({...formData, org: e.target.value})}
                            />
                        </div>
                    </div>
                )}

                {activeModal === 'pro' && (
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Card Details (Secured)</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                required 
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberia-blue focus:border-liberia-blue outline-none text-sm"
                                placeholder="0000 0000 0000 0000"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                             <input type="text" placeholder="MM/YY" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberia-blue outline-none text-sm" />
                             <input type="text" placeholder="CVC" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberia-blue outline-none text-sm" />
                        </div>
                    </div>
                )}

                {activeModal === 'partner' && (
                    <div>
                         <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message</label>
                         <textarea 
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberia-blue outline-none text-sm h-24 resize-none"
                            placeholder="Tell us about your project..."
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                         ></textarea>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <button 
                    type="submit" 
                    className={`w-full py-2.5 rounded-lg font-bold text-white transition-colors shadow-sm flex items-center justify-center ${
                        activeModal === 'free' ? 'bg-gray-900 hover:bg-gray-800' :
                        activeModal === 'pro' ? 'bg-liberia-blue hover:bg-blue-800' :
                        'bg-purple-600 hover:bg-purple-700'
                    }`}
                >
                    {activeModal === 'free' && "Generate Key"}
                    {activeModal === 'pro' && "Subscribe ($49/mo)"}
                    {activeModal === 'partner' && "Send Inquiry"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </button>
            </div>
        </form>
    );
  };

  return (
    <div className="w-full bg-white animate-in fade-in duration-500 relative">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 mb-6">
             <span className="text-sm font-medium tracking-wide text-liberia-gold">Monetization & Growth</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Grow with <span className="text-liberia-gold">AskLiberia</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            We offer powerful tools for developers, advertising solutions for local businesses, and partnerships for institutions building Liberia's digital future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button 
                onClick={() => setActiveModal('free')}
                className="px-8 py-3 bg-liberia-blue hover:bg-blue-800 text-white rounded-full font-medium transition-colors flex items-center justify-center"
             >
                Get API Key <ArrowRight className="w-4 h-4 ml-2" />
             </button>
             <button className="px-8 py-3 bg-white hover:bg-gray-50 text-slate-900 rounded-full font-medium transition-colors border border-gray-200">
                Advertise with Us
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* 1. Freemium API Section */}
        <div className="mb-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                    <Code className="w-8 h-8 text-liberia-blue" />
                    AskLiberia Knowledge API
                </h2>
                <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                    Empowering researchers, startups, and educational institutions with structured data about Liberia.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Free Tier */}
                <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col">
                    <div className="mb-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Education</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Free Tier</h3>
                    <div className="text-4xl font-bold mb-6">$0<span className="text-base font-normal text-gray-500">/mo</span></div>
                    <ul className="space-y-3 mb-8 text-gray-600 text-sm flex-grow">
                        <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> 1,000 requests / month</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Basic History & Culture endpoints</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Community Support</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Non-commercial use only</li>
                    </ul>
                    <button 
                        onClick={() => setActiveModal('free')}
                        className="w-full py-2 rounded-lg border border-gray-300 hover:border-gray-800 font-medium transition-colors"
                    >
                        Start Building
                    </button>
                </div>

                {/* Pro Tier */}
                <div className="border-2 border-liberia-blue rounded-2xl p-6 shadow-md bg-blue-50 relative flex flex-col">
                     <div className="absolute top-0 right-0 bg-liberia-blue text-white px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold">POPULAR</div>
                    <div className="mb-4">
                        <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Startup</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Pro Tier</h3>
                    <div className="text-4xl font-bold mb-6">$49<span className="text-base font-normal text-gray-500">/mo</span></div>
                    <ul className="space-y-3 mb-8 text-gray-700 text-sm flex-grow">
                        <li className="flex items-start"><Check className="w-4 h-4 text-liberia-blue mr-2 mt-0.5" /> 50,000 requests / month</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-liberia-blue mr-2 mt-0.5" /> Full Knowledge Graph Access</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-liberia-blue mr-2 mt-0.5" /> Business & Tourism Directories</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-liberia-blue mr-2 mt-0.5" /> Commercial License</li>
                    </ul>
                    <button 
                        onClick={() => setActiveModal('pro')}
                        className="w-full py-2 rounded-lg bg-liberia-blue text-white hover:bg-blue-800 font-medium transition-colors"
                    >
                        Get Pro Key
                    </button>
                </div>

                {/* Enterprise Tier */}
                <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col">
                     <div className="mb-4">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Enterprise</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Partner</h3>
                    <div className="text-4xl font-bold mb-6">Custom</div>
                    <ul className="space-y-3 mb-8 text-gray-600 text-sm flex-grow">
                        <li className="flex items-start"><Check className="w-4 h-4 text-purple-500 mr-2 mt-0.5" /> Unlimited requests</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-purple-500 mr-2 mt-0.5" /> Custom Data Ingestion</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-purple-500 mr-2 mt-0.5" /> Dedicated Support</li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-purple-500 mr-2 mt-0.5" /> SLA Guarantees</li>
                    </ul>
                    <button 
                        onClick={() => setActiveModal('partner')}
                        className="w-full py-2 rounded-lg border border-gray-300 hover:border-gray-800 font-medium transition-colors"
                    >
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>

        {/* 2. Advertising & Directory */}
        <div className="mb-24 grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
                 <div className="inline-block p-3 rounded-2xl bg-orange-50 mb-6">
                    <Target className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Targeted Advertising for Liberian Businesses</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Get your hotel, restaurant, or service in front of high-intent users searching specifically for Liberian tourism and business information.
                </p>
                
                <div className="space-y-4">
                    <div className="flex items-start p-4 border border-gray-100 rounded-xl bg-gray-50">
                        <div className="mr-4 bg-white p-2 rounded-full shadow-sm text-orange-600 font-bold">1</div>
                        <div>
                            <h4 className="font-bold text-gray-900">Keyword Targeting</h4>
                            <p className="text-sm text-gray-500">Show up when users search for "Best hotels in Monrovia" or "Car rental Liberia".</p>
                        </div>
                    </div>
                    <div className="flex items-start p-4 border border-gray-100 rounded-xl bg-gray-50">
                        <div className="mr-4 bg-white p-2 rounded-full shadow-sm text-orange-600 font-bold">2</div>
                        <div>
                            <h4 className="font-bold text-gray-900">Contextual Sidebar Ads</h4>
                            <p className="text-sm text-gray-500">Non-intrusive placements alongside relevant research results.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="order-1 lg:order-2 bg-gray-100 rounded-2xl p-8 border border-gray-200 relative">
                {/* Mock Ad UI */}
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-xl border border-gray-100 max-w-xs transform rotate-3">
                    <div className="text-[10px] text-gray-400 mb-1">ADVERTISEMENT</div>
                    <div className="h-24 bg-slate-200 rounded-md mb-2 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')] bg-cover"></div>
                    <div className="font-bold text-sm">Farmington Hotel</div>
                    <div className="text-xs text-gray-500">Luxury accommodation near RIA.</div>
                    <div className="mt-2 text-xs font-bold text-liberia-blue">Book Now &rarr;</div>
                </div>
                 <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-32 bg-gray-200 rounded-xl mt-4"></div>
                </div>
                <div className="mt-8 text-center text-sm text-gray-500 font-medium">
                    Preview of Search Result Page
                </div>
            </div>
        </div>

        {/* 3. Partnerships & Donations */}
        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <Globe className="w-12 h-12 text-liberia-blue mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900">Institutional Partnerships</h2>
                <p className="text-gray-600 mt-4">
                    We are proud to partner with key national institutions to ensure data accuracy and promote digital literacy.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <Briefcase className="w-10 h-10 text-blue-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Strategic Partners</h3>
                    <p className="text-gray-600 text-sm mb-6">
                        We work with the <strong>Ministry of Information, Cultural Affairs and Tourism (MICAT)</strong> and the <strong>University of Liberia</strong> to digitize archives.
                    </p>
                    <button 
                        onClick={() => setActiveModal('partner')}
                        className="mt-auto text-liberia-blue font-bold hover:underline"
                    >
                        Become a Partner
                    </button>
                 </div>

                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <Heart className="w-10 h-10 text-liberia-red mb-4" />
                    <h3 className="text-xl font-bold mb-2">Support AskLiberia</h3>
                    <p className="text-gray-600 text-sm mb-6">
                        Help us keep this knowledge engine free for Liberian students. Donate to our server fund through our NGO partners.
                    </p>
                    <button 
                        onClick={handleDonateClick}
                        className="mt-auto px-6 py-2 bg-liberia-red text-white rounded-full font-bold hover:bg-red-700 transition-colors"
                    >
                        Donate Now
                    </button>
                 </div>
            </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeDonationModal}
        >
           <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeDonationModal} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full z-10"
              >
                  <X className="w-5 h-5" />
              </button>
              
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <Heart className="w-5 h-5 text-liberia-red mr-2 fill-liberia-red" />
                      Support AskLiberia
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Your contribution keeps our servers running and knowledge free.</p>
              </div>

              <div className="p-6">
                  {/* Toggle Type */}
                  <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
                      <button 
                        onClick={() => setDonationType('local')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center ${donationType === 'local' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                          <Smartphone className="w-4 h-4 mr-2" /> Mobile Money
                      </button>
                      <button 
                        onClick={() => setDonationType('international')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center ${donationType === 'international' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                          <CreditCard className="w-4 h-4 mr-2" /> Card / PayPal
                      </button>
                  </div>

                  {/* Amount Selection */}
                  <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Amount</label>
                      <div className="grid grid-cols-4 gap-3">
                          {['5', '10', '20', '50'].map((amt) => (
                              <button
                                key={amt}
                                onClick={() => setSelectedAmount(amt)}
                                className={`py-2 rounded-lg border font-bold transition-colors ${selectedAmount === amt ? 'border-liberia-blue bg-blue-50 text-liberia-blue' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                              >
                                  ${amt}
                              </button>
                          ))}
                      </div>
                  </div>

                  {donationType === 'local' ? (
                      <div className="space-y-4">
                          <p className="text-sm text-gray-600 mb-2">Dial the code below or send to the number:</p>
                          {/* Lonestar MTN */}
                          <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-xl flex items-center justify-between relative group">
                              <div className="flex items-center">
                                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold mr-3 text-xs">MTN</div>
                                  <div>
                                      <div className="font-bold text-gray-900">Lonestar MTN</div>
                                      <div className="text-xs text-gray-600 font-mono">0886 123 456</div>
                                  </div>
                              </div>
                              <button 
                                onClick={() => handleCopy("0886123456")}
                                className="text-xs font-bold bg-white border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 flex items-center"
                              >
                                {copied === "0886123456" ? <CheckCircle className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                                {copied === "0886123456" ? "Copied" : "Copy"}
                              </button>
                          </div>
                           {/* Orange Money */}
                           <div className="p-4 border border-orange-200 bg-orange-50 rounded-xl flex items-center justify-between group">
                              <div className="flex items-center">
                                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3 text-xs">OM</div>
                                  <div>
                                      <div className="font-bold text-gray-900">Orange Money</div>
                                      <div className="text-xs text-gray-600 font-mono">0777 123 456</div>
                                  </div>
                              </div>
                              <button 
                                onClick={() => handleCopy("0777123456")}
                                className="text-xs font-bold bg-white border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 flex items-center"
                              >
                                {copied === "0777123456" ? <CheckCircle className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                                {copied === "0777123456" ? "Copied" : "Copy"}
                              </button>
                          </div>
                      </div>
                  ) : (
                       <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <input type="text" placeholder="Card number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberia-blue focus:border-liberia-blue outline-none text-sm" />
                          <div className="grid grid-cols-2 gap-4">
                              <input type="text" placeholder="MM/YY" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberia-blue outline-none text-sm" />
                              <input type="text" placeholder="CVC" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberia-blue outline-none text-sm" />
                          </div>
                          <button className="w-full py-3 bg-liberia-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-100 mt-2">
                              Pay ${selectedAmount} USD
                          </button>
                       </div>
                  )}
              </div>
              <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 flex items-center justify-center">
                  <Shield className="w-3 h-3 mr-1" /> Secured by SSL. 100% goes to maintenance.
              </div>
           </div>
        </div>
      )}

      {/* General Interaction Modal (Free/Pro/Partner) */}
      {activeModal && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleModalClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={handleModalClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                {renderModalContent()}
            </div>
        </div>
      )}
    </div>
  );
};
