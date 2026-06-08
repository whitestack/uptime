'use strict';

// Minimal dependency-free "shields.io"-style flat SVG badge renderer.
// Good enough for embedding monitor status / uptime in READMEs and dashboards
// without pulling in a rendering library or calling an external service.

const COLORS = {
  brightgreen: '#4c1',
  green: '#97ca00',
  yellow: '#dfb317',
  orange: '#fe7d37',
  red: '#e05d44',
  blue: '#007ec6',
  grey: '#9f9f9f',
  lightgrey: '#9f9f9f',
};

function resolveColor(c) {
  if (!c) return COLORS.lightgrey;
  if (COLORS[c]) return COLORS[c];
  if (/^#[0-9a-f]{3,8}$/i.test(c)) return c;
  return COLORS.lightgrey;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Rough text width estimate (Verdana 11px ≈ 7px/char average). Exact glyph
// metrics aren't worth the bytes for a status badge.
function textWidth(text) {
  return Math.ceil(String(text).length * 7);
}

function renderBadge({ label = '', message = '', color = 'lightgrey' } = {}) {
  const fill = resolveColor(color);
  const pad = 10;
  const labelW = textWidth(label) + pad;
  const msgW = textWidth(message) + pad;
  const total = labelW + msgW;
  const labelX = (labelW / 2) * 10;
  const msgX = (labelW + msgW / 2) * 10;
  const labelTextW = (labelW - pad) * 10;
  const msgTextW = (msgW - pad) * 10;
  const safeLabel = escapeXml(label);
  const safeMsg = escapeXml(message);
  const aria = `${safeLabel}: ${safeMsg}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${total}" height="20" role="img" aria-label="${aria}">
  <title>${aria}</title>
  <linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
  <clipPath id="r"><rect width="${total}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelW}" height="20" fill="#555"/>
    <rect x="${labelW}" width="${msgW}" height="20" fill="${fill}"/>
    <rect width="${total}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${labelX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${labelTextW}">${safeLabel}</text>
    <text x="${labelX}" y="140" transform="scale(.1)" textLength="${labelTextW}">${safeLabel}</text>
    <text aria-hidden="true" x="${msgX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${msgTextW}">${safeMsg}</text>
    <text x="${msgX}" y="140" transform="scale(.1)" textLength="${msgTextW}">${safeMsg}</text>
  </g>
</svg>`;
}

module.exports = { renderBadge };
