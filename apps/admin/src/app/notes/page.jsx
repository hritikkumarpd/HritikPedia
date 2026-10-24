'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Shield,
  Download,
  Eye,
  Loader2,
  ExternalLink,
  Sparkles,
  X
} from 'lucide-react';
import { formatINR } from '@hritikpedia/shared/payment';

export default function AdminNotesPage() {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // New Note Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subjectId: '',
    description: '',
    pageCount: 15,
    isFree: false,
    price: 99,
    previewPages: 5,
    isFeatured: false,
    status: 'published',
  });

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/notes');
      if (!res.ok) throw new Error('Failed to fetch notes catalog');
      const data = await res.json();
      setNotes(data.notes || []);
      setSubjects(data.subjects || []);
      if (data.subjects?.length > 0 && !formData.subjectId) {
        setFormData((prev) => ({ ...prev, subjectId: data.subjects[0].id }));
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save note');

      setMessage({ type: 'success', text: `Note "${formData.title}" published successfully!` });
      setShowModal(false);
      setFormData({
        title: '',
        slug: '',
        subjectId: subjects[0]?.id || '',
        description: '',
        pageCount: 15,
        isFree: false,
        price: 99,
        previewPages: 5,
        isFeatured: false,
        status: 'published',
      });
      fetchNotes();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const filteredNotes = notes.filter((n) => {
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.subject_name.toLowerCase().includes(q) ||
      n.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Educational Notes CMS</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish, curate, and configure educational notes and dynamic access policies
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Note</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            message.type === 'error'
              ? 'bg-red-950/60 border border-red-500/40 text-red-200'
              : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex items-center justify-between gap-4 bg-[#0B1D36] p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by title, slug, or subject..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium pr-2">
          {filteredNotes.length} of {notes.length} notes
        </div>
      </div>

      {/* Notes Table */}
      <div className="bg-[#0B1D36] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Note Details</th>
                <th className="px-5 py-3.5">Subject</th>
                <th className="px-5 py-3.5">Pages &amp; Preview</th>
                <th className="px-5 py-3.5">Pricing</th>
                <th className="px-5 py-3.5">Security / Policies</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                    <span>Loading notes catalog...</span>
                  </td>
                </tr>
              ) : filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-slate-500">
                    No notes match the specified query.
                  </td>
                </tr>
              ) : (
                filteredNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{note.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">/{note.slug}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-blue-300 text-[11px] font-medium border border-slate-700/80">
                        {note.subject_name}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>{note.page_count} total pages</div>
                      <div className="text-[10px] text-slate-400">
                        {note.is_free ? 'Full Access' : `${note.preview_pages} pages preview`}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {note.is_free ? (
                        <span className="text-emerald-400 font-bold">FREE</span>
                      ) : (
                        <span className="text-amber-400 font-bold">{formatINR(note.price)}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[11px]">
                          {note.watermark_enabled ? 'Watermarked' : 'Plain'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                        <Download className="w-3 h-3" />
                        <span>{note.download_allowed ? 'Download OK' : 'Viewer Only'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          note.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {note.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <a
                        href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/notes/${note.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Note Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B1D36] border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Publish New Note</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Database Indexing & B-Trees Complete Guide"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Custom Slug (Optional)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="dbms-indexing-btrees"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive notes covering B-Trees, B+ Trees, clustered vs unclustered indices..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Total Pages</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.pageCount}
                    onChange={(e) => setFormData({ ...formData, pageCount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Pricing Model</label>
                  <select
                    value={formData.isFree ? 'free' : 'paid'}
                    onChange={(e) => setFormData({ ...formData, isFree: e.target.value === 'free' })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="paid">Paid (₹)</option>
                    <option value="free">100% Free</option>
                  </select>
                </div>

                {!formData.isFree && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Note...</span>
                    </>
                  ) : (
                    <span>Publish Note</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
