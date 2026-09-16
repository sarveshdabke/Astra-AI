import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, Star, GitFork, Plus, Sparkles, Filter, Copy, Check,
  ExternalLink, Tag, BookOpen, ThumbsUp, X, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL as API } from '../config';


const CATEGORIES = [
  'All',
  'Web Dev',
  'App Dev',
  'AI & ML',
  'DevOps & Cloud',
  'UI/UX',
  'Productivity',
  'General',
];

const PromptMarketplace = ({ user, onUsePrompt, onOpenSidebar }) => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('popular');
  const [copiedId, setCopiedId] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [newCategory, setNewCategory] = useState('Web Dev');
  const [newTags, setNewTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/prompts`, {
        params: {
          category: category !== 'All' ? category : undefined,
          search: search || undefined,
          sort,
        },
      });
      if (res.data.success) {
        setPrompts(res.data.prompts);
      }
    } catch (err) {
      console.error('Failed to load prompts:', err);
      toast.error('Failed to load prompts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [category, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrompts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStar = async (promptId) => {
    if (!user?._id) {
      toast.error('Please login to star prompts');
      return;
    }

    try {
      const res = await axios.post(`${API}/api/prompts/${promptId}/star`, {
        userId: user._id,
      });
      if (res.data.success) {
        setPrompts((prev) =>
          prev.map((p) => (p._id === promptId ? { ...p, stars: res.data.stars } : p))
        );
        toast.success(res.data.isStarred ? 'Prompt starred!' : 'Star removed', { duration: 1500 });
      }
    } catch (err) {
      toast.error('Failed to star prompt');
    }
  };

  const handleCopyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopiedId(prompt._id);
    toast.success('Prompt copied to clipboard!', { duration: 1500 });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUsePrompt = async (prompt) => {
    try {
      await axios.post(`${API}/api/prompts/${prompt._id}/fork`);
      setPrompts((prev) =>
        prev.map((p) => (p._id === prompt._id ? { ...p, forkCount: (p.forkCount || 0) + 1 } : p))
      );
    } catch (err) {
    }
    onUsePrompt(prompt.promptText);
    toast.success('Prompt loaded into chat!', { icon: '🚀' });
  };

  const handleCreatePrompt = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPromptText.trim()) {
      toast.error('Please enter title and prompt text');
      return;
    }

    try {
      setSubmitting(true);
      const tagsArray = newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await axios.post(`${API}/api/prompts`, {
        title: newTitle.trim(),
        description: newDescription.trim(),
        promptText: newPromptText.trim(),
        category: newCategory,
        tags: tagsArray,
        author: {
          userId: user?._id,
          name: user ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Community Dev',
          picture: user?.picture || '',
        },
      });

      if (res.data.success) {
        toast.success('Prompt published to Marketplace!', { icon: '🎉' });
        setShowCreateModal(false);
        setNewTitle('');
        setNewDescription('');
        setNewPromptText('');
        setNewTags('');
        fetchPrompts();
      }
    } catch (err) {
      toast.error('Failed to publish prompt');
    } finally {
      setSubmitting(false);
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
        <div>
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20"
              style={{ background: 'var(--gradient-brand)' }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Prompt Marketplace
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {prompts.length} Prompts
                </span>
              </h1>
              <p className="text-xs text-gray-400">
                Discover, star, remix, and execute battle-tested developer prompts.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
          style={{ background: 'var(--gradient-brand)' }}
        >
          <Plus size={15} />
          Publish Prompt
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 md:p-6 pb-2 border-b flex-shrink-0 space-y-3" style={{ borderColor: 'var(--border-subtle)' }}>
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
              placeholder="Search prompts by title, description, or tags..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setSort('popular')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sort === 'popular' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              ⭐ Most Starred
            </button>
            <button
              onClick={() => setSort('forks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sort === 'forks' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              🚀 Most Used
            </button>
            <button
              onClick={() => setSort('latest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sort === 'latest' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              ✨ Latest
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 rounded-2xl bg-white/5 border border-white/5 animate-pulse p-5"
              />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <BookOpen size={48} className="text-gray-600 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Prompts Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mb-4">
              We couldn't find any prompts matching your filter. Be the first to share one!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md"
            >
              Publish a Prompt
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompts.map((prompt) => {
              const isStarred = prompt.stars?.some((uid) => uid === user?._id || uid?._id === user?._id);
              const starCount = prompt.stars?.length || 0;

              return (
                <div
                  key={prompt._id}
                  className="rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative border"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div>
                    {/* Header: Category + Stars */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/25">
                        {prompt.category}
                      </span>

                      <button
                        onClick={() => handleStar(prompt._id)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all ${
                          isStarred
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                            : 'bg-white/5 text-gray-400 hover:text-amber-300 border border-white/5'
                        }`}
                        title={isStarred ? 'Unstar prompt' : 'Star this prompt'}
                      >
                        <Star size={12} fill={isStarred ? 'currentColor' : 'none'} />
                        <span>{starCount}</span>
                      </button>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-base font-bold text-white mb-1.5 line-clamp-1 group-hover:text-purple-300 transition-colors">
                      {prompt.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                      {prompt.description || 'No description provided.'}
                    </p>

                    {/* Prompt Preview Box */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 mb-3.5 relative overflow-hidden">
                      <p className="text-xs text-gray-300 font-mono line-clamp-3 leading-relaxed">
                        {prompt.promptText}
                      </p>
                    </div>

                    {/* Tags */}
                    {prompt.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {prompt.tags.slice(0, 3).map((tag, i) => (
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

                  {/* Footer: Author & Action Buttons */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-center gap-2 min-w-0">
                      {prompt.author?.picture ? (
                        <img
                          src={prompt.author.picture}
                          alt={prompt.author.name}
                          className="w-5 h-5 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-gray-300">
                          <User size={10} />
                        </div>
                      )}
                      <span className="text-[11px] text-gray-400 truncate max-w-[100px]">
                        {prompt.author?.name || 'Community'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyPrompt(prompt)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                        title="Copy prompt text"
                      >
                        {copiedId === prompt._id ? (
                          <Check size={13} className="text-cyan-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>

                      <button
                        onClick={() => handleUsePrompt(prompt)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-md hover:scale-105 active:scale-95"
                        style={{ background: 'var(--gradient-brand)' }}
                        title="Load into chat and execute"
                      >
                        <GitFork size={12} />
                        Use Prompt
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Prompt Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-xl rounded-3xl p-6 border shadow-2xl relative"
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
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Publish New Prompt</h2>
                  <p className="text-xs text-gray-400">Share your best prompt with the developer community</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePrompt} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Prompt Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Next.js 15 Full-Stack Boilerplate Generator"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-purple-500 transition-colors"
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
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="React, Architecture, Clean Code"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief summary of what this prompt accomplishes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Prompt Instructions / Template *
                </label>
                <textarea
                  rows={5}
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  placeholder="Act as a senior engineer... Use [placeholders] for custom variables."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm font-mono outline-none focus:border-purple-500 transition-colors resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  {submitting ? 'Publishing...' : 'Publish to Marketplace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptMarketplace;
