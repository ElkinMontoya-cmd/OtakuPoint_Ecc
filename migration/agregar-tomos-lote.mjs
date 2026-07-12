// =====================================================================
// agregar-tomos-lote.mjs
// ---------------------------------------------------------------------
// Para cuando salieron VARIOS tomos nuevos de golpe — ya sea de un
// mismo manga o de varios mangas distintos que ya están en tu catálogo.
//
// CÓMO USARLO
// ---------------------------------------------------------------------
// 1) Coloca las imágenes de los tomos nuevos en la carpeta de public/
//    de cada manga correspondiente (misma carpeta donde ya están sus
//    tomos anteriores).
//
// 2) Edita el arreglo MANGAS_CON_TOMOS_NUEVOS de más abajo: un bloque
//    por cada manga, con la lista de tomos nuevos que le vas a agregar.
//
// 3) Corre, desde la carpeta migration/:
//
//      node agregar-tomos-lote.mjs
//
// Es re-ejecutable sin problema: si un tomo con ese mismo "numero" ya
// existe para ese manga, lo salta y sigue con los demás.
// =====================================================================

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

// =====================================================================
// ✏️  EDITA ESTA PARTE: un bloque por cada manga que tenga tomos nuevos
// =====================================================================
const MANGAS_CON_TOMOS_NUEVOS = [{
    tituloManga: 'SUMMERTIME RENDERING',
    carpeta: 'summertime-rendering',
    tomosNuevos: [
        { numero: 'Volumen 06', archivo: '06.jpg', precio: 16.5, estado: 'RESERVA' },
        { numero: 'Volumen 07', archivo: '07.jpg', precio: 16.5, estado: 'RESERVA' },
    ],
}, ];
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

async function subirImagen(carpeta, archivo) {
    const rutaLocal = path.join(PUBLIC_DIR, carpeta, archivo);

    if (!fs.existsSync(rutaLocal)) {
        throw new Error(`No encontré el archivo: ${rutaLocal}`);
    }

    const buffer = fs.readFileSync(rutaLocal);
    const destino = `${carpeta}/${archivo}`;

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

async function procesarManga(mangaConfig, index, total) {
    console.log(`\n[${index + 1}/${total}] ${mangaConfig.tituloManga}`);

    const { data: manga, error: errorBusqueda } = await supabase
        .from('mangas')
        .select('id, tomos(id, numero, orden)')
        .eq('titulo', mangaConfig.tituloManga)
        .maybeSingle();

    if (errorBusqueda || !manga) {
        console.error(`  ❌ No encontré ningún manga con el título exacto "${mangaConfig.tituloManga}". Se omite.`);
        return;
    }

    let siguienteOrden = manga.tomos.length > 0 ?
        Math.max(...manga.tomos.map((t) => t.orden)) + 1 :
        0;

    const numerosExistentes = new Set(manga.tomos.map((t) => t.numero));

    for (const tomo of mangaConfig.tomosNuevos) {
        if (numerosExistentes.has(tomo.numero)) {
            console.log(`  ⏭️  "${tomo.numero}" ya existe, se omite.`);
            continue;
        }

        try {
            console.log(`  → Subiendo "${tomo.numero}"...`);
            const imagenUrl = await subirImagen(mangaConfig.carpeta, tomo.archivo);

            const { error: errorInsertar } = await supabase.from('tomos').insert({
                manga_id: manga.id,
                numero: tomo.numero,
                imagen_url: imagenUrl,
                precio: tomo.precio,
                estado: tomo.estado,
                orden: siguienteOrden,
            });

            if (errorInsertar) {
                throw new Error(errorInsertar.message);
            }

            siguienteOrden++;
            console.log(`  ✅ "${tomo.numero}" agregado.`);
        } catch (err) {
            console.error(`  ❌ Error con "${tomo.numero}": ${err.message}`);
        }
    }
}

async function main() {
    console.log(`Procesando ${MANGAS_CON_TOMOS_NUEVOS.length} manga(s)...`);

    for (let i = 0; i < MANGAS_CON_TOMOS_NUEVOS.length; i++) {
        await procesarManga(MANGAS_CON_TOMOS_NUEVOS[i], i, MANGAS_CON_TOMOS_NUEVOS.length);
    }

    console.log('\n🎉 Listo.');
}

main();