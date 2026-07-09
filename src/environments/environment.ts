export const environment = {
  production: false,
  supabaseUrl: 'https://vpdldnyplavdthxzvdub.supabase.co',
  // Esta es la "anon key" (clave pública). Es SEGURO tenerla en el
  // frontend: solo permite lo que las políticas RLS de la base dejan
  // hacer (en tu caso, solo LEER el catálogo). Nunca uses aquí la
  // "service_role key".
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZGxkbnlwbGF2ZHRoeHp2ZHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NDgyNDgsImV4cCI6MjA5OTEyNDI0OH0.xeSKIQrigU76JFN72r5Tl0-xboGVGWXLscmMZektSH8',
};
