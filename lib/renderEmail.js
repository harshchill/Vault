// lib/renderEmail.js
/**
 * Renders an email payload. Accepts either a string or a function that returns a string.
 * This avoids importing `react-dom/server` inside app routes (Turbopack/Next restriction).
 * @param {function|string} componentOrString
 * @returns {string}
 */
export function renderEmail(componentOrString) {
  if (typeof componentOrString === 'string') return componentOrString;
  if (typeof componentOrString === 'function') return componentOrString();
  return String(componentOrString ?? '');
}