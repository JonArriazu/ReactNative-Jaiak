// Script de Node para sembrar la coleccion 'jaiak' en Firestore.
// Uso:
//   1. Pon serviceAccountKey.json en la raiz del proyecto (Project Settings -> Service accounts -> Generate new private key).
//   2. npm run seed:firestore
//
// El script sube en batches de 500 (limite por batch que impone Firestore)
// y usa el id del jai como id del documento (idempotente: re-ejecutar
// reescribe los documentos sin duplicar).

const path = require('path');
const admin = require('firebase-admin');

const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (e) {
  console.error(
    'No se encuentra serviceAccountKey.json en la raiz del proyecto.\n' +
      'Descargalo desde Firebase Console -> Project Settings -> Service accounts -> Generate new private key.'
  );
  process.exit(1);
}

// Para que el require de comun/jaiakDatak.js (ESM con export const) funcione
// en Node, lo cargamos con esm-loader manual: leemos el archivo y lo
// evaluamos en un sandbox sencillo. Mas robusto: convertir a CommonJS al
// importarlo. Aqui hacemos un workaround basico usando un require interno.
const fs = require('fs');
const datakPath = path.join(__dirname, '..', 'comun', 'jaiakDatak.js');
const datakSrc = fs.readFileSync(datakPath, 'utf8');

// Convierte "export const jaiak = ..." a "module.exports.jaiak = ..."
const cjsSrc = datakSrc.replace(/export const /g, 'module.exports.');
// Lo evaluamos en un module-like wrapper
const Module = require('module');
const m = new Module(datakPath);
m.filename = datakPath;
m.paths = Module._nodeModulePaths(path.dirname(datakPath));
m._compile(cjsSrc, datakPath);
const { jaiak } = m.exports;

if (!Array.isArray(jaiak) || jaiak.length === 0) {
  console.error('No se pudieron cargar las jaiak desde comun/jaiakDatak.js');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seed() {
  console.log(`Subiendo ${jaiak.length} jaiak a Firestore...`);

  const BATCH_SIZE = 500;
  let subidas = 0;

  for (let i = 0; i < jaiak.length; i += BATCH_SIZE) {
    const trozo = jaiak.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    trozo.forEach((j) => {
      const ref = db.collection('jaiak').doc(j.id);
      batch.set(ref, j);
    });
    await batch.commit();
    subidas += trozo.length;
    console.log(`  ${subidas}/${jaiak.length}`);
  }

  console.log('Listo.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Fallo el seed:', err);
  process.exit(1);
});
