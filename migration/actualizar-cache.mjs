// =====================================================================
// actualizar-cache.mjs
// ---------------------------------------------------------------------
// Las imágenes que ya migraste quedaron con el cache-control por
// defecto de Supabase (1 hora). Este script las re-sube tal cual
// (mismo contenido) pero con cache-control de 1 año, para que en
// visitas repetidas el navegador NO vuelva a descargarlas.
//
// Es un "mantenimiento" que corres UNA VEZ sobre lo ya migrado.
// De aquí en adelante, migrate.mjs ya sube todo con el cache-control
// correcto automáticamente.
//
// USO: node actualizar-cache.mjs   (misma carpeta migration/, mismo .env)
// =====================================================================

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || 'mangas';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const MIME_POR_EXTENSION = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

function detectarContentType(ruta) {
  const ext = ruta.slice(ruta.lastIndexOf('.')).toLowerCase();
  return MIME_POR_EXTENSION[ext] || 'application/octet-stream';
}

async function listarTodo(prefijo = '') {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefijo, { limit: 1000 });
  if (error) {
    console.error(`Error listando "${prefijo}":`, error.message);
    return [];
  }

  let archivos = [];
  for (const item of data) {
    const rutaCompleta = prefijo ? `${prefijo}/${item.name}` : item.name;
    if (item.id === null) {
      // es una "carpeta" (no tiene id) -> recorrerla también
      archivos = archivos.concat(await listarTodo(rutaCompleta));
    } else {
      archivos.push(rutaCompleta);
    }
  }
  return archivos;
}

async function main() {
  console.log('Listando archivos del bucket...');
  const archivos = await listarTodo();
  console.log(`Encontrados ${archivos.length} archivos. Actualizando cache-control...\n`);

  let ok = 0;
  let fallidos = 0;

  for (const ruta of archivos) {
    const { data: descarga, error: errorDescarga } = await supabase.storage.from(BUCKET).download(ruta);
    if (errorDescarga) {
      console.error(`❌ No pude descargar ${ruta}:`, errorDescarga.message);
      fallidos++;
      continue;
    }

    const buffer = Buffer.from(await descarga.arrayBuffer());

    const { error: errorSubida } = await supabase.storage.from(BUCKET).upload(ruta, buffer, {
      contentType: detectarContentType(ruta),
      upsert: true,
      cacheControl: '31536000',
    });

    if (errorSubida) {
      console.error(`❌ No pude actualizar ${ruta}:`, errorSubida.message);
      fallidos++;
    } else {
      ok++;
      process.stdout.write(`\r✅ Actualizados: ${ok}/${archivos.length}`);
    }
  }

  console.log(`\n\nListo. ${ok} actualizados, ${fallidos} con error.`);
}

main();
