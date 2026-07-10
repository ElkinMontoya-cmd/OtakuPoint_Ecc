// =====================================================================
// migrate.mjs
// ---------------------------------------------------------------------
// Migra tu catálogo hardcodeado (mangas.json, extraído de tu manga.ts
// actual: 33 mangas / 495 tomos) hacia Supabase:
//   1. Sube cada imagen local (carpeta /public de tu proyecto Angular)
//      al bucket de Storage "mangas".
//   2. Inserta cada manga y sus tomos en Postgres con las URLs nuevas.
//
// CÓMO USARLO
// ---------------------------------------------------------------------
// 1) npm install            (dentro de esta carpeta migration/)
// 2) copia .env.example a .env y completa tus datos (ver instrucciones)
// 3) node migrate.mjs
//
// Es IDEMPOTENTE: si lo corres dos veces, no duplica imágenes ya
// subidas (usa upsert) y te avisa si un manga con el mismo título ya
// existe, para que no dupliques el catálogo por accidente.
// =====================================================================

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // ¡NUNCA la pongas en el frontend!
const BUCKET = process.env.SUPABASE_BUCKET || 'mangas';

// Ruta a la carpeta /public de tu proyecto Angular (donde están las
// imágenes reales: /public/chainsawman/01.jpg, etc.)
const PUBLIC_DIR = process.env.PUBLIC_DIR || '../OtakuPoint_Ecc/public';

// ---------------------------------------------------------------------
// Verificación previa (evita el típico "fetch failed" silencioso)
// ---------------------------------------------------------------------
function verificarConfiguracion() {
  const errores = [];

  if (!SUPABASE_URL) {
    errores.push('SUPABASE_URL no está definida en tu .env');
  } else if (SUPABASE_URL.includes('TU-PROYECTO')) {
    errores.push('SUPABASE_URL todavía tiene el valor de ejemplo (TU-PROYECTO). Reemplázala por tu URL real.');
  } else if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(SUPABASE_URL.trim())) {
    errores.push(`SUPABASE_URL no tiene el formato esperado (https://xxxxx.supabase.co). Valor actual: "${SUPABASE_URL}"`);
  }

  if (!SERVICE_ROLE_KEY) {
    errores.push('SUPABASE_SERVICE_ROLE_KEY no está definida en tu .env');
  } else if (SERVICE_ROLE_KEY.length < 100) {
    errores.push('SUPABASE_SERVICE_ROLE_KEY parece incompleta (muy corta). Cópiala de nuevo desde Project Settings → API.');
  }

  if (!fs.existsSync(PUBLIC_DIR)) {
    errores.push(`PUBLIC_DIR no existe en la ruta: "${PUBLIC_DIR}" (revisa desde dónde corres el script)`);
  }

  const [major] = process.versions.node.split('.').map(Number);
  if (major < 18) {
    errores.push(`Tu versión de Node es ${process.versions.node}. Necesitas Node 18 o superior (para que exista "fetch" nativo).`);
  }

  if (errores.length > 0) {
    console.error('\n❌ No se puede continuar, revisa esto en tu .env o entorno:\n');
    errores.forEach((e) => console.error('   - ' + e));
    console.error('');
    process.exit(1);
  }

  console.log('✅ Configuración verificada correctamente.');
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log(`   Bucket: ${BUCKET}`);
  console.log(`   Carpeta de imágenes: ${path.resolve(PUBLIC_DIR)}`);
  console.log(`   Node: ${process.versions.node}\n`);
}

verificarConfiguracion();

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const mangas = JSON.parse(fs.readFileSync(new URL('./mangas.json', import.meta.url)));

const MIME_POR_EXTENSION = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

function detectarContentType(rutaArchivo) {
  const ext = path.extname(rutaArchivo).toLowerCase();
  return MIME_POR_EXTENSION[ext] || 'application/octet-stream';
}

/** Sube un archivo local (ej: /chainsawman/01.jpg) al bucket y devuelve la URL pública, o null si falló de verdad */
async function subirImagen(rutaRelativa) {
  const rutaLocal = path.join(PUBLIC_DIR, rutaRelativa);

  if (!fs.existsSync(rutaLocal)) {
    console.warn(`  ⚠️  No encontré el archivo local: ${rutaLocal} (se guardará igual la URL esperada)`);
  } else {
    const buffer = fs.readFileSync(rutaLocal);
    const destino = rutaRelativa.replace(/^\//, ''); // "chainsawman/01.jpg"

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(destino, buffer, {
        contentType: detectarContentType(rutaLocal),
        upsert: true, // sobreescribe si ya existe -> el script se puede re-correr
        cacheControl: '31536000', // 1 año: las portadas casi no cambian, así el navegador no las vuelve a pedir
      });

    if (error) {
      console.error(`  ❌ Error subiendo ${destino}:`, error.message);
      if (error.cause) console.error('     Causa:', error.cause);
      return null; // falla real: no seguir como si nada
    }
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(rutaRelativa.replace(/^\//, ''));
  return data.publicUrl;
}

async function mangaYaExiste(titulo) {
  const { data } = await supabase.from('mangas').select('id').eq('titulo', titulo).maybeSingle();
  return data?.id ?? null;
}

async function migrarManga(manga, index) {
  console.log(`\n[${index + 1}/${mangas.length}] ${manga.titulo}`);

  const idExistente = await mangaYaExiste(manga.titulo);
  if (idExistente) {
    console.log(`  ⏭️  Ya existe en la base (id=${idExistente}), se omite.`);
    return;
  }

  console.log('  → Subiendo portada...');
  const portadaUrl = await subirImagen(manga.portadaUrl);

  if (!portadaUrl) {
    console.error('  🛑 No se pudo subir la portada, se omite este manga por completo (no se insertó nada incompleto). Corrígelo y vuelve a correr el script.');
    return;
  }

  const { data: mangaInsertado, error: errorManga } = await supabase
    .from('mangas')
    .insert({
      titulo: manga.titulo,
      autor: manga.autor,
      tipo_publicacion: manga.tipoPublicacion,
      sinopsis: manga.sinopsis,
      portada_url: portadaUrl,
      generos: manga.generos,
      estado: manga.estado,
    })
    .select('id')
    .single();

  if (errorManga) {
    console.error('  ❌ Error insertando el manga:', errorManga.message);
    if (errorManga.cause) console.error('     Causa:', errorManga.cause);
    return;
  }

  console.log(`  → Subiendo ${manga.tomos.length} tomos...`);
  const tomosPayload = [];
  for (let i = 0; i < manga.tomos.length; i++) {
    const tomo = manga.tomos[i];
    const imagenUrl = await subirImagen(tomo.imagenUrl);
    if (!imagenUrl) {
      console.error(`  ⚠️  Se omite el tomo "${tomo.numero}" (falló la subida de su imagen).`);
      continue;
    }
    tomosPayload.push({
      manga_id: mangaInsertado.id,
      numero: tomo.numero,
      imagen_url: imagenUrl,
      precio: tomo.precio,
      estado: tomo.estado,
      orden: i,
    });
  }

  const { error: errorTomos } = await supabase.from('tomos').insert(tomosPayload);
  if (errorTomos) {
    console.error('  ❌ Error insertando tomos:', errorTomos.message);
    return;
  }

  console.log('  ✅ Migrado correctamente.');
}

async function main() {
  console.log(`Migrando ${mangas.length} mangas hacia Supabase...`);
  for (let i = 0; i < mangas.length; i++) {
    await migrarManga(mangas[i], i);
  }
  console.log('\n🎉 Migración completada.');
}

main();
