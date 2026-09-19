"use client";

// useActionState nos permite ejecutar una Server Action
// y recibir de vuelta su estado: éxito, error y si está procesando.
import { useActionState } from "react";

// Importamos la acción de registro que ya creamos en actions.ts.
// También importamos el tipo RegisterState para que TypeScript
// sepa qué forma tiene el resultado del formulario.
import { register, type RegisterState } from "./actions";

// Estado inicial antes de que el usuario envíe el formulario.
const initialState: RegisterState = {
  success: false,
  error: null,
};

export default function RegisterForm() {
  /*
    useActionState conecta este formulario con la Server Action register().

    state:
    contiene el resultado más reciente de la acción.

    formAction:
    es la función que React ejecutará cuando enviemos el formulario.

    pending:
    indica si el formulario está esperando una respuesta del servidor.
  */
  const [state, formAction, pending] = useActionState(
    register,
    initialState
  );

  return (
    // Al enviar este formulario, React ejecuta formAction,
    // que a su vez llama a register() en el servidor.
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-4"
    >
      {/* Campo para el correo electrónico */}
      <div>
        <label htmlFor="email" className="block font-medium">
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

      {/* Campo para la contraseña */}
      <div>
        <label htmlFor="password" className="block font-medium">
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

      {/* Si la Server Action devuelve un error, lo mostramos aquí */}
      {state.error && (
        <p className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      {/* Si el registro fue exitoso, mostramos confirmación */}
      {state.success && (
        <p className="text-sm">
          Usuario registrado correctamente.
        </p>
      )}

      {/* Mientras el servidor procesa el registro,
          desactivamos el botón para evitar dobles envíos */}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
}