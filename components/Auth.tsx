import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { CURRENT_USER } from '../constants';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!isLogin && !name) {
        setError('Please enter your full name');
        setIsLoading(false);
        return;
    }
    
    if (!email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
    }

    // Mock authentication success
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: isLogin ? (name || 'Dr. Demo User') : name,
      email: email,
      role: UserRole.CHAIR, 
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(isLogin ? (name || 'Demo User') : name)}&background=6366f1&color=fff`
    };

    onLogin(user);
    setIsLoading(false);
  };

  const handleDemoLogin = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      onLogin(CURRENT_USER);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Hero/Branding (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-900/90"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
           <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 shadow-xl">
             <span className="text-4xl font-bold">C</span>
           </div>
           <h1 className="text-5xl font-bold mb-6 leading-tight">Manage Conferences with AI Precision</h1>
           <p className="text-indigo-100 text-xl leading-relaxed max-w-lg">
             Streamline paper submissions, automate reviews, and schedule sessions intelligently with ConfAI Manager.
           </p>
           
           <div className="mt-12 space-y-4">
              <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/10 rounded-lg"><CheckCircle2 size={20} /></div>
                  <span>AI-Assisted Paper Reviewing</span>
              </div>
              <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/10 rounded-lg"><CheckCircle2 size={20} /></div>
                  <span>Smart Scheduling Algorithms</span>
              </div>
              <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/10 rounded-lg"><CheckCircle2 size={20} /></div>
                  <span>Real-time Analytics Dashboard</span>
              </div>
           </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="lg:hidden flex justify-center mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <span className="text-2xl font-bold text-white">C</span>
              </div>
          </div>
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {isLogin ? 'Sign in to access your dashboard' : 'Join thousands of researchers and organizers'}
            </p>
          </div>

          <div className="mt-8">
            <div className="space-y-6">
                 {/* Social / Demo Login */}
                 <div>
                    <button
                      onClick={handleDemoLogin}
                      disabled={isLoading}
                      className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    >
                      <KeyRound className="h-5 w-5 mr-3 text-indigo-500" />
                      <span>Quick Demo Access</span>
                    </button>
                    <div className="relative mt-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-500">Or continue with email</span>
                      </div>
                    </div>
                 </div>

                 {/* Main Form */}
                 <form className="space-y-6" onSubmit={handleSubmit}>
                   {!isLogin && (
                      <div className="animate-fade-in-down">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                          Full Name
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-slate-400" />
                          </div>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required={!isLogin}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                        Email address
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-md bg-red-50 p-3">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <span className="flex items-center gap-2">
                          {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
                        </span>
                      )}
                    </button>
                 </form>
            </div>
          </div>
          
          <div className="mt-6 text-center">
             <p className="text-sm text-slate-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;