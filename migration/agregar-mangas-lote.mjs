import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

// =====================================================================
// ✏️  EDITA ESTA PARTE: un objeto por cada manga a agregar
// =====================================================================
const MANGAS = [{
        titulo: 'KAGUYA-SAMA: LOVE IS WAR',
        autor: 'Aka Akasaka',
        tipoPublicacion: 'Tomos B6 con Sobrecubierta e incluye paginas a color',
        sinopsis: 'En la prestigiosa academia Shuchiin, Miyuki Shirogane y Kaguya Shinomiya son los dos estudiantes más brillantes y forman el consejo estudiantil más admirado. Entre ambos crece una atracción mutua, pero el orgullo de los dos les impide confesar sus sentimientos primero: quien se declare antes, "pierde". Así, cada día se convierte en una guerra de ingenio y estrategia para hacer que el otro caiga rendido de amor.',
        generos: ['Comedia', 'Romance', 'Escolar'],
        estado: 'RESERVA',
        carpeta: 'kaguya',
        portada: '01.jpg',
        tomos: [
            { numero: 'Volumen 1', archivo: '01.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 2', archivo: '02.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 3', archivo: '03.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 4', archivo: '04.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 5', archivo: '05.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 6', archivo: '06.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 7', archivo: '07.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 8', archivo: '08.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 9', archivo: '09.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 10', archivo: '10.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 11', archivo: '11.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 12', archivo: '12.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 13', archivo: '13.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 14', archivo: '14.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 15', archivo: '15.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 16', archivo: '16.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 17', archivo: '17.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 18', archivo: '18.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 19', archivo: '19.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 20', archivo: '20.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 21', archivo: '21.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 22', archivo: '22.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 23', archivo: '23.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 24', archivo: '24.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 25', archivo: '25.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 26', archivo: '26.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 27', archivo: '27.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 28', archivo: '28.jpg', precio: 15.50, estado: 'RESERVA' }
        ],
    },
    {
        titulo: 'ONE PUNCH MAN',
        autor: 'ONE / Yusuke Murata',
        tipoPublicacion: 'Tomos con Sobrecubierta',
        sinopsis: 'Saitama es un héroe que, tras un entrenamiento extremo, se volvió tan poderoso que puede derrotar a cualquier enemigo de un solo golpe. Su verdadero problema ya no es encontrar rivales a su altura, sino lidiar con el aburrimiento y la falta de reconocimiento que trae ser demasiado fuerte.',
        generos: ['Acción', 'Comedia', 'Superhéroes'],
        estado: 'RESERVA',
        carpeta: 'onepunchman',
        portada: '01.jpg',
        tomos: [
            { numero: 'Volumen 1', archivo: '01.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 2', archivo: '02.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 3', archivo: '03.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 4', archivo: '04.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 5', archivo: '05.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 6', archivo: '06.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 7', archivo: '07.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 8', archivo: '08.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 9', archivo: '09.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 10', archivo: '10.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 11', archivo: '11.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 12', archivo: '12.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 13', archivo: '13.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 14', archivo: '14.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 15', archivo: '15.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 16', archivo: '16.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 17', archivo: '17.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 18', archivo: '18.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 19', archivo: '19.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 20', archivo: '20.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 21', archivo: '21.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 22', archivo: '22.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 23', archivo: '23.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 24', archivo: '24.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 25', archivo: '25.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 26', archivo: '26.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 27', archivo: '27.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 28', archivo: '28.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 29', archivo: '29.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 30', archivo: '30.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 31', archivo: '31.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 32', archivo: '32.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 33', archivo: '33.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 34', archivo: '34.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 35', archivo: '35.jpg', precio: 15.50, estado: 'RESERVA' }
        ],
    },
    {
        titulo: 'DR. STONE',
        autor: 'Riichiro Inagaki / Boichi',
        tipoPublicacion: 'Tomos con Sobrecubierta',
        sinopsis: 'Toda la humanidad queda petrificada de golpe por un fenómeno misterioso. Miles de años después, el genio de la ciencia Senku Ishigami despierta decidido a reconstruir la civilización desde cero, usando el conocimiento científico como su única arma contra la naturaleza y contra quienes prefieren que el mundo siga siendo de piedra.',
        generos: ['Aventura', 'Ciencia Ficción', 'Shonen'],
        estado: 'RESERVA',
        carpeta: 'drstone',
        portada: '01.jpg',
        tomos: [
            { numero: 'Volumen 1', archivo: '01.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 2', archivo: '02.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 3', archivo: '03.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 4', archivo: '04.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 5', archivo: '05.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 6', archivo: '06.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 7', archivo: '07.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 8', archivo: '08.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 9', archivo: '09.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 10', archivo: '10.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 11', archivo: '11.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 12', archivo: '12.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 13', archivo: '13.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 14', archivo: '14.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 15', archivo: '15.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 16', archivo: '16.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 17', archivo: '17.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 18', archivo: '18.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 19', archivo: '19.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 20', archivo: '20.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 21', archivo: '21.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 22', archivo: '22.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 23', archivo: '23.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 24', archivo: '24.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 25', archivo: '25.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 26', archivo: '26.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 27', archivo: '27.jpg', precio: 15.50, estado: 'RESERVA' }
        ],
    },
    {
        titulo: 'CITRUS',
        autor: 'Saburouta',
        tipoPublicacion: 'Tomos B6 con Sobrecubierta e incluye paginas a color',
        sinopsis: 'Yuzu, una adolescente extrovertida, se muda a una nueva ciudad y descubre que su nueva escuela es extremadamente estricta. Ahí conoce a Mei, la fría presidenta del consejo estudiantil, que además resulta ser su nueva hermanastra tras el matrimonio de sus padres. Entre choques de personalidad, surge una relación mucho más compleja de lo que ninguna esperaba.',
        generos: ['Romance', 'Drama', 'Yuri'],
        estado: 'RESERVA',
        carpeta: 'citrus',
        portada: '01.jpg',
        tomos: [
            { numero: 'Volumen 1', archivo: '01.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 2', archivo: '02.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 3', archivo: '03.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 4', archivo: '04.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 5', archivo: '05.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 6', archivo: '06.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 7', archivo: '07.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 8', archivo: '08.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 9', archivo: '09.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 10', archivo: '10.jpg', precio: 15.50, estado: 'RESERVA' }
        ],
    },
    {
        titulo: 'KOMI-SAN NO PUEDE COMUNICARSE',
        autor: 'Tomohito Oda',
        tipoPublicacion: 'Tomos 2en1, B6 y con Sobrecubierta. Incluye paginas a color y el Tomo 18 es 3en1',
        sinopsis: 'Komi es la chica más admirada de su clase: elegante, hermosa y aparentemente perfecta. Lo que nadie sabe es que sufre una severa ansiedad social que le impide comunicarse con normalidad. Con la ayuda de su compañero Tadano, se propone una meta poco a poco: hacer cien amigos antes de graduarse.',
        generos: ['Comedia', 'Escolar', 'Slice of Life'],
        estado: 'RESERVA',
        carpeta: 'komisan',
        portada: '01.jpg',
        tomos: [
            { numero: 'Volumen 1', archivo: '01.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 2', archivo: '02.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 3', archivo: '03.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 4', archivo: '04.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 5', archivo: '05.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 6', archivo: '06.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 7', archivo: '07.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 8', archivo: '08.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 9', archivo: '09.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 10', archivo: '10.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 11', archivo: '11.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 12', archivo: '12.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 13', archivo: '13.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 14', archivo: '14.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 15', archivo: '15.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 16', archivo: '16.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 17', archivo: '17.jpg', precio: 25.5, estado: 'RESERVA' },
            { numero: 'Volumen 18', archivo: '18.jpg', precio: 31.5, estado: 'RESERVA' }
        ],
    },
    {
        titulo: 'KENGAN ASHURA',
        autor: 'Yabako Sandrovich / Daromeon',
        tipoPublicacion: 'Tomos B6 con Sobrecubierta',
        sinopsis: 'En un mundo donde las grandes corporaciones resuelven sus disputas a través de combates a muerte entre luchadores contratados, Tokita Ohma, un joven de fuerza descomunal, es reclutado por una empresa para representarla en el torneo Kengan, un brutal campeonato clandestino donde cada pelea puede ser la última.',
        generos: ['Acción', 'Artes Marciales', 'Seinen'],
        estado: 'RESERVA',
        carpeta: 'kenganashura',
        portada: '01.jpg',
        tomos: [
            { numero: 'Volumen 1', archivo: '01.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 2', archivo: '02.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 3', archivo: '03.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 4', archivo: '04.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 5', archivo: '05.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 6', archivo: '06.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 7', archivo: '07.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 8', archivo: '08.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 9', archivo: '09.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 10', archivo: '10.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 11', archivo: '11.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 12', archivo: '12.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 13', archivo: '13.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 14', archivo: '14.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 15', archivo: '15.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 16', archivo: '16.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 17', archivo: '17.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 18', archivo: '18.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 19', archivo: '19.jpg', precio: 15.50, estado: 'RESERVA' }
        ],
    },
    {
        titulo: 'MAGICAL GIRL OF THE END',
        autor: 'Kentaro Sato',
        tipoPublicacion: 'Tomos con Sobrecubierta',
        sinopsis: 'Un fenómeno global convierte a miles de niñas en "chicas mágicas" que, en lugar de proteger a la humanidad, se dedican a exterminarla. En medio de este apocalipsis, un grupo de sobrevivientes debe encontrar la forma de resistir contra una amenaza que combina lo tierno con lo aterrador.',
        generos: ['Terror', 'Acción', 'Seinen'],
        estado: 'RESERVA',
        carpeta: 'magicalgirloftheend',
        portada: '01.jpg',
        tomos: [
            { numero: 'Volumen 1', archivo: '01.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 2', archivo: '02.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 3', archivo: '03.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 4', archivo: '04.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 5', archivo: '05.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 6', archivo: '06.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 7', archivo: '07.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 8', archivo: '08.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 9', archivo: '09.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 10', archivo: '10.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 11', archivo: '11.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 12', archivo: '12.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 13', archivo: '13.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 14', archivo: '14.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 15', archivo: '15.jpg', precio: 15.50, estado: 'RESERVA' },
            { numero: 'Volumen 16', archivo: '16.jpg', precio: 15.50, estado: 'RESERVA' }
        ],
    },
];
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

async function subirImagen(carpeta, nombreArchivo) {
    const rutaLocal = path.join(PUBLIC_DIR, carpeta, nombreArchivo);

    if (!fs.existsSync(rutaLocal)) {
        throw new Error(`No encontré el archivo: ${rutaLocal}`);
    }

    const buffer = fs.readFileSync(rutaLocal);
    const destino = `${carpeta}/${nombreArchivo}`;

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

async function agregarManga(manga, index, total) {
    console.log(`\n[${index + 1}/${total}] ${manga.titulo}`);

    const { data: existente } = await supabase
        .from('mangas')
        .select('id')
        .eq('titulo', manga.titulo)
        .maybeSingle();

    if (existente) {
        console.log(`  ⏭️  Ya existe (id=${existente.id}), se omite.`);
        return;
    }

    try {
        console.log('  → Subiendo portada...');
        const portadaUrl = await subirImagen(manga.carpeta, manga.portada);

        console.log('  → Insertando el manga...');
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

        if (errorManga || !mangaInsertado) {
            const detalle = errorManga && errorManga.message ? errorManga.message : 'No se pudo insertar el manga.';
            throw new Error(detalle);
        }

        console.log(`  → Subiendo ${manga.tomos.length} tomos...`);
        const tomosPayload = [];
        for (let i = 0; i < manga.tomos.length; i++) {
            const tomo = manga.tomos[i];
            const url = await subirImagen(manga.carpeta, tomo.archivo);
            tomosPayload.push({
                manga_id: mangaInsertado.id,
                numero: tomo.numero,
                imagen_url: url,
                precio: tomo.precio,
                estado: tomo.estado,
                orden: i,
            });
        }

        const { error: errorTomos } = await supabase.from('tomos').insert(tomosPayload);
        if (errorTomos) {
            throw new Error(errorTomos.message);
        }

        console.log(`  ✅ Agregado correctamente con ${manga.tomos.length} tomo(s).`);
    } catch (err) {
        console.error(`  ❌ Error con "${manga.titulo}": ${err.message}`);
    }
}

async function main() {
    console.log(`Agregando ${MANGAS.length} mangas nuevos...`);
    for (let i = 0; i < MANGAS.length; i++) {
        await agregarManga(MANGAS[i], i, MANGAS.length);
    }
    console.log('\n🎉 Listo.');
}

main();