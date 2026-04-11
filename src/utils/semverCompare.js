/**
 * @param {string} v
 * @returns {[number, number, number] | null}
 */
function parseSemver(v) {
  const m = String(v ?? '')
    .trim()
    .match(/^v?(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
}

/**
 * @param {string} a client version
 * @param {string} b server minimum version
 * @returns {number} negative if a < b, 0 if equal, positive if a > b; NaN behavior -> 0 (no force)
 */
export function compareSemver(a, b) {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  if (!pa || !pb) return 0;
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

/**
 * @param {string} clientVersion
 * @param {string | null} serverMinimumVersion
 * @returns {boolean}
 */
export function isUpdateRequired(clientVersion, serverMinimumVersion) {
  if (serverMinimumVersion == null || String(serverMinimumVersion).trim() === '') {
    return false;
  }
  return compareSemver(clientVersion, serverMinimumVersion) < 0;
}
