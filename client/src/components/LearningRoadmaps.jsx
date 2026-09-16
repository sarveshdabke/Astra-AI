import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Compass, Sparkles, CheckCircle2, Clock, ArrowRight, BookOpen,
  TrendingUp, Award, Layers, RefreshCw, Trash2, Plus, X, Globe, Hash
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL as API } from '../config';


const LearningRoadmaps = ({ user, onOpenSidebar, onSelectRoom }) => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRoadmap, setActiveRoadmap] = useState(null);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [goal, setGoal] = useState('');
  const [currentLevel, setCurrentLevel] = useState('Intermediate');
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer');
  const [generating, setGenerating] = useState(false);

  const fetchRoadmaps = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/roadmaps/${user._id}`);
      if (res.data.success) {
        setRoadmaps(res.data.roadmaps);
        if (res.data.roadmaps.length > 0 && !activeRoadmap) {
          setActiveRoadmap(res.data.roadmaps[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch roadmaps:', err);
      toast.error('Failed to fetch roadmaps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, [user]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!goal.trim()) {
      toast.error('Please enter your learning goal');
      return;
    }

    try {
      setGenerating(true);
      const res = await axios.post(`${API}/api/roadmaps/generate`, {
        userId: user._id,
        goal: goal.trim(),
        currentLevel,
        targetRole,
      });

      if (res.data.success) {
        toast.success('AI Learning Roadmap generated!', { icon: '🗺️' });
        setRoadmaps((prev) => [res.data.roadmap, ...prev]);
        setActiveRoadmap(res.data.roadmap);
        setShowGenerateModal(false);
        setGoal('');
      }
    } catch (err) {
      toast.error('Failed to generate roadmap');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleMilestone = async (roadmapId, milestoneId, currentStatus) => {
    const nextStatus =
      currentStatus === 'completed'
        ? 'in-progress'
        : currentStatus === 'in-progress'
        ? 'completed'
        : 'in-progress';

    try {
      const res = await axios.patch(
        `${API}/api/roadmaps/${roadmapId}/milestone/${milestoneId}`,
        { status: nextStatus }
      );
      if (res.data.success) {
        setActiveRoadmap(res.data.roadmap);
        setRoadmaps((prev) =>
          prev.map((r) => (r._id === roadmapId ? res.data.roadmap : r))
        );
        if (nextStatus === 'completed') {
          toast.success('Milestone completed! 🎉');
        }
      }
    } catch (err) {
      toast.error('Failed to update milestone');
    }
  };

  const handleDeleteRoadmap = async (roadmapId) => {
    try {
      const res = await axios.delete(`${API}/api/roadmaps/${roadmapId}`);
      if (res.data.success) {
        setRoadmaps((prev) => prev.filter((r) => r._id !== roadmapId));
        if (activeRoadmap?._id === roadmapId) {
          const remaining = roadmaps.filter((r) => r._id !== roadmapId);
          setActiveRoadmap(remaining[0] || null);
        }
        toast.success('Roadmap deleted');
      }
    } catch (err) {
      toast.error('Failed to delete roadmap');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Header */}
      <div
        className="p-5 md:p-6 border-b flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
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
            <Compass size={18} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              AI Personalized Learning Roadmaps
            </h1>
            <p className="text-xs text-gray-400">
              Custom step-by-step masteries generated dynamically from your chats & skill goals.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
          style={{ background: 'var(--gradient-brand)' }}
        >
          <Sparkles size={14} />
          Generate New Roadmap
        </button>
      </div>

      {/* Main Roadmap Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {loading ? (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="h-32 rounded-2xl bg-white/5 animate-pulse" />
            <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
          </div>
        ) : roadmaps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Compass size={54} className="text-purple-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Active Learning Roadmap</h3>
            <p className="text-xs text-gray-400 max-w-sm mb-5">
              Let Astra analyze your chat history and goals to design a customized engineering roadmap with milestone tracking.
            </p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg hover:scale-105 transition-all"
              style={{ background: 'var(--gradient-brand)' }}
            >
              <Sparkles size={14} className="inline mr-1.5" />
              Build My Custom Roadmap
            </button>
          </div>
        ) : activeRoadmap ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Roadmap Switcher Tabs */}
            {roadmaps.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {roadmaps.map((r) => (
                  <button
                    key={r._id}
                    onClick={() => setActiveRoadmap(r)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activeRoadmap._id === r._id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {r.goal}
                  </button>
                ))}
              </div>
            )}

            {/* Target Card Banner */}
            <div
              className="rounded-3xl p-6 border relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.15) 100%)',
                borderColor: 'var(--border-strong)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Level: {activeRoadmap.currentLevel}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Target: {activeRoadmap.targetRole}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white">
                    {activeRoadmap.goal}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-2xl font-black text-cyan-400">
                      {activeRoadmap.progressPercent}%
                    </span>
                    <span className="block text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
                      Completed
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteRoadmap(activeRoadmap._id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete this roadmap"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden border border-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${activeRoadmap.progressPercent}%`,
                    background: 'var(--gradient-brand)',
                  }}
                />
              </div>
            </div>

            {/* Milestones Vertical Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Layers size={14} /> Learning Milestones & Projects
              </h3>

              <div className="space-y-3">
                {activeRoadmap.milestones?.map((milestone, idx) => {
                  const isDone = milestone.status === 'completed';
                  const isInProgress = milestone.status === 'in-progress';

                  return (
                    <div
                      key={milestone.id || idx}
                      className={`rounded-2xl p-5 border transition-all duration-200 ${
                        isDone
                          ? 'bg-emerald-950/15 border-emerald-500/30'
                          : isInProgress
                          ? 'bg-purple-950/20 border-purple-500/40 shadow-lg shadow-purple-500/5'
                          : 'bg-white/[0.02] border-white/5'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Status Checkbox / Number */}
                        <button
                          onClick={() =>
                            handleToggleMilestone(
                              activeRoadmap._id,
                              milestone.id,
                              milestone.status
                            )
                          }
                          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110 active:scale-95 ${
                            isDone
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : isInProgress
                              ? 'bg-purple-600 text-white animate-pulse'
                              : 'bg-white/10 text-gray-400'
                          }`}
                          title="Click to toggle milestone completion"
                        >
                          {isDone ? <CheckCircle2 size={18} /> : <span>{idx + 1}</span>}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4
                              className={`text-base font-bold ${
                                isDone
                                  ? 'line-through text-gray-400'
                                  : 'text-white'
                              }`}
                            >
                              {milestone.title}
                            </h4>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isDone
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : isInProgress
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'bg-white/5 text-gray-500'
                              }`}
                            >
                              {isDone ? 'COMPLETED' : isInProgress ? 'IN PROGRESS' : 'PENDING'}
                            </span>
                          </div>

                          <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                            {milestone.description}
                          </p>

                          {/* Skills pill tags */}
                          {milestone.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {milestone.skills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-cyan-300 border border-cyan-500/20"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action links / room suggestion & project idea */}
                          <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            {milestone.projectIdea && (
                              <div className="text-gray-400 flex items-center gap-1.5">
                                <Award size={13} className="text-amber-400 flex-shrink-0" />
                                <span className="truncate">
                                  <strong>Project:</strong> {milestone.projectIdea}
                                </span>
                              </div>
                            )}

                            {milestone.recommendedRoomId && onSelectRoom && (
                              <button
                                onClick={() => onSelectRoom(milestone.recommendedRoomId)}
                                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold self-start sm:self-auto"
                              >
                                <Hash size={12} />
                                Join #{milestone.recommendedRoomId} room
                                <ArrowRight size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl relative"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-strong)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  <Compass size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Generate Learning Roadmap</h2>
                  <p className="text-xs text-gray-400">AI crafts a customized milestone path for your career goals</p>
                </div>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  What is your primary learning goal? *
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Master Production Full-Stack Next.js 15 & System Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Current Skill Level
                  </label>
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="Beginner" className="bg-slate-900 text-white">Beginner</option>
                    <option value="Intermediate" className="bg-slate-900 text-white">Intermediate</option>
                    <option value="Advanced" className="bg-slate-900 text-white">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Target Engineering Role
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Senior AI Full-Stack Engineer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  <Sparkles size={14} />
                  {generating ? 'AI Crafting Roadmap...' : 'Generate Roadmap'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningRoadmaps;
