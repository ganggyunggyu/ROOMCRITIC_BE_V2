export const typeMatch = (type: 'tv' | 'movie' | 'all') => {
  if (type === 'tv') return { $match: { contentType: 'tv' } };
  if (type === 'movie') return { $match: { contentType: 'movie' } };
  if (type === 'all') return { $match: {} };
  return { $match: {} };
};
