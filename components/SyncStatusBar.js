'use client';

const STATUS_MESSAGES = {
  idle:    '',
  loading: 'Učitavam...',
  saving:  'Čuvam...',
  waiting: 'Čeka...',
  saved:   'Sačuvano ✓',
  error:   'Greška pri čuvanju',
};

export default function SyncStatusBar({ status, message }) {
  const msg = message || STATUS_MESSAGES[status] || '';
  if (status === 'idle') return null;

  return (
    <div className={`sync-bar ${status}`}>
      <div className="sdot" />
      <span>{msg}</span>
    </div>
  );
}
