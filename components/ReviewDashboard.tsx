import React, { useState } from 'react';
import { Paper, PaperStatus } from '../types';
import { generateReviewDraft } from '../services/geminiService';
import { BookOpen, Star, MessageSquare, Bot, Check, AlertCircle } from 'lucide-react';

interface ReviewDashboardProps {
  papers: Paper[];
}

const ReviewDashboard: React.FC<ReviewDashboardProps> = ({ papers }) => {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [aiDraft, setAiDraft] = useState<{ comments: string; pros: string[]; cons: string[] } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAiAssist = async () => {
    if (!selectedPaper) return;
    setLoadingAi(true);
    const draft = await generateReviewDraft(selectedPaper.title, selectedPaper.abstract);
    setAiDraft(draft);
    setReviewText(draft.comments);
    setLoadingAi(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Paper List */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Assigned for Review</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {papers.map((paper) => (
            <div 
              key={paper.id}
              onClick={() => { setSelectedPaper(paper); setAiDraft(null); setReviewText(''); }}
              className={`p-4 rounded-lg cursor-pointer transition-all border ${
                selectedPaper?.id === paper.id 
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                  : 'hover:bg-slate-50 border-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  paper.status === PaperStatus.ACCEPTED ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {paper.status}
                </span>
                <span className="text-xs text-slate-400">{paper.submittedAt.split('T')[0]}</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-1">{paper.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{paper.abstract}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Review Area */}
      <div className="w-2/3 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {selectedPaper ? (
          <>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedPaper.title}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <span className="bg-slate-100 px-2 py-1 rounded">{selectedPaper.track}</span>
                  <span>•</span>
                  <span>{selectedPaper.authors.join(', ')}</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Abstract</h4>
                  <p className="text-slate-700 leading-relaxed">{selectedPaper.abstract}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquare size={20} />
                    Your Review
                  </h3>
                  <button 
                    onClick={handleAiAssist}
                    disabled={loadingAi}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loadingAi ? <Bot className="animate-bounce" size={16} /> : <Bot size={16} />}
                    AI Assistant
                  </button>
                </div>

                {aiDraft && (
                  <div className="mb-6 grid grid-cols-2 gap-4 animate-fade-in">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <h5 className="flex items-center gap-2 text-sm font-semibold text-green-800 mb-2">
                        <Check size={14} /> Potential Strengths
                      </h5>
                      <ul className="text-xs text-green-700 space-y-1 list-disc pl-4">
                        {aiDraft.pros.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                      <h5 className="flex items-center gap-2 text-sm font-semibold text-red-800 mb-2">
                         <AlertCircle size={14} /> Questions / Weaknesses
                      </h5>
                      <ul className="text-xs text-red-700 space-y-1 list-disc pl-4">
                        {aiDraft.cons.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Score (1-10)</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                        <button key={score} className="w-8 h-8 rounded border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-sm font-medium text-slate-600">
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Comments</label>
                    <textarea 
                      className="w-full h-40 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-700"
                      placeholder="Write your review here..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button className="px-4 py-2 text-slate-600 font-medium hover:text-slate-800">Cancel</button>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Submit Review</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <BookOpen size={48} className="mb-4 opacity-20" />
            <p>Select a paper to begin reviewing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDashboard;
