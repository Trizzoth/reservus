// Importamos el formulario de registro que creamos antes.
// Este componente contiene la parte interactiva del formulario.
import RegisterForm from "./register-form";

// Esta función representa la página /register.
// Como no tiene "use client", Next.js la trata como Server Component.
export default function RegisterPage() {
  return (
    // Contenedor principal de la página.
    // Tailwind se encarga del diseño y centrado.
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      
      {/* Título de la página */}
      <h1 className="mb-6 text-3xl font-bold">
        Crear cuenta
      </h1>

      {/* Aquí insertamos el formulario interactivo */}
      <RegisterForm />
    </main>
  );
}