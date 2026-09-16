import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Trophy, Flame, CheckCircle, Clock, Play, Code, Sparkles,
  Users, Award, ChevronRight, AlertCircle, RefreshCw, Send, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL as API } from '../config';


const RoomChallenges = ({ user, onOpenSidebar, onSelectRoom }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [codeSolution, setCodeSolution] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState(null);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/challenges`);
      if (res.data.success) {
        setChallenges(res.data.challenges);
        if (res.data.challenges.length > 0 && !activeChallenge) {
          setActiveChallenge(res.data.challenges[0]);
          setCodeSolution(res.data.challenges[0].starterCode || '');
        }
      }
    } catch (err) {
      console.error('Failed to load challenges:', err);
      toast.error('Failed to load room challenges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleSelectChallenge = (c) => {
    setActiveChallenge(c);
    setCodeSolution(c.starterCode || '');
    setEvalResult(null);
  };

  const handleSubmitSolution = async () => {
    if (!codeSolution.trim()) {
      toast.error('Please write your solution code');
      return;
    }

    try {
      setSubmitting(true);
      setEvalResult(null);

      const res = await axios.post(`${API}/api/challenges/${activeChallenge._id}/submit`, {
        userId: user?._id,
        userName: user ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Anonymous Hacker',
        userPicture: user?.picture || '',
        code: codeSolution,
      });

      if (res.data.success) {
        setEvalResult(res.data.result);
        if (res.data.result.passed) {
          toast.success(`Challenge Solved! Score: ${res.data.result.score}/100 🏆`, { icon: '🎉' });
        } else {
          toast(`Review your solution. Score: ${res.data.result.score}/100`, { icon: '⚠️' });
        }
        fetchChallenges();
      }
    } catch (err) {
      toast.error('Failed to submit challenge solution');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Header */}
      <div
        className="p-5 md:p-6 border-b flex-shrink-0 flex items-center justify-between gap-4"
        style={{
          background: 'rgba(15, 15, 26, 0.85)',
          backdropFilter: 'blur(20px)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <Trophy size={18} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Room Challenges & AI Hackathons
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                AI Judged
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Solve live timed coding challenges in topic rooms and get evaluated automatically by the AI judge.
            </p>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Left List of Challenges */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto p-4 space-y-2.5 bg-black/20 flex-shrink-0">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Active Challenges
            </span>
            <span className="text-[10px] text-purple-400 font-semibold">
              {challenges.length} Available
            </span>
          </div>

          {challenges.map((c) => {
            const isSelected = activeChallenge?._id === c._id;
            return (
              <div
                key={c._id}
                onClick={() => handleSelectChallenge(c)}
                className={`p-3.5 rounded-2xl cursor-pointer border transition-all duration-200 ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-500/10'
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/10 text-cyan-300">
                    #{c.roomId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.difficulty === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : c.difficulty === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {c.difficulty} · {c.points} pts
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                  {c.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-gray-500">
                  <span>⏱️ {c.durationMinutes} mins</span>
                  <span>🏆 {c.submissions?.length || 0} Submissions</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Editor & AI Evaluation Workspace */}
        {activeChallenge ? (
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#0a0a12]">
            {/* Header info */}
            <div className="p-4 bg-white/[0.02] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-cyan-400">
                    Channel: #{activeChallenge.roomId}
                  </span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-amber-400 font-semibold">
                    ⭐ Reward: {activeChallenge.points} XP
                  </span>
                </div>
                <h2 className="text-base font-bold text-white">
                  {activeChallenge.title}
                </h2>
                <p className="text-xs text-gray-300 max-w-2xl mt-0.5">
                  {activeChallenge.description}
                </p>
              </div>

              <button
                onClick={handleSubmitSolution}
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{ background: 'var(--gradient-brand)' }}
              >
                <Sparkles size={14} />
                {submitting ? 'AI Judging Solution...' : 'Submit to AI Judge'}
              </button>
            </div>

            {/* Split Workspace: Solution Code Editor + AI Feedback / Leaderboard */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
              {/* Code Editor */}
              <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 p-3 bg-[#0d0d17]">
                <div className="flex items-center justify-between mb-2 px-1 text-xs text-gray-400 font-semibold">
                  <span>Your Solution Code</span>
                  <span className="text-[10px] text-gray-500">JavaScript</span>
                </div>
                <textarea
                  value={codeSolution}
                  onChange={(e) => setCodeSolution(e.target.value)}
                  placeholder="// Implement your solution..."
                  spellCheck={false}
                  className="flex-1 w-full bg-transparent text-gray-200 font-mono text-xs leading-relaxed outline-none resize-none p-2 border border-white/5 rounded-xl selection:bg-purple-500/30"
                  style={{
                    fontFamily: "'Fira Code', Consolas, monospace",
                  }}
                />
              </div>

              {/* AI Feedback & Leaderboard */}
              <div className="w-full lg:w-96 flex flex-col overflow-y-auto p-4 bg-black/30 space-y-4">
                {/* AI Judge Feedback Box */}
                {evalResult && (
                  <div
                    className={`rounded-2xl p-4 border animate-fade-in ${
                      evalResult.passed
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                        : 'bg-red-950/30 border-red-500/40 text-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm flex items-center gap-1.5">
                        <Award size={16} /> AI Judge Score
                      </span>
                      <span className="text-lg font-black">{evalResult.score}/100</span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">
                      {evalResult.feedback}
                    </p>
                  </div>
                )}

                {/* Submissions Leaderboard */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <Trophy size={14} className="text-amber-400" /> Room Leaderboard
                  </h3>

                  <div className="space-y-2">
                    {activeChallenge.submissions?.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">
                        No submissions yet. Be the first to conquer this challenge!
                      </p>
                    ) : (
                      activeChallenge.submissions
                        ?.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
                        .map((sub, sIdx) => (
                          <div
                            key={sub._id || sIdx}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                  sIdx === 0
                                    ? 'bg-amber-400 text-black'
                                    : sIdx === 1
                                    ? 'bg-slate-300 text-black'
                                    : 'bg-white/10 text-gray-300'
                                }`}
                              >
                                {sIdx + 1}
                              </span>
                              <span className="font-semibold text-white truncate max-w-[120px]">
                                {sub.userName}
                              </span>
                            </div>
                            <span className="font-bold text-cyan-400">
                              {sub.aiScore} pts
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RoomChallenges;
