export function formatScore(score) {
  return score ? score.toFixed(1) : 'N/A';
}

export function formatEpisodeCount(count) {
  if (!count) return '??';
  return count === 0 ? 'Ongoing' : String(count);
}

export function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function pluralize(count, singular, plural) {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural || singular + 's'}`;
}

export function truncate(text, max = 150) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}
