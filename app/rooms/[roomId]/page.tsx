// Cliente de Supabase para código que corre en el servidor.
import { createClient } from "@/lib/supabase/server";

// redirect protege la página.
// notFound muestra un 404 cuando la sala o el ID no son válidos.
import { notFound, redirect } from "next/navigation";

// Zod valida tanto el UUID de la sala
// como la fecha que llega desde la URL.
import { z } from "zod";


// La página recibe:
// - roomId desde /rooms/[roomId]
// - date desde ?date=AAAA-MM-DD
type RoomPageProps = {
  params: Promise<{
    roomId: string;
  }>;

  searchParams: Promise<{
    date?: string;
  }>;
};


// Regla para validar una fecha con formato AAAA-MM-DD.
//
// Ejemplo válido:
// 2026-09-19
const dateSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "La fecha no tiene un formato válido"
  );


export default async function RoomPage({
  params,
  searchParams,
}: RoomPageProps) {

  // Obtenemos el ID dinámico de la sala.
  const { roomId } = await params;

  // Obtenemos la fecha enviada mediante la URL.
  const { date } = await searchParams;


  /*
    VALIDACIÓN DEL ID

    Nuestra base utiliza UUID.
    Si alguien escribe /rooms/gato,
    detenemos el proceso y mostramos 404.
  */
  const idResult = z.string().uuid().safeParse(roomId);

  if (!idResult.success) {
    notFound();
  }


  // Creamos la conexión con Supabase.
  const supabase = await createClient();


  /*
    Verificamos que exista una sesión válida.

    Esta página continúa siendo privada,
    igual que /dashboard.
  */
  const {
    data: { user },
  } = await supabase.auth.getUser();


  // Sin sesión → login.
  if (!user) {
    redirect("/login");
  }


  /*
    Buscamos la sala solicitada.

    Solo permitimos mostrar salas activas.
  */
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, name, capacity")
    .eq("id", idResult.data)
    .eq("is_active", true)
    .maybeSingle();


  // Si la sala no existe o está desactivada,
  // mostramos 404.
  if (roomError || !room) {
    notFound();
  }


  /*
    Hasta que el usuario no seleccione una fecha,
    availability permanecerá como una lista vacía.
  */
  let availability: {
    start_at: string;
    end_at: string;
  }[] = [];

  let availabilityError: string | null = null;


  /*
    Solo consultamos la base de datos
    si existe una fecha en la URL.
  */
  if (date) {

    // Validamos la fecha antes de enviarla a PostgreSQL.
    const dateResult = dateSchema.safeParse(date);

    if (!dateResult.success) {
      availabilityError = "La fecha seleccionada no es válida.";
    } else {

      /*
        Llamamos a la función segura que creamos:

        get_room_availability()

        Esta función NO entrega información
        sobre quién hizo las reservas.

        Solamente devuelve:
        - start_at
        - end_at
      */
      const { data, error } = await supabase.rpc(
        "get_room_availability",
        {
          p_room_id: room.id,
          p_date: dateResult.data,
        }
      );


      if (error) {
        availabilityError =
          "No se pudo consultar la disponibilidad.";
      } else {

        /*
          Supabase puede devolver null.

          Si eso ocurre usamos [] para mantener
          availability siempre como una lista.
        */
        availability = data ?? [];
      }
    }
  }


  /*
    Esta función convierte una fecha guardada por
    Supabase en una hora legible de Costa Rica.

    Ejemplo:
    2026-09-19T16:00:00Z
           ↓
    10:00
  */
  function formatTime(value: string) {
    return new Intl.DateTimeFormat("es-CR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Costa_Rica",
    }).format(new Date(value));
  }


  return (
    <main className="p-8">

      {/* Información de la sala */}
      <h1 className="text-3xl font-bold">
        {room.name}
      </h1>

      <p className="mt-4">
        Capacidad: {room.capacity} personas
      </p>


      <section className="mt-10">

        <h2 className="text-2xl font-bold">
          Disponibilidad
        </h2>


        {/*
          Formulario para escoger el día.

          Como usa method="get", la fecha aparece
          en la URL como:

          ?date=2026-09-19

          Esto hace que Next.js vuelva a ejecutar
          esta página en el servidor.
        */}
        <form method="get" className="mt-6 flex gap-3">

          <input
            type="date"
            name="date"
            defaultValue={date ?? ""}
            required
            className="rounded border p-2"
          />

          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white"
          >
            Consultar
          </button>

        </form>


        {/* Si hubo un problema consultando,
            mostramos un mensaje de error. */}
        {availabilityError && (
          <p className="mt-6 text-red-600">
            {availabilityError}
          </p>
        )}


        {/*
          Si todavía no se ha seleccionado una fecha,
          damos una pequeña instrucción.
        */}
        {!date && (
          <p className="mt-6">
            Seleccioná una fecha para consultar los horarios.
          </p>
        )}


        {/*
          Si hay fecha y no encontramos reservas,
          significa que todavía no existen bloques ocupados.
        */}
        {date &&
          !availabilityError &&
          availability.length === 0 && (
            <p className="mt-6">
              No hay reservas activas para este día.
            </p>
          )}


        {/*
          Si existen reservas, mostramos únicamente
          los bloques ocupados.

          No mostramos usuario, email ni otros datos.
        */}
        {availability.length > 0 && (
          <div className="mt-6">

            <h3 className="font-semibold">
              Horarios ocupados:
            </h3>

            <ul className="mt-3 space-y-2">

              {availability.map((reservation) => (
                <li
                  key={`${reservation.start_at}-${reservation.end_at}`}
                  className="rounded border p-3"
                >
                  {formatTime(reservation.start_at)}
                  {" - "}
                  {formatTime(reservation.end_at)}
                </li>
              ))}

            </ul>

          </div>
        )}

      </section>

    </main>
  );
}