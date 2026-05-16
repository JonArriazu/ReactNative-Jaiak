/**
 * geocodificar.js
 * ---------------
 * Consulta Nominatim (OpenStreetMap, gratis, sin API key) para obtener
 * coordenadas reales de cada combinación area+city del dataset.
 *
 * Uso:
 *   node scripts/geocodificar.js
 *
 * Genera:  comun/coordenadasHerria.js  (sobreescribe el existente)
 * Tiempo:  ~5-10 min (1 req/segundo, como exige Nominatim)
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ── 1. Importar el dataset ────────────────────────────────────────────────────
// Necesitamos ejecutarlo como CJS; usamos un pequeño truco para leer el archivo
const dataFile = path.join(__dirname, '../comun/jaiakDatak.js');
let dataCode = fs.readFileSync(dataFile, 'utf8');

// Convertir export a module.exports para poder hacer require
dataCode = dataCode.replace(/export const /g, 'const ').replace(/export \{[^}]+\};?/g, '');
const tmpFile = path.join(__dirname, '_tmp_jaiak.cjs');
fs.writeFileSync(tmpFile, dataCode + '\nmodule.exports = { jaiak };');
const { jaiak } = require(tmpFile);
fs.unlinkSync(tmpFile);

// ── 2. Extraer combinaciones únicas area+city ─────────────────────────────────
const combis = new Map(); // key "area||city" → {area, city, province}
for (const j of jaiak) {
    const key = `${j.area}||${j.city}`;
    if (!combis.has(key)) combis.set(key, { area: j.area, city: j.city, province: j.province });
}

console.log(`Total combinaciones únicas area+city: ${combis.size}`);

// ── 3. Geocodificación ────────────────────────────────────────────────────────
const PROVINCIAS_ES = {
    Araba:    'Álava',
    Bizkaia:  'Vizcaya',
    Gipuzkoa: 'Guipúzcoa',
    Nafarroa: 'Navarra',
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function nominatim(query) {
    return new Promise((resolve) => {
        const encoded = encodeURIComponent(query);
        const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=es`;
        const options = {
            headers: {
                'User-Agent': 'JaiApp-geocoder/1.0 (jonarriazu2@gmail.com)',
                'Accept-Language': 'es,eu',
            },
        };
        https.get(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    if (data && data[0]) {
                        resolve({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
                    } else {
                        resolve(null);
                    }
                } catch {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

async function geocodificarTodo() {
    const resultados = {}; // "area||city" → {latitude, longitude}
    const fallbacks  = []; // los que no se encontraron
    const entries    = [...combis.entries()];
    let   ok = 0, ko = 0;

    for (let i = 0; i < entries.length; i++) {
        const [key, { area, city, province }] = entries[i];
        const provES = PROVINCIAS_ES[province] || province;

        // Intentamos primero con area+city, luego solo city
        let coords = null;

        const intentos = [
            `${area}, ${city}, ${provES}, España`,
            `${city}, ${provES}, España`,
            `${city}, España`,
        ];

        for (const query of intentos) {
            coords = await nominatim(query);
            await sleep(1100); // Nominatim: máx 1 req/s
            if (coords) break;
        }

        if (coords) {
            resultados[key] = { latitude: coords.lat, longitude: coords.lon };
            ok++;
        } else {
            fallbacks.push({ key, area, city, province });
            ko++;
        }

        const pct = Math.round(((i + 1) / entries.length) * 100);
        process.stdout.write(`\r[${pct}%] ${i + 1}/${entries.length} — ✓${ok} ✗${ko}  `);
    }

    console.log('\n\nGeocoding completado.');
    if (fallbacks.length) {
        console.log(`Sin coordenadas (${fallbacks.length}):`, fallbacks.map(f => f.city).join(', '));
    }

    return resultados;
}

// ── 4. Generar comun/coordenadasHerria.js ─────────────────────────────────────
function generarArchivo(resultados) {
    const lines = [];

    lines.push('/**');
    lines.push(' * coordenadasHerria.js — GENERADO AUTOMÁTICAMENTE por scripts/geocodificar.js');
    lines.push(` * Fecha: ${new Date().toISOString().slice(0, 10)}`);
    lines.push(` * Fuente: Nominatim / OpenStreetMap (© OpenStreetMap contributors)`);
    lines.push(' *');
    lines.push(' * Clave: "area||city"  →  { latitude, longitude }');
    lines.push(' */');
    lines.push('');
    lines.push('export const PROVINCIA_CENTROIDES = {');
    lines.push("    Araba:    { latitude: 42.8460, longitude: -2.6720 },");
    lines.push("    Bizkaia:  { latitude: 43.2200, longitude: -2.7500 },");
    lines.push("    Gipuzkoa: { latitude: 43.1500, longitude: -2.1500 },");
    lines.push("    Nafarroa: { latitude: 42.7000, longitude: -1.6500 },");
    lines.push('};');
    lines.push('');
    lines.push('const COORDS = {');

    for (const [key, { latitude, longitude }] of Object.entries(resultados)) {
        const safe = key.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        lines.push(`    '${safe}': { latitude: ${latitude.toFixed(6)}, longitude: ${longitude.toFixed(6)} },`);
    }

    lines.push('};');
    lines.push('');
    lines.push('/**');
    lines.push(' * Devuelve coordenadas para un jaiak dado su area y city.');
    lines.push(' * Si dos fiestas comparten coordenadas exactas se aplica un micro-offset');
    lines.push(' * determinista para que los pins no se solapen en el mapa.');
    lines.push(' */');
    lines.push('const _usados = {};');
    lines.push('');
    lines.push('export function getCoordenadas(area, city, province, id) {');
    lines.push("    const key = `${area}||${city}`;");
    lines.push('    const base = COORDS[key]');
    lines.push('        || COORDS[`${city}||${city}`]');
    lines.push('        || PROVINCIA_CENTROIDES[province]');
    lines.push("        || { latitude: 43.0, longitude: -2.0 };");
    lines.push('');
    lines.push('    // Micro-offset para que pines en el mismo punto sean distinguibles');
    lines.push('    const posKey = `${base.latitude.toFixed(4)},${base.longitude.toFixed(4)}`;');
    lines.push('    const idx = _usados[posKey] = (_usados[posKey] ?? -1) + 1;');
    lines.push('    if (idx === 0) return base;');
    lines.push('    const angle = (idx * 137.5 * Math.PI) / 180; // espiral áurea');
    lines.push('    const r = 0.001 * Math.ceil(idx / 8);');
    lines.push('    return {');
    lines.push('        latitude:  base.latitude  + r * Math.sin(angle),');
    lines.push('        longitude: base.longitude + r * Math.cos(angle),');
    lines.push('    };');
    lines.push('}');
    lines.push('');
    lines.push('/** Resetea los offsets (llamar antes de recalcular marcadores) */');
    lines.push('export function resetCoordenadas() {');
    lines.push('    Object.keys(_usados).forEach(k => delete _usados[k]);');
    lines.push('}');

    const outPath = path.join(__dirname, '../comun/coordenadasHerria.js');
    fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
    console.log(`\nArchivo generado: ${outPath}`);
    console.log(`Total entradas: ${Object.keys(resultados).length}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
    console.log('Iniciando geocodificación con Nominatim (OpenStreetMap)...');
    console.log('Puede tardar varios minutos (1 req/s para respetar los límites).\n');
    const resultados = await geocodificarTodo();
    generarArchivo(resultados);
})();
