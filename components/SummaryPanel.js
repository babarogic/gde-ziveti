'use client';

import { LOCATIONS, PRIORITIES } from '@/lib/data';
import { rankLocations, drivers, researchList } from '@/lib/scoring';
import { coupleProgress } from '@/lib/progress';

const shortName = name => name.split('—')[0].trim();

export default function SummaryPanel({
  goranRating, partnerRating, goranPrio, partnerPrio,
  goranDB, partnerDB, fit, dbStatus,
  notes, onNotesChange, onRefresh, activePhase, isActive,
  researchPlan, onResearchChange, decisionPlan, onDecisionPlanChange,
}) {
  const ranked = rankLocations({
    goranPrio, partnerPrio, goranRating, partnerRating, goranDB, partnerDB, fit, dbStatus, activePhase,
  });
  const progress = coupleProgress({ goranPrio, partnerPrio, goranRating, partnerRating });

  const alive = ranked.filter(r => !r.disqualified);
  const winner = progress.ready ? alive.find(r => r.calcAvg > 0) : null;
  const winnerDrivers = winner
    ? {
        g: drivers(goranPrio, fit, winner.loc.id),
        p: drivers(partnerPrio, fit, winner.loc.id),
      }
    : null;

  // Najveći raskorak između osećaja i računice — najbolja tema za razgovor.
  const biggestGap = ranked
    .filter(r => r.gutAvg && r.calcAvg && Math.abs(r.gap) >= 0.8)
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))[0];

  const tensions = [];
  LOCATIONS.forEach(loc => {
    const g = goranRating[loc.id] || 0;
    const p = partnerRating[loc.id] || 0;
    const diff = Math.abs(g - p);
    if (g > 0 && p > 0 && diff >= 2) {
      tensions.push({ name: shortName(loc.name), diff, g, p, cls: diff >= 3 ? 'high' : 'med' });
    }
  });
  PRIORITIES.forEach(pr => {
    const g = goranPrio[pr] || 0;
    const p = partnerPrio[pr] || 0;
    const diff = Math.abs(g - p);
    if (g > 0 && p > 0 && diff >= 2) {
      tensions.push({ name: `Prioritet: ${pr}`, diff, g, p, cls: diff >= 3 ? 'high' : 'med' });
    }
  });
  tensions.sort((a, b) => b.diff - a.diff);

  const research = researchList(goranDB, partnerDB, dbStatus);

  return (
    <section className={`panel${isActive ? ' active' : ''}`} aria-labelledby="summary-title">
      <h2 className="slabel" id="summary-title">Ukupni pregled</h2>

      {!progress.ready && (
        <div className="readiness-banner" role="status">
          <strong>Rezultat je još privremen</strong>
          <span>
            Goran {progress.goran.percent}% · Supruga {progress.partner.percent}%.
            Konačni redosled se prikazuje kada oboje završite prioritete i ocenite lokacije.
          </span>
        </div>
      )}

      <div className="summary-card">
        <h3>Poređenje lokacija</h3>
        <p className="phelp">
          <b>Osećaj</b> je vaša ocena iz stomaka. <b>Matrica</b> je izračunato iz
          vaših prioriteta i toga koliko ih mesto ispunjava. Kad se te dve razlikuju —
          tu je razgovor. Izabrana faza života čini 20% ocene matrice.
        </p>

        {ranked.map((r, i) => (
          <div key={r.loc.id} className={`lrow${r.disqualified ? ' dq' : ''}`}>
            <div className="lrow-head">
              <span className="sname">{shortName(r.loc.name)}</span>
              {progress.ready && i === 0 && !r.disqualified && r.calcAvg > 0 && <span className="stag">Vodi</span>}
              {r.disqualified && <span className="stag dqtag">Pada na uslovima</span>}
              {!r.disqualified && Math.abs(r.gap) >= 0.8 && (
                <span className="stag gaptag">
                  {r.gap > 0 ? 'Srce > matrica' : 'Matrica > srce'}
                </span>
              )}
              <span className="savg">{r.calcAvg > 0 ? r.calcAvg.toFixed(1) : '—'}</span>
            </div>

            <div className="lrow-bars">
              <div className="bargroup">
                <span className="bglabel">Osećaj</span>
                <div className="strack"><div className="sfill sg" style={{ width: `${r.gGut * 20}%` }} /></div>
                <div className="strack"><div className="sfill sp" style={{ width: `${r.pGut * 20}%` }} /></div>
                <div className="bar-labels"><span>G: {r.gGut || '—'}</span><span>S: {r.pGut || '—'}</span></div>
              </div>
              <div className="bargroup">
                <span className="bglabel">Matrica</span>
                <div className="strack"><div className="sfill sg calc" style={{ width: `${r.gCalc * 20}%` }} /></div>
                <div className="strack"><div className="sfill sp calc" style={{ width: `${r.pCalc * 20}%` }} /></div>
                <div className="bar-labels">
                  <span>G: {r.gCalc ? r.gCalc.toFixed(1) : '—'}</span>
                  <span>S: {r.pCalc ? r.pCalc.toFixed(1) : '—'}</span>
                </div>
              </div>
            </div>

            {r.disqualified && (
              <div className="lrow-dq">Pada na: {r.failed.map(f => f.item).join(' · ')}</div>
            )}
          </div>
        ))}

        {ranked.every(r => !r.calcAvg) && (
          <div className="empty-note">
            Popunite prioritete (tab 02) da bi matrica imala šta da računa.
          </div>
        )}
      </div>

      {winner && winnerDrivers && (
        <div className="summary-card">
          <h3>Zašto {shortName(winner.loc.name)} vodi</h3>
          <div className="drv-grid">
            {[
              { label: 'Goran', cls: 'gc', d: winnerDrivers.g },
              { label: 'Supruga', cls: 'pc', d: winnerDrivers.p },
            ].map(({ label, cls, d }) => (
              <div key={label} className={`drv-col ${cls}`}>
                <h4>{label}</h4>
                {d.plus.length === 0 && d.minus.length === 0 && (
                  <div className="drv-item muted">Nema ocenjenih prioriteta</div>
                )}
                {d.plus.map(x => (
                  <div key={x.prio} className="drv-item plus">+ {x.prio}</div>
                ))}
                {d.minus.map(x => (
                  <div key={x.prio} className="drv-item minus">− {x.prio}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {biggestGap && (
        <div className="insight-card">
          <h4>Srce vs. tabela</h4>
          <p>
            {shortName(biggestGap.loc.name)}: osećaj {biggestGap.gutAvg.toFixed(1)},
            matrica {biggestGap.calcAvg.toFixed(1)}.
            {biggestGap.gap > 0
              ? ' Voli vas više nego što bi trebalo po vašim prioritetima — ili vam nešto važno nije na listi prioriteta.'
              : ' Po brojkama bi trebalo da vam više odgovara nego što osećate — vredi pitati šta vas odbija.'}
          </p>
        </div>
      )}

      <div className="tension-card">
        <h4>Tačke razlike — gde razgovor tek počinje</h4>
        {tensions.length > 0 ? tensions.map((t, i) => (
          <div key={i} className="tension-item">
            <div className={`tension-dot ${t.cls}`} />
            <span>{t.name}</span>
            <span className="tension-vals">G:{t.g} S:{t.p}</span>
          </div>
        )) : (
          <div className="tension-item">
            <div className="tension-dot low" />
            <span>Nema većih razlika — ili još niste ocenili 😊</span>
          </div>
        )}
      </div>

      <div className="tension-card">
        <h4>Treba proveriti ({research.length})</h4>
        {research.length > 0 ? research.map(r => (
          <div key={`${r.loc.id}-${r.item}`} className="research-task">
            {(() => {
              const key = `${r.loc.id}::${r.item}`;
              const task = researchPlan?.[key] || {};
              return (
                <>
                  <label className="research-check">
                    <input
                      type="checkbox"
                      checked={!!task.done}
                      onChange={event => onResearchChange(key, { done: event.target.checked })}
                    />
                    <span><b>{shortName(r.loc.name)}</b> — {r.item}</span>
                  </label>
                  <select
                    value={task.owner || 'together'}
                    onChange={event => onResearchChange(key, { owner: event.target.value })}
                    aria-label={`Ko proverava: ${shortName(r.loc.name)}, ${r.item}`}
                  >
                    <option value="together">Zajedno</option>
                    <option value="goran">Goran</option>
                    <option value="partner">Supruga</option>
                  </select>
                  <input
                    type="text"
                    value={task.source || ''}
                    onChange={event => onResearchChange(key, { source: event.target.value })}
                    aria-label={`Izvor ili zaključak: ${shortName(r.loc.name)}, ${r.item}`}
                    placeholder="Izvor ili zaključak"
                  />
                </>
              );
            })()}
          </div>
        )) : (
          <div className="tension-item">
            <div className="tension-dot low" />
            <span>Nema otvorenih pitanja — sve je označeno u tabu 04.</span>
          </div>
        )}
      </div>

      <div className="notes-block">
        <label htmlFor="conversation-notes">Beleške posle razgovora</label>
        <p>Šta je ostalo otvoreno i šta ste zaključili?</p>
        <textarea
          id="conversation-notes"
          className="notes-area"
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
          placeholder="Na primer: proveriti vreme putovanja u špicu..."
        />
      </div>

      <section className="decision-card" aria-labelledby="decision-title">
        <h3 id="decision-title">Sledeći korak</h3>
        <div className="decision-fields">
          <label>
            <span>Šta radimo sledeće?</span>
            <input
              type="text"
              value={decisionPlan?.nextStep || ''}
              onChange={event => onDecisionPlanChange({ nextStep: event.target.value })}
              placeholder="Na primer: poseta Kamenici u špicu"
            />
          </label>
          <label>
            <span>Datum odluke</span>
            <input
              type="date"
              value={decisionPlan?.decisionDate || ''}
              onChange={event => onDecisionPlanChange({ decisionDate: event.target.value })}
            />
          </label>
        </div>
      </section>
      <button type="button" className="upd-btn" onClick={onRefresh}>Osveži podatke</button>
    </section>
  );
}
