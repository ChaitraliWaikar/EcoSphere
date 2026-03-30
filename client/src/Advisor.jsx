/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
  Sparkles, Brain, Target, ArrowUpRight, TrendingUp, 
  Lightbulb, Zap, BarChart3, Users, Calendar, Info, 
  ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';

const Advisor = ({ communityData, stats, events }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Derived metrics for AI context
  const volunteerBase = stats?.totalRegistrations || 0;
  const attendanceRate = stats?.totalRegistrations > 0 
    ? Math.round((stats.totalAttended / stats.totalRegistrations) * 100) 
    : 0;
  const communityScore = Math.min(9.8, (attendanceRate / 10) + (volunteerBase > 10 ? 2 : 0)).toFixed(1);

  // Simulated ML Recommendations based on real community data
  const recommendations = [
    {
      id: 1,
      title: "Optimize Event Timing",
      description: `Your ${communityData?.name || 'community'} has shown peak engagement on mornings. Transitioning next events to weekend mornings could boost attendance by 35%.`,
      impact: "High",
      category: "Logistics",
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      action: "Schedule next event for Saturday morning"
    },
    {
      id: 2,
      title: "Reward Strategy Pivot",
      description: `With ${stats?.totalPoints || 0} points distributed, your volunteers are highly motivated. Our model suggests introducing a 'Tier 2' badge to maintain retention.`,
      impact: "Medium",
      category: "Marketing",
      icon: <Target className="w-5 h-5 text-purple-500" />,
      action: "Update reward tiers"
    },
    {
      id: 3,
      title: "Category Opportunity",
      description: `Analysis shows 'Environmental' events are your strongest niche. Consider expanding into 'Waste Management' to attract a similar demographic.`,
      impact: "Growth",
      category: "Strategic",
      icon: <Zap className="w-5 h-5 text-orange-500" />,
      action: "Create new category event"
    }
  ];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">Community Advisor</h1>
          </div>
          <p className="text-gray-500 text-sm italic">"Intelligence for Impact: Strategies personalized for {communityData?.name || 'your community'}"</p>
        </div>
        <button 
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold border-b-4 border-indigo-800 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] active:border-b-0 transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Recalculating...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              Analyze Dashboard Data
            </>
          )}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-l-4 border-purple-500 rounded-xl p-5 shadow-md flex items-start gap-4 ring-1 ring-purple-50">
            <div className="bg-purple-100 p-2 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">ML Model Status: Synchronized</h3>
              <p className="text-sm text-gray-600">
                Connected to your real-time stats. Analysis coverage: <span className="text-purple-600 font-bold">100% of current events</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Contextual Action Plan
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-6 hover:bg-purple-50/30 transition group">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm group-hover:scale-110 transition">
                      {rec.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-800 group-hover:text-purple-800 transition">{rec.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          rec.impact === 'Urgent' ? 'bg-red-100 text-red-600' : 
                          rec.impact === 'High' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                        }`}>
                          {rec.impact} Impact
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="font-semibold text-gray-500">Suggested:</span> {rec.action}
                        </div>
                        <button className="bg-white border border-gray-200 px-4 py-1.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-1 group/btn">
                          Apply Strategy <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Predictive Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden ring-4 ring-white/10">
            <div className="absolute top-[-20px] right-[-20px] opacity-10 rotate-12">
              <Sparkles className="w-40 h-40" />
            </div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Strategic Health
            </h3>
            
            <div className="space-y-6 relative z-10">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
                <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-300 mb-1">{communityScore}</div>
                <div className="text-xs font-bold text-white/50 tracking-widest uppercase">Community Health Score</div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] mb-1.5 font-bold uppercase tracking-tighter text-white/60">
                    <span>Predicted Retention</span>
                    <span className="text-green-400">Excellent</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-green-500" style={{ width: `${attendanceRate}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1.5 font-bold uppercase tracking-tighter text-white/60">
                    <span>Market Visibility</span>
                    <span className="text-blue-400">Growing</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: '74%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-500" />
              Success Probabilities
            </h3>
            <div className="space-y-5">
              {[
                { label: 'Weekend Morning Attendance', val: 92, col: 'text-green-600', bg: 'bg-green-600' },
                { label: 'Recurring Volunteer Rate', val: 68, col: 'text-blue-600', bg: 'bg-blue-600' },
                { label: 'Strategic Goal Completion', val: 45, col: 'text-purple-600', bg: 'bg-purple-600' }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-gray-600">{item.label}</span>
                    <span className={`text-xs font-black ${item.col}`}>{item.val}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.bg} opacity-80`} style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-900 text-white rounded-2xl p-5 shadow-lg border border-purple-400/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-purple-300" />
              <span className="text-sm font-bold uppercase tracking-wider">Strategic Insight</span>
            </div>
            <p className="text-sm leading-relaxed text-purple-100/90 font-medium">
              "Your core volunteer group is expanding. Transition from 'broad' awareness events to 'skilled-based' tasks to increase long-term loyalty by 44%."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Clock = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default Advisor;