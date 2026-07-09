import { createClient } from '@supabase/supabase-js';
import { environment as environments } from '../environments/environment';

// Cliente único (singleton) reutilizado por todos los servicios de la app.
// Cualquier módulo nuevo que agregues (reseñas, eventos, usuarios, etc.)
// puede importar este mismo cliente en vez de crear uno nuevo.
export const supabase = createClient(
  environments.supabaseUrl,
  environments.supabaseAnonKey
);
