// Cliente de Supabase para trabajar desde el servidor.
import { createClient } from "@/lib/supabase/server";

// redirect protege la página si no existe sesión.
// notFound muestra la página 404 si la sala no existe.
import { notFound, redirect } from "next/navigation";

// Zod nos ayudará a validar que el ID recibido
// realmente tenga formato UUID.
import { z } from "zod";


// Esta página recibe el roomId desde la URL.
//
// En versiones actuales de Next.js,
// params se obtiene de forma asíncrona.
type RoomPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};


export default async function RoomPage({
  params,
}: RoomPageProps) {

  // Obtenemos el ID que venía en la URL.
  const { roomId } = await params;


  /*
    Validamos el ID antes de enviarlo a Supabase.

    Nuestra base de datos utiliza UUID para los IDs,
    así que una URL inventada como /rooms/gato
    no debería llegar directamente a la consulta.
  */
  const idResult = z.string().uuid().safeParse(roomId);

  if (!idResult.success) {
    notFound();
  }


  // Creamos nuestra conexión con Supabase.
  const supabase = await createClient();


  /*
    Primero comprobamos quién tiene la sesión.

    Igual que hicimos con /dashboard:
    esta página también debe ser privada.
  */
  const {
    data: { user },
  } = await supabase.auth.getUser();


  // Sin usuario autenticado → login.
  if (!user) {
    redirect("/login");
  }


  /*
    Buscamos la sala cuyo ID venía en la URL.

    También exigimos is_active = true porque
    los miembros solamente deben utilizar salas activas.
  */
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, name, capacity")
    .eq("id", idResult.data)
    .eq("is_active", true)
    .maybeSingle();


  /*
    Si Supabase devuelve un error o la sala no existe,
    mostramos un 404.

    Esto también cubre una sala que haya sido desactivada.
  */
  if (roomError || !room) {
    notFound();
  }


  return (
    <main className="p-8">

      {/* Información de la sala obtenida desde Supabase */}
      <h1 className="text-3xl font-bold">
        {room.name}
      </h1>

      <p className="mt-4">
        Capacidad: {room.capacity} personas
      </p>


      {/* Todavía no consultamos horarios.
          Ese será nuestro siguiente paso. */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold">
          Disponibilidad
        </h2>

        <p className="mt-2">
          Selección de fecha próximamente.
        </p>
      </section>

    </main>
  );
}