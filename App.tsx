import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PaperSubmission from './components/PaperSubmission';
import ReviewDashboard from './components/ReviewDashboard';
import Schedule from './components/Schedule';
import Auth from './components/Auth';
import { Paper, User } from './types';
import { MOCK_PAPERS, MOCK_SESSIONS } from './constants';
import { Search, Bell, MessageCircle, X } from 'lucide-react';
import { chatWithAssistant } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [papers, setPapers] = useState<Paper[]>(MOCK_PAPERS);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([
      { role: 'bot', text: 'Hi! I am the ConfAI assistant. Ask me anything about the schedule, papers, or deadlines.'}
  ]);
  const [isChatTyping, setIsChatTyping] = useState(false);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  const handleAddPaper = (paper: Paper) => {
    setPapers([paper, ...papers]);
    setActiveTab('papers'); // Redirect to list
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!chatInput.trim() || !user) return;

      const userMsg = chatInput;
      setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
      setChatInput('');
      setIsChatTyping(true);

      const context = `
        Current User: ${user.name} (${user.role}).
        Total Papers: ${papers.length}.
        Upcoming Sessions: ${MOCK_SESSIONS.map(s => s.title).join(', ')}.
      `;
      
      const response = await chatWithAssistant(userMsg, context);
      
      setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
      setIsChatTyping(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard papers={papers} />;
      case 'papers':
        return (
          <div className="space-y-6">
             {/* Simple Paper List View for "My Papers" */}
             <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-800">My Papers</h2>
                 <button 
                   onClick={() => setActiveTab('submit')}
                   className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
                 >
                     New Submission
                 </button>
             </div>
             <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                 {papers.map((p, i) => (
                     <div key={p.id} className={`p-4 flex justify-between items-center ${i !== papers.length -1 ? 'border-b border-slate-100' : ''}`}>
                         <div>
                             <h3 className="font-semibold text-slate-800">{p.title}</h3>
                             <p className="text-sm text-slate-500">{p.track}</p>
                         </div>
                         <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                             {p.status}
                         </span>
                     </div>
                 ))}
             </div>
          </div>
        );
      case 'submit':
        return <PaperSubmission onAddPaper={handleAddPaper} />;
      case 'reviews':
        return <ReviewDashboard papers={papers} />;
      case 'schedule':
        return <Schedule sessions={MOCK_SESSIONS} papers={papers} />;
      case 'users':
        return <div className="text-center py-20 text-slate-500">Directory feature coming soon...</div>;
      case 'settings':
         return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Account Settings</h2>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <img src={user?.avatar} alt="Profile" className="w-20 h-20 rounded-full border-2 border-slate-100" />
                        <div>
                            <h3 className="text-lg font-medium text-slate-900">{user?.name}</h3>
                            <p className="text-slate-500">{user?.email}</p>
                            <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-slate-100">
                         <h4 className="text-sm font-medium text-slate-900 mb-4">Notification Preferences</h4>
                         <div className="space-y-2">
                             <label className="flex items-center gap-3 text-slate-600">
                                 <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                                 Email notifications for reviews
                             </label>
                             <label className="flex items-center gap-3 text-slate-600">
                                 <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                                 Conference announcements
                             </label>
                         </div>
                    </div>
                    <div className="pt-6">
                        <button onClick={handleLogout} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
         );
      default:
        return <div className="text-center py-20 text-slate-500">Feature coming soon...</div>;
    }
  };

  // If user is not logged in, show Auth screen
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activeTab={activeTab === 'submit' ? 'papers' : activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4 lg:hidden">
            <div className="w-8" /> {/* Spacer for menu button */}
          </div>
          
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search papers, authors, or sessions..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('settings')}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
              </div>
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>

        {/* Floating AI Chat Widget */}
        <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end transition-all ${showChat ? 'w-80 sm:w-96' : 'w-auto'}`}>
            {showChat && (
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full mb-4 overflow-hidden animate-fade-in-up flex flex-col h-[400px]">
                    <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2 font-semibold">
                            <MessageCircle size={18} />
                            ConfAI Assistant
                        </div>
                        <button onClick={() => setShowChat(false)} className="hover:bg-indigo-500 p-1 rounded">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isChatTyping && (
                             <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                             </div>
                        )}
                    </div>
                    <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                        <input 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Type a message..."
                        />
                        <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                             <MessageCircle size={18} />
                        </button>
                    </form>
                </div>
            )}
            
            {!showChat && (
                <button 
                    onClick={() => setShowChat(true)}
                    className="group flex items-center gap-2 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-105"
                >
                    <MessageCircle size={24} />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-medium whitespace-nowrap">
                        Ask AI Assistant
                    </span>
                </button>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;