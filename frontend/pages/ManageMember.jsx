import { useState } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { getHomePathForUser } from '../utils/roles.js';
import AddMember from '../components/members/AddMember.jsx';
import RemoveMember from '../components/members/RemoveMember.jsx';
import ViewAnalytics from '../components/members/ViewAnalytics.jsx';

const FILTERS = [
  { id: 'add', label: 'Add Member' },
  { id: 'remove', label: 'Remove Member' },
  { id: 'analytics', label: 'View Analytics' },
];

export default function ManageMember() {
  const { user } = useOutletContext() || {};
  const [activeFilter, setActiveFilter] = useState('add');

  if (user?.company_role !== 'MASTER_ADMIN') {
    return <Navigate to={getHomePathForUser(user)} replace />;
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-fg flex items-center gap-2">
          <Users className="w-6 h-6 text-accent" />
          Manage Members
        </h1>
        <p className="text-xs text-fg-muted mt-1">
          Add or remove company members, or view member analytics.
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            className={
              'rounded-lg px-3 py-1 text-xs font-medium cursor-pointer shrink-0 ' +
              (activeFilter === f.id
                ? 'bg-indigo-600 text-white'
                : 'bg-chip text-fg-muted hover:bg-hover hover:text-fg')
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {activeFilter === 'add' && <AddMember />}
      {activeFilter === 'remove' && <RemoveMember />}
      {activeFilter === 'analytics' && <ViewAnalytics />}
    </div>
  );
}
