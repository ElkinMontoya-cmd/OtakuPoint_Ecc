// =====================================================================
// agregar-tomo.mjs
// ---------------------------------------------------------------------
// Para cuando un manga que YA está en tu catálogo saca un tomo nuevo.
// Busca el manga por su título exacto y le agrega el tomo al final,
// sin tocar los tomos que ya tiene.
//
// CÓMO USARLO
// ---------------------------------------------------------------------
// 1) Coloca la imagen del tomo nuevo en la misma carpeta de public/
//    donde están las demás imágenes de ese manga. Ejemplo, si el
//    manga ya tiene public/bleach/01.jpg ... 74.jpg, y sacó el tomo 75:
//
//      public/bleach/75.jpg
//
// 2) Edita el bloque TOMO_NUEVO de más abajo.
//
// 3) Corre, desde la carpeta migration/:
//
//      node agregar-tomo.mjs
// =====================================================================

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

// =====================================================================
// ✏️  EDITA SOLO ESTA PARTE
// =====================================================================
const TOMO_NUEVO = {
  // Título EXACTO tal como está guardado en tu catálogo (mayúsculas incluidas)
  tituloManga: 'BLEACH',

  // Carpeta dentro de public/ donde están las imágenes de este manga
  carpeta: 'bleach',

  // Datos del tomo nuevo
  numero: 'Volumen 75',
  archivo: '75.jpg',
  precio: 15.5,
  estado: 'RESERVA', // 'STOCK' | 'PREVENTA' | 'RESERVA'
};
// =====================================================================
// No hace falta tocar nada de aquí para abajo
// =====================================================================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || 'mangas';
const PUBLIC_DIR = process.env.PUBLIC_DIR || '../public';

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

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en tu .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function subirImagen() {
  const rutaLocal = path.join(PUBLIC_DIR, TOMO_NUEVO.carpeta, TOMO_NUEVO.archivo);

  if (!fs.existsSync(rutaLocal)) {
    throw new Error(`No encontré el archivo: ${rutaLocal}`);
  }

  const buffer = fs.readFileSync(rutaLocal);
  const destino = `${TOMO_NUEVO.carpeta}/${TOMO_NUEVO.archivo}`;

  const { error } = await supabase.storage.from(BUCKET).upload(destino, buffer, {
    contentType: detectarContentType(rutaLocal),
    upsert: true,
    cacheControl: '31536000',
  });

  if (error) {
    throw new Error(`Error subiendo ${destino}: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(destino);
  return data.publicUrl;
}

async function main() {
  console.log(`Buscando "${TOMO_NUEVO.tituloManga}"...`);

  const { data: manga, error: errorBusqueda } = await supabase
    .from('mangas')
    .select('id, tomos(id, orden)')
    .eq('titulo', TOMO_NUEVO.tituloManga)
    .maybeSingle();

  if (errorBusqueda || !manga) {
    console.error(`❌ No encontré ningún manga con el título exacto "${TOMO_NUEVO.tituloManga}". Revisa que esté escrito igual que en tu catálogo.`);
    process.exit(1);
  }

  // Verifica que ese número de tomo no exista ya (evita duplicados)
  const { data: tomoExistente } = await supabase
    .from('tomos')
    .select('id')
    .eq('manga_id', manga.id)
    .eq('numero', TOMO_NUEVO.numero)
    .maybeSingle();

  if (tomoExistente) {
    console.error(`❌ "${TOMO_NUEVO.tituloManga}" ya tiene un tomo llamado "${TOMO_NUEVO.numero}". Nada que hacer.`);
    process.exit(1);
  }

  console.log('→ Subiendo imagen del tomo...');
  const imagenUrl = await subirImagen();

  // Calcula el siguiente "orden" para que quede al final de la lista
  const siguienteOrden = manga.tomos.length > 0
    ? Math.max(...manga.tomos.map((t) => t.orden)) + 1
    : 0;

  console.log('→ Insertando el tomo...');
  const { error: errorInsertar } = await supabase.from('tomos').insert({
    manga_id: manga.id,
    numero: TOMO_NUEVO.numero,
    imagen_url: imagenUrl,
    precio: TOMO_NUEVO.precio,
    estado: TOMO_NUEVO.estado,
    orden: siguienteOrden,
  });

  if (errorInsertar) {
    throw new Error(errorInsertar.message);
  }

  console.log(`\n✅ "${TOMO_NUEVO.numero}" agregado correctamente a "${TOMO_NUEVO.tituloManga}".`);
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
