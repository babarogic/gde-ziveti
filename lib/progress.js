import { LOCATIONS, PRIORITIES } from './data';

function personProgress(priorities, ratings) {
  const selectedPriorities = PRIORITIES.filter(item => (priorities?.[item] || 0) > 0).length;
  const ratedLocations = LOCATIONS.filter(loc => (ratings?.[loc.id] || 0) > 0).length;
  const completed = Math.min(selectedPriorities, 5) + ratedLocations;
  const total = 5 + LOCATIONS.length;
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
