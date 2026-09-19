'use client';

import { researchList } from '@/lib/scoring';

const shortName = name => name.split('—')[0].trim();

export default function DecisionPanel({
  isActive, peopleNames, goranDB, partnerDB, dbStatus, onSetDBStatus,
  researchPlan, onResearchChange, notes, onNotesChange, decisionPlan, onDecisionPlanChange,
}) {
  const research = researchList(goranDB, partnerDB, dbStatus);
  return (
    <section className={`panel${isActive ? ' active' : ''}`} aria-labelledby="decision-title">
      <div className="step-heading"><span className="eyebrow">Od razgovora ka akciji</span><h1 id="decision-title">Dogovorite jedan sledeći korak.</h1><p>Ne morate danas izabrati dom. Dovoljno je da znate šta proveravate sledeće i ko to radi.</p></div>

      <div className="decision-layout">
        <section className="research-card"><div className="section-intro"><span className="eyebrow">Otvorena pitanja</span><h2>Treba proveriti ({research.length})</h2></div>
          {research.length ? research.map(item => {
            const key = `${item.loc.id}::${item.item}`;
            const task = researchPlan?.[key] || {};
            return <div className="research-task" key={key}>
              <div className="research-question"><strong>{shortName(item.loc.name)}</strong><span>{item.item}</span></div>
              <div className="research-actions"><select value={task.owner || 'together'} onChange={event => onResearchChange(key, { owner: event.target.value })} aria-label={`Ko proverava ${item.item}`}>
                <option value="together">Zajedno</option><option value="goran">{peopleNames.goran || 'Goran'}</option><option value="partner">{peopleNames.partner || 'Druga osoba'}</option>
              </select><input value={task.source || ''} onChange={event => onResearchChange(key, { source: event.target.value })} placeholder="Izvor ili zaključak" aria-label={`Zaključak za ${item.item}`} /></div>
              <div className="fact-status"><button type="button" onClick={() => onSetDBStatus(item.loc.id, item.item, 'yes')}>✓ Ispunjava</button><button type="button" onClick={() => onSetDBStatus(item.loc.id, item.item, 'no')}>× Ne ispunjava</button></div>
            </div>;
          }) : <div className="empty-mini">Nema otvorenih pitanja. Sve obavezne uslove ste proverili.</div>}
        </section>

        <aside className="next-step-card"><span className="eyebrow">Vaš dogovor</span><h2>Šta radite sledeće?</h2>
          <label><span>Sledeći korak</span><input value={decisionPlan?.nextStep || ''} onChange={event => onDecisionPlanChange({ nextStep: event.target.value })} placeholder="Na primer: poseta Kamenici u špicu" /></label>
          <label><span>Do kog datuma?</span><input type="date" value={decisionPlan?.decisionDate || ''} onChange={event => onDecisionPlanChange({ decisionDate: event.target.value })} /></label>
          <div className={`decision-summary${decisionPlan?.nextStep ? ' filled' : ''}`}>{decisionPlan?.nextStep ? <><span>Sledeće radite</span><strong>{decisionPlan.nextStep}</strong>{decisionPlan.decisionDate && <small>{new Date(`${decisionPlan.decisionDate}T00:00:00`).toLocaleDateString('sr-Latn')}</small>}</> : <><span>Jedan mali korak je dovoljan.</span><p>Upišite akciju koju oboje razumete.</p></>}</div>
        </aside>
      </div>

      <div className="notes-block"><label htmlFor="conversation-notes">Beleške iz razgovora</label><p>Šta ste zaključili, a šta ostaje otvoreno?</p><textarea id="conversation-notes" value={notes} onChange={event => onNotesChange(event.target.value)} placeholder="Zapišite samo ono što želite da zapamtite…" /></div>
    </section>
  );
}
