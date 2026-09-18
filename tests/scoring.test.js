import { describe, expect, it } from 'vitest';
import { PRIORITIES } from '../lib/data';
import { dealbreakerCheck, phaseScore, rankLocations, weightedScore } from '../lib/scoring';

describe('weightedScore', () => {
  it('uses only priorities that were answered', () => {
    const priorities = { [PRIORITIES[0]]: 5 };
    expect(weightedScore(priorities, {}, 'grad')).toBe(5);
    expect(weightedScore({}, {}, 'grad')).toBe(0);
  });
});

describe('life phase scoring', () => {
  it('changes a location score when the selected phase changes', () => {
    expect(phaseScore('grad', 'baby')).toBeGreaterThan(phaseScore('grad', 'now'));
    expect(phaseScore('zlatibor', 'baby')).toBe(1);
  });

  it('contributes to the calculated result', () => {
    const priorities = { [PRIORITIES[0]]: 5 };
    const common = {
      goranPrio: priorities,
      partnerPrio: priorities,
      goranRating: {},
      partnerRating: {},
      goranDB: {},
      partnerDB: {},
      fit: {},
      dbStatus: {},
    };
    const now = rankLocations({ ...common, activePhase: 'now' });
    const baby = rankLocations({ ...common, activePhase: 'baby' });
    expect(now.find(item => item.loc.id === 'grad').calcAvg)
      .not.toBe(baby.find(item => item.loc.id === 'grad').calcAvg);
  });
});

describe('dealbreakers', () => {
  it('disqualifies a location only for a selected required condition', () => {
    const selected = { 'Parking ili garaža': true };
    expect(dealbreakerCheck('grad', selected, {}, {}).disqualified).toBe(true);
    expect(dealbreakerCheck('grad', {}, {}, {}).disqualified).toBe(false);
  });
});
