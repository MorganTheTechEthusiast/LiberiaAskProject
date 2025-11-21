
import React, { useState, useEffect, useRef } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, Star, AlertCircle } from 'lucide-react';

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
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Ref to track if we've already initialized the button to prevent double renders
  const buttonInitialized = useRef(false);

  // JWT Decoder for Google Credentials
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT Parse Error", e);
      return null;
    }
  };

  const handleGoogleCredentialResponse = async (response: any) => {
      setIsLoading(true);
      setError('');
      try {
          const data = parseJwt(response.credential);
          if (data) {
              console.log("Google Auth Data:", data); // Debug log
              const user = await authService.loginWithProvider({
                  name: data.name,
                  email: data.email,
                  avatar: data.picture, // Capture Google Profile Picture
                  id: data.sub
              });
              onLoginSuccess(user);
          } else {
              setError("Failed to verify Google account details.");
              setIsLoading(false);
          }
      } catch (err) {
          console.error(err);
          setError("Google authentication failed. Please try again.");
          setIsLoading(false);
      }
  };

  useEffect(() => {
    // Check if Google script is loaded
    let intervalId: any;
    let timeoutId: any;

    const initializeGoogle = () => {
        if (typeof google !== 'undefined' && !buttonInitialized.current) {
            setGoogleLoaded(true);
            
            try {
                // Get Client ID from env
                const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;

                if (clientId) {
                    google.accounts.id.initialize({
                        client_id: clientId,
                        callback: handleGoogleCredentialResponse
                    });
                    
                    const btnDiv = document.getElementById("googleSignInDiv");
                    if (btnDiv) {
                        google.accounts.id.renderButton(
                            btnDiv,
                            { theme: "outline", size: "large", width: "100%", text: isLogin ? "signin_with" : "signup_with" }
                        );
                        buttonInitialized.current = true;
                    }
                } else {
                    console.warn("VITE_GOOGLE_CLIENT_ID missing. Running in Demo/Simulation mode.");
                    setGoogleLoaded(false); // Falls back to demo button
                }
            } catch (e) {
                console.error("Google Auth Initialization Error:", e);
                setGoogleLoaded(false);
            }
        }
    };

    // Attempt to initialize
    initializeGoogle();

    // If not loaded yet, poll for it
    if (typeof google === 'undefined') {
        intervalId = setInterval(() => {
            if (typeof google !== 'undefined') {
                clearInterval(intervalId);
                initializeGoogle();
            }
        }, 200);

        // Stop polling after 5 seconds to avoid infinite loops if network fails
        timeoutId = setTimeout(() => {
            clearInterval(intervalId);
        }, 5000);
    }

    return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
    };
  }, [isLogin]); // Re-run if isLogin changes to update button text (signin/signup)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await authService.login(email, password);
        if (result.success && result.user) {
          onLoginSuccess(result.user);
        } else {
          setError(result.message || 'Login failed');
        }
      } else {
        if (!name) {
           setError("Please enter your full name");
           setIsLoading(false);
           return;
        }
        const result = await authService.signup(name, email, password);
        if (result.success && result.user) {
          onLoginSuccess(result.user);
        } else {
          setError(result.message || 'Signup failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback for Dev Mode without Client ID
  const handleSimulatedGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
        const user = await authService.loginWithGoogleSimulation();
        onLoginSuccess(user);
    } catch (err) {
        setError("Google simulation failed");
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-liberia-blue text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1547983539-f90147f7d52a?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="relative z-10">
           <div className="flex items-center space-x-2">
             <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Star className="w-6 h-6 text-liberia-gold fill-liberia-gold" />
             </div>
             <span className="text-2xl font-serif font-bold">AskLiberia</span>
           </div>
        </div>
        
        <div className="relative z-10 max-w-lg">
           <h1 className="text-5xl font-serif font-bold mb-6">Unlock the Knowledge of Liberia.</h1>
           <p className="text-blue-100 text-lg leading-relaxed">
             Join thousands of students, researchers, and travelers accessing verified history, culture, and business data.
           </p>
           <div className="mt-8 flex space-x-4">
              <div className="flex -space-x-4">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-liberia-blue bg-gray-300"></div>
                 ))}
              </div>
              <p className="flex items-center text-sm font-medium">
                 Join the community today.
              </p>
           </div>
        </div>

        <div className="relative z-10 text-xs text-blue-200">
           &copy; {new Date().getFullYear()} AskLiberia Knowledge Engine.
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="mt-2 text-gray-600">
                    {isLogin ? 'Enter your details to access your dashboard.' : 'Start your journey with AskLiberia today.'}
                </p>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start animate-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Google Button Section */}
            <div className="min-h-[50px] flex flex-col items-center justify-center relative">
                 {/* This div is where Google renders the button */}
                 <div id="googleSignInDiv" className={googleLoaded ? 'w-full h-[44px]' : 'hidden'}></div>
                 
                 {/* Fallback Button if Key is missing or Script fails */}
                 {!googleLoaded && (
                    <button 
                        type="button"
                        onClick={handleSimulatedGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors relative group"
                    >
                         <div className="absolute left-4">
                             <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.17c-.22-.66-.35-1.36-.35-2.17s.13-1.51.35-2.17V7.96H2.18C.79 10.73 0 13.83 0 17c0 3.17.79 6.27 2.18 9.04l3.66-2.87z" fill="#FBBC05" />
                                <path d="M12 4.81c1.61 0 3.09.55 4.26 1.67l3.18-3.18C17.46 1.47 14.97 0 12 0 7.7 0 3.99 2.47 2.18 5.96l3.66 2.87c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                         </div>
                        {isLoading ? 'Authenticating...' : isLogin ? 'Sign in with Google (Demo)' : 'Sign up with Google (Demo)'}
                    </button>
                 )}
                 {!googleLoaded && !isLoading && (
                     <div className="text-[10px] text-gray-400 mt-2">
                         (Note: Add VITE_GOOGLE_CLIENT_ID to env to enable real Google Auth)
                     </div>
                 )}
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">Or continue with email</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-liberia-blue focus:border-liberia-blue outline-none"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-liberia-blue focus:border-liberia-blue outline-none"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-liberia-blue focus:border-liberia-blue outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-3 bg-liberia-blue text-white font-bold rounded-xl hover:bg-blue-900 transition-colors disabled:opacity-70"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                           {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </button>
            </form>

            <div className="text-center text-sm">
                <span className="text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button 
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                    }}
                    className="font-bold text-liberia-blue hover:underline"
                >
                    {isLogin ? 'Sign up for free' : 'Log in'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
