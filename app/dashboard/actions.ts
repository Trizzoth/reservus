"use server";

// Importamos nuestro cliente de Supabase para servidor.
// Este cliente tiene acceso a las cookies de la sesión actual.
import { createClient } from "@/lib/supabase/server";

// redirect nos permitirá mandar al usuario al login
// después de cerrar su sesión.
import { redirect } from "next/navigation";


// Esta Server Action cerrará la sesión del usuario.
export async function logout() {

  // Creamos la conexión con Supabase desde el servidor.
  const supabase = await createClient();

  // signOut elimina la sesión actual de Supabase.
  // Esto también provoca que las cookies de autenticación
  // dejen de representar una sesión válida.
  await supabase.auth.signOut();

  // Una vez cerrada la sesión,
  // enviamos al usuario nuevamente al login.
  redirect("/login");
}