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
  X,
  Landmark,
  School,
  Cpu,
  GraduationCap,
  Languages,
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
    price: 49,
    previewPages: 5,
    isFeatured: false,
    status: 'published',
    domain: 'general_competitions',
    targetExamOrBoard: 'UPSC',
    medium: 'english',
    department: 'Civil Services',
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
        price: 49,
        previewPages: 5,
        isFeatured: false,
        status: 'published',
        domain: 'general_competitions',
        targetExamOrBoard: 'UPSC',
        medium: 'english',
        department: 'Civil Services',
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
      (n.subject_name && n.subject_name.toLowerCase().includes(q)) ||
      (n.slug && n.slug.toLowerCase().includes(q)) ||
      (n.target_exam_or_board && n.target_exam_or_board.toLowerCase().includes(q)) ||
      (n.domain && n.domain.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="admin-eyebrow">Catalogue</p>
          <h2 className="mt-1.5 font-display text-[1.7rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[2rem]">
            Every note, in one catalogue.
          </h2>
          <p className="mt-1.5 max-w-2xl text-xs font-medium leading-relaxed text-ink-soft">
            Publish, curate and configure study notes for government exams, school boards and
            engineering courses.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="admin-btn admin-btn-primary self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Publish new note</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div
          role={message.type === 'error' ? 'alert' : 'status'}
          className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-[11px] font-semibold ${
            message.type === 'error'
              ? 'border-brick/25 bg-brick-soft text-brick'
              : 'border-mint/25 bg-mint-soft text-mint'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-current opacity-70 hover:opacity-100" aria-label="Dismiss message">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-line bg-cream p-3 shadow-[0_1px_0_#e4dac9] sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, exam (UPSC, BSEB, AKTU), slug or subject…"
            className="admin-input pl-9"
          />
        </div>
        <div className="shrink-0 pr-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
          {filteredNotes.length} of {notes.length} notes
        </div>
      </div>

      {/* Notes Table */}
      <div className="overflow-hidden rounded-xl border border-line bg-cream shadow-[0_1px_0_#e4dac9]">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Note details</th>
                <th>Domain &amp; exam</th>
                <th>Subject</th>
                <th>Pages &amp; preview</th>
                <th>Pricing</th>
                <th>Security</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-muted">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-royal" />
                    <span>Loading notes catalogue…</span>
                  </td>
                </tr>
              ) : filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-10 text-center text-muted">
                    No notes match the specified query.
                  </td>
                </tr>
              ) : (
                filteredNotes.map((note) => (
                  <tr key={note.id}>
                    <td className="max-w-xs">
                      <div className="line-clamp-1 font-bold text-ink">{note.title}</div>
                      <div className="mt-0.5 font-mono text-[10px] font-medium text-muted">/{note.slug}</div>
                      {note.medium && (
                        <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.06em] ${
                          note.medium === 'hindi'
                            ? 'bg-sun-soft text-sun-dark'
                            : 'bg-royal-soft text-royal'
                        }`}>
                          {note.medium === 'hindi' ? 'हिंदी माध्यम' : note.medium === 'english' ? 'English' : 'Bilingual'}
                        </span>
                      )}
                    </td>
                    <td>
                      {note.target_exam_or_board && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-sun-dark">
                          🎯 {note.target_exam_or_board}
                        </div>
                      )}
                      <div className="mt-0.5 text-[10px] font-medium capitalize text-muted">
                        {note.domain?.replace('_', ' ') || 'General'}
                      </div>
                    </td>
                    <td>
                      <span className="inline-block rounded-md border border-line-strong bg-paper-2 px-2 py-0.5 text-[10px] font-bold text-royal">
                        {note.subject_name}
                      </span>
                    </td>
                    <td>
                      <div className="text-[11px] font-semibold text-ink-soft">{note.page_count} total pages</div>
                      <div className="mt-0.5 text-[10px] font-medium text-muted">
                        {note.is_free ? 'Full access' : `${note.preview_pages} pages preview`}
                      </div>
                    </td>
                    <td>
                      {note.is_free ? (
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-mint">Free · ₹0</span>
                      ) : (
                        <span className="text-[11px] font-extrabold text-sun-dark">{formatINR(note.price)}</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft">
                        <Shield className="h-3.5 w-3.5 text-royal" />
                        <span>{note.watermark_enabled ? 'Watermarked' : 'Plain'}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-muted">
                        <Download className="h-3 w-3" />
                        <span>{note.download_allowed ? 'Download allowed' : 'Viewer only'}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.08em] ${
                          note.status === 'published'
                            ? 'border-mint/25 bg-mint-soft text-mint'
                            : 'border-sun-dark/25 bg-sun-soft text-sun-dark'
                        }`}
                      >
                        {note.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <a
                        href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/notes/${note.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-secondary px-2.5 py-1"
                        title={`View ${note.title} on the public site`}
                      >
                        <Eye className="h-3.5 w-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-xl rounded-2xl border border-line bg-cream p-5 shadow-[0_40px_80px_-40px_rgba(18,32,58,0.6)] sm:p-6">
            <div className="flex items-start justify-between gap-3 border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-soft text-royal">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <p className="admin-eyebrow">New catalogue entry</p>
                  <h3 className="mt-0.5 font-display text-lg font-extrabold tracking-tight text-ink">
                    Publish a new note
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-paper-2 hover:text-ink"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="mt-5 space-y-4">
              <div>
                <label className="admin-label">Note Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. BPSC 70th Bihar Special History Notes (हिंदी माध्यम)"
                  className="admin-input"
                />
              </div>

              {/* Domain & Target Exam */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Educational Domain</label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="admin-input"
                  >
                    <option value="general_competitions">Govt. Exams (UPSC / BPSC / SSC)</option>
                    <option value="school_boards">10th &amp; 12th Boards (CBSE / BSEB)</option>
                    <option value="engineering">Engineering (AKTU / BEU / B.Tech)</option>
                    <option value="general_degree">Degree (BCA / B.Sc / B.Com)</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label">Target Exam or Board</label>
                  <input
                    type="text"
                    required
                    value={formData.targetExamOrBoard}
                    onChange={(e) => setFormData({ ...formData, targetExamOrBoard: e.target.value })}
                    placeholder="e.g. UPSC, BPSC, BSEB 12th, CBSE 10th, AKTU"
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Medium & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Medium of Instruction</label>
                  <select
                    value={formData.medium}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    className="admin-input"
                  >
                    <option value="hindi">हिंदी माध्यम (Hindi Medium)</option>
                    <option value="english">English Medium</option>
                    <option value="bilingual">Bilingual / Hinglish</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label">Department / Stream</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Civil Services, Science (PCM), Computer Science"
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Subject & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Subject</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="admin-input"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="admin-label">Custom Slug (Optional)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="bpsc-bihar-special-history"
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Description</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="High-yield chapter notes covering key syllabus points, diagrams, and formulas..."
                  className="admin-input"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="admin-label">Total Pages</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.pageCount}
                    onChange={(e) => setFormData({ ...formData, pageCount: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="admin-label">Pricing Model</label>
                  <select
                    value={formData.isFree ? 'free' : 'paid'}
                    onChange={(e) => setFormData({ ...formData, isFree: e.target.value === 'free' })}
                    className="admin-input"
                  >
                    <option value="paid">Micro-Priced (₹)</option>
                    <option value="free">100% Free (₹0)</option>
                  </select>
                </div>

                {!formData.isFree && (
                  <div>
                    <label className="admin-label">Price (₹ INR)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-line pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
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
