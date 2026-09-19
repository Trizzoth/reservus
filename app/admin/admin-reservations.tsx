// Server Component principal de la pestaña Reservas.
import { createClient } from "@/lib/supabase/server";
import AdminReservationsTable from "./admin-reservations-table";
import { Suspense } from "react";

// Componente principal de la pestaña Reservas (Server Component).
export default async function AdminReservations() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Gestión de reservas</h3>
      </div>

      <Suspense fallback={<p className="mt-4">Cargando reservas...</p>}>
        <AdminReservationsTable />
      </Suspense>
    </div>
  );
}