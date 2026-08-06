import {
  LOCATIONS,
  PRIORITIES,
  DEALBREAKERS,
  FIT_DEFAULTS,
  DB_STATUS_DEFAULTS,
} from './data';

/** Koliko lokacija ispunjava dati prioritet (1–5). Vrednost iz baze, pa default. */
export function fitFor(fit, locId, prio) {
  const v = fit?.[prio]?.[locId];
  if (typeof v === 'number' && v > 0) return v;
  return FIT_DEFAULTS[prio]?.[locId] ?? 3;
}

/** Status uslova za lokaciju: 'yes' | 'no' | 'unknown'. */
export function dbStatusFor(dbStatus, locId, item) {
  return dbStatus?.[locId]?.[item] || DB_STATUS_DEFAULTS[locId]?.[item] || 'unknown';
}

/**
 * Težinski skor lokacije za jednu osobu, na skali 1–5.
 * Σ(važnost × ispunjenost) / Σ(važnost) — prioriteti sa 0 tačkica se ignorišu.
 * Vraća 0 ako osoba još nije ocenila nijedan prioritet.
 */
export function weightedScore(prio, fit, locId) {
  let num = 0;
  let den = 0;
  for (const p of PRIORITIES) {
    const w = prio?.[p] || 0;
    if (!w) continue;
    num += w * fitFor(fit, locId, p);
    den += w;
  }
  return den ? num / den : 0;
}

/**
 * Koji prioriteti najviše guraju lokaciju gore, a koji dole.
 * Doprinos = važnost × (ispunjenost − 3), tj. odstupanje od proseka.
 */
export function drivers(prio, fit, locId, count = 3) {
  const all = PRIORITIES
    .map(p => ({ prio: p, weight: prio?.[p] || 0, fit: fitFor(fit, locId, p) }))
    .filter(d => d.weight > 0)
    .map(d => ({ ...d, impact: d.weight * (d.fit - 3) }))
    .sort((a, b) => b.impact - a.impact);

  return {
    plus: all.filter(d => d.impact > 0).slice(0, count),
    minus: all.filter(d => d.impact < 0).reverse().slice(0, count),
  };
}

/**
 * Provera uslova za lokaciju. Uslov se broji samo ako ga je BAR JEDNO od vas
 * čekiralo. 'no' → diskvalifikacija, 'unknown' → otvoreno pitanje.
 */
export function dealbreakerCheck(locId, goranDB, partnerDB, dbStatus) {
  const failed = [];
  const open = [];

  for (const item of DEALBREAKERS) {
    const byG = !!goranDB?.[item];
    const byP = !!partnerDB?.[item];
    if (!byG && !byP) continue;

    const wanted = byG && byP ? 'oboje' : byG ? 'Goran' : 'Supruga';
    const st = dbStatusFor(dbStatus, locId, item);
    if (st === 'no') failed.push({ item, wanted });
    else if (st === 'unknown') open.push({ item, wanted });
  }

  return { failed, open, disqualified: failed.length > 0 };
}

/** Sve lokacije, sa svim skorovima, sortirane — jedan izvor istine za Rezultate. */
export function rankLocations({ goranPrio, partnerPrio, goranRating, partnerRating, goranDB, partnerDB, fit, dbStatus }) {
  return LOCATIONS.map(loc => {
    const gGut = goranRating?.[loc.id] || 0;
    const pGut = partnerRating?.[loc.id] || 0;
    const gCalc = weightedScore(goranPrio, fit, loc.id);
    const pCalc = weightedScore(partnerPrio, fit, loc.id);

    const gutBoth = [gGut, pGut].filter(Boolean);
    const calcBoth = [gCalc, pCalc].filter(Boolean);
    const gutAvg = gutBoth.length ? gutBoth.reduce((a, b) => a + b, 0) / gutBoth.length : 0;
    const calcAvg = calcBoth.length ? calcBoth.reduce((a, b) => a + b, 0) / calcBoth.length : 0;

    const db = dealbreakerCheck(loc.id, goranDB, partnerDB, dbStatus);

    return {
      loc,
      gGut, pGut, gutAvg,
      gCalc, pCalc, calcAvg,
      // razlika između osećaja i matrice — najzanimljiviji signal
      gap: gutAvg && calcAvg ? gutAvg - calcAvg : 0,
      ...db,
    };
  }).sort((a, b) => {
    if (a.disqualified !== b.disqualified) return a.disqualified ? 1 : -1;
    const aScore = a.calcAvg || a.gutAvg;
    const bScore = b.calcAvg || b.gutAvg;
    return bScore - aScore;
  });
}

/** Sve nepoznanice preko svih lokacija — lista za istraživanje. */
export function researchList(goranDB, partnerDB, dbStatus) {
  const out = [];
  for (const loc of LOCATIONS) {
    const { open } = dealbreakerCheck(loc.id, goranDB, partnerDB, dbStatus);
    for (const o of open) out.push({ loc, ...o });
  }
  return out;
}
