import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Brain, Sparkles, Trash2, Plus, RefreshCw, Tag, Check,
  ShieldCheck, Zap, Info, Search, X, Layers, Lightbulb, Menu
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL as API } from '../config';


const CATEGORIES = [
  'All',
  'Tech Stack',
  'Coding Style',
  'Preference',
  'Project Fact',
];

const MemoryCards = ({ user, onOpenSidebar }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [showAddModal, setShowAddModal] = useState(false);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tech Stack');
  const [confidence, setConfidence] = useState('High');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  const [showExtractModal, setShowExtractModal] = useState(false);
  const [extractText, setExtractText] = useState('');
  const [extracting, setExtracting] = useState(false);

  const fetchMemoryCards = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/memory/${user._id}`);
      if (res.data.success) {
        setCards(res.data.cards);
      }
    } catch (err) {
      console.error('Failed to load memory cards:', err);
      toast.error('Failed to load memory cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemoryCards();
  }, [user]);

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !content.trim()) {
      toast.error('Please enter topic and content');
      return;
    }

    try {
      setSaving(true);
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await axios.post(`${API}/api/memory`, {
        userId: user._id,
        topic: topic.trim(),
        content: content.trim(),
        category,
        confidence,
        tags: tagsArray,
      });

      if (res.data.success) {
        setCards((prev) => [res.data.card, ...prev]);
        toast.success('Memory Card added! Astra will recall this in chats.', { icon: '🧠' });
        setShowAddModal(false);
        setTopic('');
        setContent('');
        setTags('');
      }
    } catch (err) {
      toast.error('Failed to save memory card');
    } finally {
      setSaving(false);
    }
  };

  const handleExtractFromText = async (e) => {
    e.preventDefault();
    if (!extractText.trim()) {
      toast.error('Please paste conversation or notes text');
      return;
    }

    try {
      setExtracting(true);
      const res = await axios.post(`${API}/api/memory/extract`, {
        userId: user._id,
        text: extractText.trim(),
      });

      if (res.data.success) {
        if (res.data.count > 0) {
          toast.success(`Extracted ${res.data.count} memory cards!`, { icon: '✨' });
          fetchMemoryCards();
          setShowExtractModal(false);
          setExtractText('');
        } else {
          toast('No specific user facts found to extract', { icon: 'ℹ️' });
        }
      }
    } catch (err) {
      toast.error('Failed to extract memories');
    } finally {
      setExtracting(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const res = await axios.delete(`${API}/api/memory/${cardId}`);
      if (res.data.success) {
        setCards((prev) => prev.filter((c) => c._id !== cardId));
        toast.success('Memory deleted', { duration: 1500 });
      }
    } catch (err) {
      toast.error('Failed to delete memory card');
    }
  };

  const filteredCards = cards.filter((c) => {
    const matchCat = categoryFilter === 'All' || c.category === categoryFilter;
    const matchSearch =
      !search ||
      c.topic.toLowerCase().includes(search.toLowerCase()) ||
      c.content.toLowerCase().includes(search.toLowerCase()) ||
      c.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Header */}
      <div
        className="p-3 sm:p-5 md:p-6 border-b flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
        style={{
          background: 'rgba(15, 15, 26, 0.85)',
          backdropFilter: 'blur(20px)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="md:hidden p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-white flex-shrink-0"
              title="Open Navigation"
            >
              <Menu size={20} />
            </button>
          )}
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20 flex-shrink-0"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <Brain size={18} />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-white flex items-center gap-2 truncate">
              AI Memory Cards
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {cards.length}
              </span>
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              Astra AI references these memory cards automatically to personalize all answers & code.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowExtractModal(true)}
            className="flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-all duration-200"
            title="Auto extract from past conversations"
          >
            <Sparkles size={14} />
            <span>AI Auto-Extract</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <Plus size={15} />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Info Callout Banner */}
      <div className="px-4 md:px-6 pt-4">
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-cyan-950/30 border border-purple-500/20 flex items-start gap-3">
          <Lightbulb size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-300 leading-relaxed">
            <span className="font-semibold text-white">How Contextual Memory works:</span> Every time you ask a question in Direct AI Chat, Astra automatically pulls the most relevant cards below into its prompt context so you never have to repeat your stack or preferences!
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 md:p-6 pb-2 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div
            className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-default)',
            }}
          >
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search memories by topic, content, or tag..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/5 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-2">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-white/5 border border-white/5 animate-pulse p-5" />
            ))}
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Brain size={48} className="text-gray-600 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Memory Cards Yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mb-4">
              Add your tech stack, project preferences, or coding guidelines so Astra remembers them forever.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md"
            >
              Add First Memory Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => (
              <div
                key={card._id}
                className="rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative border"
                style={{
                  background: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div>
                  {/* Top Bar: Category & Confidence Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                      {card.category || 'General'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          card.confidence === 'High'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                        }`}
                      >
                        {card.confidence || 'High'} Recall
                      </span>

                      <button
                        onClick={() => handleDeleteCard(card._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete memory card"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Topic Title */}
                  <h3 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {card.topic}
                  </h3>

                  {/* Content */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 mb-3">
                    <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {card.content}
                    </p>
                  </div>

                  {/* Tags */}
                  {card.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {card.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-400 flex items-center gap-1"
                        >
                          <Tag size={9} /> #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Source info */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 mt-auto">
                  <span>Source: {card.source || 'Manual Save'}</span>
                  <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Memory Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl relative"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-strong)',
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  <Brain size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Add Knowledge Memory</h2>
                  <p className="text-xs text-gray-400">Teach Astra a fact or preference about you</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Primary Tech Stack, Coding Conventions, Cloud Setup"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition-colors"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c} className="bg-slate-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Confidence Level
                  </label>
                  <select
                    value={confidence}
                    onChange={(e) => setConfidence(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="High" className="bg-slate-900 text-white">High (Always Prioritize)</option>
                    <option value="Medium" className="bg-slate-900 text-white">Medium (Use when relevant)</option>
                    <option value="Low" className="bg-slate-900 text-white">Low (Optional context)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Fact / Preference Content *
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g. I always build with Node.js, Vite React, and Tailwind CSS. Prefer async/await over raw promises and keep components modular."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition-colors resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="React, Backend, Style"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  {saving ? 'Saving...' : 'Save to Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Auto-Extract Modal */}
      {showExtractModal && (
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
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">AI Auto-Extract Memories</h2>
                  <p className="text-xs text-gray-400">Paste text and AI will extract key facts automatically</p>
                </div>
              </div>
              <button
                onClick={() => setShowExtractModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleExtractFromText} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Paste Conversation / Bio / Tech Requirements
                </label>
                <textarea
                  rows={6}
                  value={extractText}
                  onChange={(e) => setExtractText(e.target.value)}
                  placeholder="e.g. I am a full-stack engineer working on a real-time analytics dashboard with MongoDB Atlas and Express. I prefer dark mode Tailwind styles and strict TypeScript types..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-purple-500 transition-colors resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExtractModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={extracting}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  <Sparkles size={14} />
                  {extracting ? 'Analyzing with AI...' : 'Extract & Save Cards'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryCards;
