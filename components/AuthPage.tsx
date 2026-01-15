
import React, { useState, useEffect, useRef } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { LogoIcon } from './LogoIcon';

// Declare google global for TypeScript
declare const google: any;

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoaded, setGoogleLoaded] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const buttonInitialized = useRef(false);
  
  // CRITICAL: The ID must end in .apps.googleusercontent.com
  const clientId = process.env.VITE_GOOGLE_CLIENT_ID || "";

  // Helper to decode the Google JWT Token
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const handleGoogleCredentialResponse = async (response: any) => {
      setIsLoading(true);
      try {
          const data = parseJwt(response.credential);
          if (data) {
              const user = await authService.loginWithProvider({
                  name: data.name,
                  email: data.email,
                  avatar: data.picture,
                  id: data.sub
              });
              onLoginSuccess(user);
          }
      } catch (err) {
          setError("Google Sign-In failed.");
          setIsLoading(false);
      }
  };

  const handleDemoGoogleLogin = async () => {
    setIsLoading(true);
    // Simulate a brief delay to look like a real login
    const user = await authService.loginWithGoogleSimulation();
    onLoginSuccess(user);
  };

  useEffect(() => {
    const initializeGoogle = () => {
        // Only initialize if we have a valid-looking client ID
        if (typeof google !== 'undefined' && clientId.includes('.apps.googleusercontent.com') && !buttonInitialized.current) {
            try {
                google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleGoogleCredentialResponse
                });
                setGoogleLoaded(true);
                buttonInitialized.current = true;
            } catch (e) {
                console.error("Google Init Error", e);
            }
        }
    };

    const timer = setInterval(() => {
        if (typeof google !== 'undefined' && clientId) {
            initializeGoogle();
            clearInterval(timer);
        }
    }, 500);

    return () => clearInterval(timer);
  }, [clientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        const result = await authService.login(email, password);
        if (result.success && result.user) onLoginSuccess(result.user);
        else setError(result.message || 'Invalid email or password.');
      } else {
        const result = await authService.signup(name, email, password);
        if (result.success && result.user) onLoginSuccess(result.user);
        else setError(result.message || 'Signup failed');
      }
    } catch (err) {
      setError('Connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      
      {/* Left Panel - Brand */}
      <div className="w-full md:w-[50%] bg-[#002868] p-12 md:p-20 flex flex-col justify-between text-white relative min-h-[400px]">
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-24">
             <LogoIcon size="md" />
             <span className="text-2xl font-serif font-bold tracking-tight">AskLiberia</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] mb-10">
            Unlock the <br/>Knowledge of <br/>Liberia.
          </h1>
          
          <p className="text-xl text-blue-100/80 max-w-md leading-relaxed mb-12 font-sans">
            Join thousands of students, researchers, and travelers accessing verified history, culture, and business data.
          </p>

          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold border border-white/20 text-xs">
               LIB
             </div>
             <span className="font-medium text-white/90 font-sans">Join the community today.</span>
          </div>
        </div>

        <div className="relative z-10 pt-12 text-sm text-white/30 font-sans">
           © 2025 AskLiberia Knowledge Engine.
        </div>
      </div>

      {/* Right Panel - Auth */}
      <div className="w-full md:w-[50%] flex items-center justify-center p-8 md:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Welcome back</h2>
                <p className="text-gray-500 font-medium">Enter your details to access your dashboard.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-6">
                <div className="space-y-3">
                    <button 
                        type="button"
                        onClick={() => {
                            if (googleLoaded) google.accounts.id.prompt();
                            else handleDemoGoogleLogin();
                        }}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm active:scale-[0.99]"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="font-semibold text-gray-700">
                           {googleLoaded ? 'Sign in with Google' : 'Sign in with Google (Demo)'}
                        </span>
                    </button>
                </div>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-100"></div>
                    <span className="flex-shrink mx-6 text-sm text-gray-400 font-medium font-sans">Or use your email</span>
                    <div className="flex-grow border-t border-gray-100"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-[#002868] focus:ring-1 focus:ring-[#002868] outline-none transition-all placeholder-gray-300 font-medium" 
                                placeholder="Your Name" 
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-4 w-5 h-5 text-gray-300" />
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#002868] focus:ring-1 focus:ring-[#002868] outline-none transition-all placeholder-gray-300 font-medium" 
                                placeholder="you@example.com" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-4 w-5 h-5 text-gray-300" />
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#002868] focus:ring-1 focus:ring-[#002868] outline-none transition-all placeholder-gray-300 font-medium" 
                                placeholder="••••••••" 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full flex items-center justify-center py-4 bg-[#002868] text-white font-bold rounded-xl hover:bg-blue-900 transition-all shadow-md active:scale-[0.98] mt-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center text-lg">{isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight className="w-5 h-5 ml-2" /></span>}
                    </button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-base text-gray-500 font-medium font-sans">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => setIsLogin(!isLogin)} className="ml-2 font-bold text-[#002868] hover:underline">
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
