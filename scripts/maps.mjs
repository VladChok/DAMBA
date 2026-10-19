// Natural Earth (public domain), projected at build time. No map library in the browser.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { geoOrthographic, geoMercator, geoPath, geoGraticule } from 'd3-geo';
import { feature } from 'topojson-client';

const atlas = JSON.parse(await readFile(new URL('../node_modules/world-atlas/land-50m.json', import.meta.url)));
const land = feature(atlas, atlas.objects.land);
const globeAtlas = JSON.parse(await readFile(new URL('../node_modules/world-atlas/land-110m.json', import.meta.url)));
const globeLand = feature(globeAtlas, globeAtlas.objects.land);
await mkdir(new URL('../assets/', import.meta.url), { recursive: true });
const mark = (p, point, r = 5) => { const [x, y] = p(point); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"/>`; };
const label = (p, point, text, size = 16) => { const [x, y] = p(point); return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${size}">${text}</text>`; };
const line = (p, coordinates) => geoPath(p)({ type: 'LineString', coordinates });
const globe = geoOrthographic().rotate([-180, -65, 15]).translate([440, 390]).scale(365).precision(.5);
const detail = geoMercator().rotate([169, 0]).center([0, 65.8]).translate([600, 285]).scale(3700).clipExtent([[0, 0], [1200, 570]]).precision(.1);
const styles = `<style>text{font-family:Arial,sans-serif;fill:#1855b7;letter-spacing:2px;text-anchor:middle;font-weight:600}path{vector-effect:non-scaling-stroke}</style>`;
const globeSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 780">${styles}<defs><pattern id="h" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><path d="M0 0V5" stroke="#1855b7" stroke-opacity=".14" stroke-width="1"/></pattern></defs><circle cx="440" cy="390" r="365" fill="#edf2f6" stroke="#9bb6d4"/><path d="${geoPath(globe)(geoGraticule().step([20, 10])())}" fill="none" stroke="#bccddd" stroke-width=".65"/><path d="${geoPath(globe).digits(1)(globeLand)}" fill="#d7e3ee" stroke="#5883b0" stroke-width=".7"/><path d="${geoPath(globe).digits(1)(globeLand)}" fill="url(#h)"/><g fill="none" stroke="#1855b7">${mark(globe, [-168.9, 65.8], 29)}${mark(globe, [-168.9, 65.8], 36)}</g><g fill="#1855b7">${mark(globe, [-168.9, 65.8], 5)}</g>${label(globe, [106, 53], 'ЕВРАЗИЯ', 20)}${label(globe, [-110, 48], 'СЕВЕРНАЯ АМЕРИКА', 14)}${label(globe, [180, 24], 'ТИХИЙ ОКЕАН', 12)}${label(globe, [180, 80], 'АРКТИКА', 11)}<path d="${line(globe, [[37.6, 55.7], [100, 60], [140, 63], [-168.9, 65.8], [-149.9, 61.2], [-122, 49]])}" fill="none" stroke="#7943b6" stroke-width="2" stroke-dasharray="6 6"/><text x="440" y="770" font-size="10">ПРОЕКЦИЯ СЕВЕРНОГО ПОЛУШАРИЯ · NATURAL EARTH</text></svg>`;
const detailSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 570">${styles}<rect width="1200" height="570" fill="#e9f0f6"/><path d="${geoPath(detail)(geoGraticule().step([2, 1])())}" fill="none" stroke="#c3d3e3" stroke-width=".8"/><path d="${geoPath(detail)(land)}" fill="#cbdceb" stroke="#5d85ac" stroke-width="1"/>${label(detail, [-173.6, 66.4], 'ЧУКОТКА', 24)}${label(detail, [-164.1, 66.35], 'АЛЯСКА', 24)}${label(detail, [-169, 67.1], 'ЧУКОТСКОЕ МОРЕ', 12)}${label(detail, [-169, 64.4], 'БЕРИНГОВО МОРЕ', 12)}<g fill="#1855b7">${mark(detail, [-169.65, 66.07])}${mark(detail, [-168.05, 65.61])}</g><path d="${line(detail, [[-169.65, 66.07], [-169.05, 65.78], [-168.05, 65.61]])}" fill="none" stroke="#7943b6" stroke-width="3" stroke-dasharray="8 7"/>${label(detail, [-171, 65.75], 'МЫС ДЕЖНЁВА', 11)}${label(detail, [-166.7, 65.25], 'МЫС ПРИНЦА УЭЛЬСКОГО', 11)}<text x="600" y="550" font-size="11">СХЕМА СВЯЗИ · НЕ ИНЖЕНЕРНАЯ ТРАССА</text></svg>`;
await writeFile(new URL('../assets/globe.svg', import.meta.url), globeSVG);
await writeFile(new URL('../assets/strait.svg', import.meta.url), detailSVG);
console.log('Generated two geographic SVGs from Natural Earth 1:110m (globe), 1:50m (strait).');
