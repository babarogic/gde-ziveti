'use client';

import { useState } from 'react';
import { inviteUrl } from '@/lib/workspace';

export default function WorkspaceBar({ workspace }) {
  const [copyState, setCopyState] = useState('idle');
  if (!workspace?.isPrivate || !workspace.inviteToken) return null;

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(inviteUrl(workspace.inviteToken));
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 2500);
    } catch {
      setCopyState('error');
    }
  }

  return (
    <section className="workspace-bar" aria-label="Privatni prostor para">
      <div>
        <strong>Privatni prostor para</strong>
        <span>Samo članovi sa pozivnicom mogu da pristupe.</span>
      </div>
      <button type="button" onClick={copyInvite}>
        {copyState === 'copied' ? 'Pozivnica je kopirana' : copyState === 'error' ? 'Kopiranje nije uspelo' : 'Kopiraj pozivnicu'}
      </button>
    </section>
  );
}
