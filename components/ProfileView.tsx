
import React from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Calendar, Shield, CreditCard, Edit2, MapPin } from 'lucide-react';

interface ProfileViewProps {
  user: User;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Identity Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
                 <button className="absolute bottom-0 right-0 bg-gray-100 hover:bg-gray-200 text-gray-600 p-1.5 rounded-full border border-white shadow-sm transition-colors">
                    <Edit2 className="w-3 h-3" />
                 </button>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{user.email}</p>
              
              <div className="flex justify-center gap-2 mb-6">
                 <span className="px-3 py-1 bg-blue-50 text-liberia-blue text-xs font-bold rounded-full border border-blue-100">Member</span>
                 <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">Active</span>
              </div>

              <div className="border-t border-gray-100 pt-4 text-left space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                      <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                      <span>Liberia (Default)</span>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Stats */}
        <div className="md:col-span-2 space-y-6">
            
            {/* Account Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Account Information</h3>
                    <button className="text-sm font-bold text-liberia-blue hover:underline">Edit Details</button>
                </div>
                
                <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-700">
                                <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                                {user.name}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-700">
                                <Mail className="w-4 h-4 mr-3 text-gray-400" />
                                {user.email}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">User ID</label>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-500 font-mono text-sm">
                            <Shield className="w-4 h-4 mr-3 text-gray-400" />
                            {user.id}
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences / Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Preferences</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                         <div className="flex items-center">
                             <div className="w-10 h-10 bg-blue-100 text-liberia-blue rounded-full flex items-center justify-center mr-4">
                                 <CreditCard className="w-5 h-5" />
                             </div>
                             <div>
                                 <h4 className="font-bold text-gray-900 text-sm">Billing & API Plan</h4>
                                 <p className="text-xs text-gray-500">Free Tier (1,000 requests/mo)</p>
                             </div>
                         </div>
                         <button className="px-3 py-1 text-xs font-bold border border-gray-300 rounded hover:bg-white">Upgrade</button>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
