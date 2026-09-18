import { LOCATIONS, PRIORITIES } from './data';

function personProgress(priorities, ratings) {
  const completed =
    PRIORITIES.filter(item => (priorities?.[item] || 0) > 0).length +
    LOCATIONS.filter(loc => (ratings?.[loc.id] || 0) > 0).length;
  const total = PRIORITIES.length + LOCATIONS.length;
  return { completed, total, percent: Math.round((completed / total) * 100) };
}

export function coupleProgress({ goranPrio, partnerPrio, goranRating, partnerRating }) {
  const goran = personProgress(goranPrio, goranRating);
  const partner = personProgress(partnerPrio, partnerRating);
  return {
    goran,
    partner,
    ready: goran.percent === 100 && partner.percent === 100,
  };
}
