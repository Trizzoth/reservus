// Cliente de Supabase para código que corre en el servidor.
import { createClient } from "@/lib/supabase/server";

// redirect protege la página y redirige si no hay sesión o no es admin.
import { redirect } from "next/navigation";

// Componentes de cliente para las pestañas de administración.
import AdminRooms from "./admin-rooms";
import AdminReservations from "./admin-reservations";

export default async function AdminPage() {
  // Creamos la conexión con Supabase desde el servidor.
  const supabase = await createClient();

  /*
    PRIMERA CONSULTA:
    verificamos quién tiene la sesión actual.
  */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sin sesión → login.
  if (!user) {
    redirect("/login");
  }

  /*
    SEGUNDA CONSULTA:
    obtenemos el perfil para comprobar el rol.
    Esta comprobación ocurre EN SERVIDOR, no en el navegador.
  */
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Si no hay perfil o no es admin → dashboard.
  if (profileError || !profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Panel de administración</h1>
      <p className="mt-4 text-gray-600">
        Bienvenido, administrador. Gestioná salas y reservas desde aquí.
      </p>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-2xl font-bold border-b pb-2">Salas</h2>
          <AdminRooms />
        </section>

        <section>
          <h2 className="text-2xl font-bold border-b pb-2">Reservas</h2>
          <AdminReservations />
        </section>
      </div>
    </main>
  );
}