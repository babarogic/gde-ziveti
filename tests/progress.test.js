import { describe, expect, it } from 'vitest';
import { LOCATIONS, PRIORITIES } from '../lib/data';
import { coupleProgress } from '../lib/progress';

const completePriorities = Object.fromEntries(PRIORITIES.map(item => [item, 3]));
const completeRatings = Object.fromEntries(LOCATIONS.map(item => [item.id, 3]));
const fivePriorities = Object.fromEntries(PRIORITIES.slice(0, 5).map(item => [item, 3]));

describe('coupleProgress', () => {
  it('is ready only after both people finish', () => {
    const incomplete = coupleProgress({
      goranPrio: completePriorities,
      goranRating: completeRatings,
      partnerPrio: {},
      partnerRating: {},
    });
    expect(incomplete.ready).toBe(false);
    expect(incomplete.goran.percent).toBe(100);
    expect(incomplete.partner.percent).toBe(0);

    const complete = coupleProgress({
      goranPrio: completePriorities,
      goranRating: completeRatings,
      partnerPrio: completePriorities,
      partnerRating: completeRatings,
    });
    expect(complete.ready).toBe(true);
  });

  it('treats five chosen priorities as complete', () => {
    const progress = coupleProgress({
      goranPrio: fivePriorities,
      goranRating: completeRatings,
      partnerPrio: fivePriorities,
      partnerRating: completeRatings,
    });
    expect(progress.goran.percent).toBe(100);
    expect(progress.ready).toBe(true);
  });
});
