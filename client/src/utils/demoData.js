export function formatNumber(num) {
  if (num === undefined || num === null) return 'N/A';
  return Number(num).toLocaleString();
}

export function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  const d = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now - d;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

export function shortenHash(hash, chars = 6) {
  if (!hash || hash.length < chars * 2 + 3) return hash || '';
  return hash.substring(0, chars + 2) + '...' + hash.substring(hash.length - chars);
}

export function formatValue(val, decimals = 2) {
  if (val === undefined || val === null) return 'N/A';
  const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
  return `${Number(num).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} NFX`;
}