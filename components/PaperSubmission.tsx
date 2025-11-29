import React, { useState } from 'react';
import { Paper, PaperStatus } from '../types';
import { improveAbstract } from '../services/geminiService';
import { Sparkles, Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';

interface PaperSubmissionProps {
  onAddPaper: (paper: Paper) => void;
}

const PaperSubmission: React.FC<PaperSubmissionProps> = ({ onAddPaper }) => {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [authors, setAuthors] = useState('');
  const [track, setTrack] = useState('General');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleEnhance = async () => {
    if (!abstract || abstract.length < 20) return;
    setIsEnhancing(true);
    const improved = await improveAbstract(abstract);
    setAbstract(improved);
    setIsEnhancing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPaper: Paper = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      abstract,
      authors: authors.split(',').map(a => a.trim()),
      track,
      status: PaperStatus.SUBMITTED,
      submittedAt: new Date().toISOString(),
      reviews: []
    };
    onAddPaper(newPaper);
    setSuccessMsg('Paper submitted successfully!');
    setTitle('');
    setAbstract('');
    setAuthors('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800">Submit New Paper</h2>
         {successMsg && (
           <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg text-sm font-medium animate-fade-in">
             <CheckCircle size={16} />
             {successMsg}
           </div>
         )}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Paper Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g., Deep Learning in Healthcare"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Authors</label>
            <input 
              type="text" 
              required
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Comma separated names (e.g., Jane Doe, John Smith)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Track/Category</label>
            <select 
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option>General</option>
              <option>AI & Machine Learning</option>
              <option>Systems & Networks</option>
              <option>Security & Privacy</option>
              <option>Human-Computer Interaction</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">Abstract</label>
              <button
                type="button"
                onClick={handleEnhance}
                disabled={isEnhancing || abstract.length < 20}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {isEnhancing ? 'Improving...' : 'AI Improve'}
              </button>
            </div>
            <textarea 
              required
              rows={6}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              placeholder="Enter your abstract here..."
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{abstract.length} characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Paper File (PDF)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                  <Upload size={24} />
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                   <p className="text-xs text-slate-400">PDF only (max 10MB)</p>
                </div>
              </div>
              <input type="file" className="hidden" accept=".pdf" />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button type="button" className="px-6 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors">
              Save Draft
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5">
              Submit Paper
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PaperSubmission;
