import React, { useState } from 'react';
import { ConferenceSession, Paper } from '../types';
import { Clock, MapPin, Sparkles, AlertTriangle, CheckCircle, Lightbulb, Loader2, X, Calendar } from 'lucide-react';
import { analyzeConferenceSchedule, ScheduleAnalysis } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScheduleProps {
  sessions: ConferenceSession[];
  papers: Paper[];
}

const Schedule: React.FC<ScheduleProps> = ({ sessions, papers }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ScheduleAnalysis | null>(null);
  const [activeDay, setActiveDay] = useState<string>('Day 1');

  const getPaperTitle = (id: string) => papers.find(p => p.id === id)?.title || 'Unknown Paper';

  const handleDeepAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeConferenceSchedule(sessions, papers);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const days = Array.from(new Set(sessions.map(s => s.day))).sort();
  const filteredSessions = sessions.filter(s => s.day === activeDay);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Conference Schedule</h2>
        <div className="flex items-center gap-3">
            <button 
              onClick={handleDeepAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {isAnalyzing ? 'Analyzing...' : 'AI Deep Analysis'}
            </button>
            
            {/* Day Switcher */}
            <div className="bg-white border border-slate-200 p-1 rounded-lg flex items-center shadow-sm">
               {days.map(day => (
                 <button
                   key={day}
                   onClick={() => setActiveDay(day)}
                   className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      activeDay === day 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                   }`}
                 >
                   {day}
                 </button>
               ))}
            </div>

            <button className="hidden sm:block px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
                Export PDF
            </button>
        </div>
      </div>

      {/* Analysis Result Panel */}
      {analysis && (
        <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden animate-fade-in-down">
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
            <h3 className="font-bold text-indigo-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={20} />
              Schedule Analysis Report
            </h3>
            <button onClick={() => setAnalysis(null)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Section */}
            <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0">
               <div className="relative w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: analysis.score }, { value: 100 - analysis.score }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                      >
                        <Cell fill={analysis.score > 75 ? '#10b981' : analysis.score > 50 ? '#f59e0b' : '#ef4444'} />
                        <Cell fill="#f1f5f9" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800">
                    <span className="text-3xl font-bold">{analysis.score}</span>
                    <span className="text-xs text-slate-500 uppercase font-medium">Health Score</span>
                  </div>
               </div>
               <p className="text-center text-sm text-slate-600 mt-4 px-4">
                 Based on thematic cohesion, track balance, and timing efficiency.
               </p>
            </div>

            {/* Insights Column */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" /> Strengths
              </h4>
              <ul className="space-y-2">
                {analysis.strengths.map((item, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <h4 className="font-semibold text-slate-800 flex items-center gap-2 mt-6">
                <AlertTriangle size={16} className="text-amber-500" /> Potential Issues
              </h4>
              <ul className="space-y-2">
                {analysis.weaknesses.map((item, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions Column */}
            <div className="bg-indigo-50/50 rounded-lg p-5">
              <h4 className="font-semibold text-indigo-900 flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-indigo-600" /> AI Recommendations
              </h4>
              <div className="space-y-3">
                 {analysis.suggestions.map((item, i) => (
                    <div key={i} className="bg-white p-3 rounded border border-indigo-100 shadow-sm text-sm text-slate-700">
                      {item}
                    </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-[100px_1fr] divide-y divide-slate-100">
            {filteredSessions.map((session) => (
              <React.Fragment key={session.id}>
                {/* Time Column */}
                <div className="p-6 text-right border-r border-slate-100">
                  <div className="text-sm font-bold text-slate-800">{session.startTime}</div>
                  <div className="text-xs text-slate-400">{session.endTime}</div>
                </div>

                {/* Content Column */}
                <div className="p-6 hover:bg-slate-50 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-indigo-700 text-lg group-hover:text-indigo-800">{session.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      <MapPin size={12} />
                      {session.room}
                    </div>
                  </div>

                  {session.paperIds.length > 0 ? (
                    <div className="space-y-2 mt-4">
                      {session.paperIds.map(pid => (
                        <div key={pid} className="flex items-start gap-3 p-3 bg-white rounded border border-slate-200 shadow-sm">
                          <div className="mt-1 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                            P
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{getPaperTitle(pid)}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Author et al.</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic mt-2">Keynote / Networking</p>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
             <Calendar size={48} className="mb-4 opacity-20" />
             <p>No sessions scheduled for {activeDay}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;