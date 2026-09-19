"use client";

// useActionState conecta nuestro formulario
// con la Server Action login().
import { useActionState } from "react";

// Importamos la acción y el tipo del estado.
import { login, type LoginState } from "./actions";


// Antes de enviar el formulario,
// todavía no existe ningún error.
const initialState: LoginState = {
  error: null,
};


export default function LoginForm() {

  /*
    state:
    contiene el resultado más reciente del servidor.

    formAction:
    función que ejecutaremos al enviar el formulario.

    pending:
    true mientras esperamos la respuesta del servidor.
  */
  const [state, formAction, pending] =
    useActionState(login, initialState);


  return (
    // Cuando se envía el formulario,
    // React ejecuta nuestra Server Action.
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-4"
    >

      {/* Correo electrónico */}
      <div>
        <label
          htmlFor="email"
          className="block font-medium"
        >
          Correo electrónico
        </label>

        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded border p-2"
        />
      </div>


      {/* Contraseña */}
      <div>
        <label
          htmlFor="password"
          className="block font-medium"
        >
          Contraseña
        </label>

        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="mt-1 w-full rounded border p-2"
        />
      </div>


      {/* Si el servidor devuelve un error,
          lo mostramos debajo del formulario. */}
      {state.error && (
        <p className="text-sm text-red-600">
          {state.error}
        </p>
      )}


      {/* Evitamos que el usuario presione el botón
          muchas veces mientras Supabase responde. */}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending
          ? "Iniciando sesión..."
          : "Iniciar sesión"}
      </button>

    </form>
  );
}