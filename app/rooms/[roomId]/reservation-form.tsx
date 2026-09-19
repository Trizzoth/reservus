"use client";

// useActionState conecta el formulario del navegador
// con la Server Action createReservation() que acabamos de crear.
import { useActionState } from "react";

// Importamos la acción del servidor y el tipo
// que define la respuesta que recibiremos.
import {
  createReservation,
  type ReservationState,
} from "./actions";


// Estado inicial del formulario.
//
// Al principio:
// - todavía no se creó ninguna reserva
// - tampoco existe ningún error
const initialState: ReservationState = {
  success: false,
  error: null,
};


// Estos son los datos que recibirá este componente
// desde la página de la sala.
type ReservationFormProps = {
  roomId: string;
  defaultDate: string;
};


export default function ReservationForm({
  roomId,
  defaultDate,
}: ReservationFormProps) {

  /*
    useActionState conecta React con nuestra Server Action.

    state:
    contiene el último resultado del servidor.

    formAction:
    se ejecuta cuando enviamos el formulario.

    pending:
    indica si estamos esperando la respuesta del servidor.
  */
  const [state, formAction, pending] =
    useActionState(
      createReservation,
      initialState
    );


  return (
    /*
      Cuando el usuario envía este formulario,
      React ejecutará createReservation()
      en el servidor.
    */
    <form
      action={formAction}
      className="mt-6 flex max-w-md flex-col gap-4"
    >

      {/*
        El usuario no necesita escribir el ID de la sala.

        Como ya estamos dentro de /rooms/[roomId],
        enviamos ese ID de forma oculta al servidor.
      */}
      <input
        type="hidden"
        name="roomId"
        value={roomId}
      />


      {/* Fecha de la reserva */}
      <div>
        <label
          htmlFor="reservation-date"
          className="block font-medium"
        >
          Fecha
        </label>

        <input
          id="reservation-date"
          name="date"
          type="date"
          required
          defaultValue={defaultDate}
          className="mt-1 w-full rounded border p-2"
        />
      </div>


      {/*
        Hora de inicio.

        min y max ayudan al usuario desde el navegador,
        pero recuerde que PostgreSQL también valida
        el horario real.
      */}
      <div>
        <label
          htmlFor="startTime"
          className="block font-medium"
        >
          Hora de inicio
        </label>

        <input
          id="startTime"
          name="startTime"
          type="time"
          required
          min="07:00"
          max="20:00"

          /*
            step está medido en segundos.

            1800 segundos = 30 minutos.

            Esto ayuda a cumplir RN02:
            bloques de 30 minutos.
          */
          step="1800"
          className="mt-1 w-full rounded border p-2"
        />
      </div>


      {/*
        Duración de la reserva.

        RN03 permite:
        mínimo 1 hora
        máximo 3 horas

        Usamos minutos porque nuestra Server Action
        hace los cálculos utilizando minutos.
      */}
      <div>
        <label
          htmlFor="duration"
          className="block font-medium"
        >
          Duración
        </label>

        <select
          id="duration"
          name="duration"
          defaultValue="60"
          className="mt-1 w-full rounded border p-2"
        >
          <option value="60">
            1 hora
          </option>

          <option value="90">
            1 hora 30 minutos
          </option>

          <option value="120">
            2 horas
          </option>

          <option value="150">
            2 horas 30 minutos
          </option>

          <option value="180">
            3 horas
          </option>
        </select>
      </div>


      {/*
        Si createReservation() devuelve un error,
        lo mostramos al usuario.

        Ejemplos:
        - horario ocupado
        - límite semanal
        - poca anticipación
        - sala desactivada
      */}
      {state.error && (
        <p className="text-sm text-red-600">
          {state.error}
        </p>
      )}


      {/*
        Si PostgreSQL aceptó la reserva,
        mostramos una confirmación.
      */}
      {state.success && (
        <p className="text-sm font-medium">
          Reserva creada correctamente.
        </p>
      )}


      {/*
        Mientras el servidor procesa la solicitud,
        desactivamos el botón para evitar
        que el usuario mande la misma reserva varias veces.
      */}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending
          ? "Reservando..."
          : "Crear reserva"}
      </button>

    </form>
  );
}