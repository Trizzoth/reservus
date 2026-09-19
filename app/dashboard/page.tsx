// Cliente Supabase del servidor.
// Gracias a las cookies puede saber
// qué usuario tiene una sesión activa.
import { createClient } from "@/lib/supabase/server";

// redirect nos permite expulsar a alguien
// que intente entrar sin haber iniciado sesión.
import { redirect } from "next/navigation";


export default async function DashboardPage() {

  // Conexión con Supabase desde el servidor.
  const supabase = await createClient();


  /*
    Preguntamos a Supabase quién es el usuario
    asociado a la sesión actual.

    No estamos confiando en un ID enviado por
    el navegador.
  */
  const {
    data: { user },
  } = await supabase.auth.getUser();


  // Si no existe usuario autenticado,
  // no permitimos entrar al dashboard.
  if (!user) {
    redirect("/login");
  }


  return (
    <main className="p-8">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      {/* Mostramos el correo para comprobar
          que la sesión está funcionando. */}
      <p className="mt-4">
        Sesión iniciada como:
        {" "}
        {user.email}
      </p>

    </main>
  );
}