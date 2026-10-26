'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import { ROLES } from '@hritikpedia/shared/permissions';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to load user directory');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update role');

      setMessage({ type: 'success', text: 'Role successfully modified.' });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    setUpdatingId(userId);
    setMessage(null);
    const newStatus = !currentStatus;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, isActive: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      setMessage({
        type: 'success',
        text: `User ${newStatus ? 'activated' : 'deactivated'} successfully.`,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: newStatus } : u))
      );
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            User Directory &amp; RBAC Control
          </h1>
          <p className="text-xs text-muted mt-1">
            Manage student accounts, staff privileges, and granular role assignments
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            message.type === 'error'
              ? 'bg-brick-soft border border-brick/30 text-brick'
              : 'bg-mint-soft border border-mint/30 text-mint'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-muted hover:text-ink">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-cream p-3 rounded-2xl border border-line">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, or role..."
            className="w-full pl-9 pr-4 py-2 bg-paper-2 border border-line-strong rounded-xl text-ink text-xs focus:outline-none focus:border-royal"
          />
        </div>
        <div className="text-xs text-muted font-medium pr-2">
          {filteredUsers.length} accounts found
        </div>
      </div>

      {/* Table */}
      <div className="bg-cream rounded-2xl border border-line shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink-soft">
            <thead className="bg-paper-2 text-[11px] font-semibold text-muted uppercase tracking-wider border-b border-line">
              <tr>
                <th className="px-5 py-3.5">Learner / Staff</th>
                <th className="px-5 py-3.5">Assigned RBAC Role</th>
                <th className="px-5 py-3.5">Account Status</th>
                <th className="px-5 py-3.5">Email Verified</th>
                <th className="px-5 py-3.5">Registered</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-muted">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-royal" />
                    <span>Loading directory records...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-muted">
                    No accounts match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-paper-2/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink">{u.name || 'Anonymous Student'}</div>
                      <div className="text-[11px] text-muted font-mono mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={u.role}
                        disabled={updatingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-paper-2 border border-line-strong rounded-lg px-2.5 py-1 text-xs text-ink-soft focus:outline-none focus:border-royal"
                      >
                        {Object.values(ROLES).map((role) => (
                          <option key={role} value={role}>
                            {role.replace('_', ' ').toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          u.is_active
                            ? 'bg-mint-soft text-mint border border-mint/25'
                            : 'bg-brick-soft text-brick border border-brick/25'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {u.email_verified ? (
                        <span className="text-mint flex items-center gap-1 text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="text-muted flex items-center gap-1 text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Unverified</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted text-[11px]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u.id, u.is_active)}
                        disabled={updatingId === u.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          u.is_active
                            ? 'bg-brick-soft hover:bg-brick-soft text-brick border border-brick/25'
                            : 'bg-mint-soft hover:bg-mint-soft text-mint border border-mint/25'
                        }`}
                      >
                        {u.is_active ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
