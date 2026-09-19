// Importamos el formulario interactivo
// que acabamos de crear.
import LoginForm from "./login-form";


// Esta página representa la ruta /login.
//
// No necesita "use client" porque ella misma
// no tiene interacción; solamente muestra
// el componente LoginForm.
export default function LoginPage() {

  return (
    // Contenedor principal de la pantalla.
    <main className="flex min-h-screen flex-col items-center justify-center p-8">

      {/* Título */}
      <h1 className="mb-6 text-3xl font-bold">
        Iniciar sesión
      </h1>

      {/* Formulario interactivo */}
      <LoginForm />

    </main>
  );
}