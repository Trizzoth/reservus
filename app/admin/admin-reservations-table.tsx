"use client";

import { useState, useEffect } from "react";
import { listReservations, type ReservationFilters } from "./actions";
import { useSearchParams, useRouter } from "next/navigation";

type Reservation = {
  id: string;
  room_id: string;
  room_name: string;
  user_email: string;
  start_at: string;
  end_at: string;
  status: "active" | "cancelled";
  cancel_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
};

const initialFilters: ReservationFilters = {
  room_id: undefined,
  user_id: undefined,
  status: "all",
  date_from: undefined,
  date_to: undefined,
};

function parseIsoDate(v: string | undefined): string | undefined {
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function AdminReservationsTable() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filters, setFilters] = useState<ReservationFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Hydrate filters from URL search params
  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());
    const roomId = sp.get("room");
    const status = sp.get("status");
    const dateFrom = sp.get("date_from");
    const dateTo = sp.get("date_to");

    // eslint-disable-line
setFilters((prev) => ({
      ...prev,
      room_id: roomId || undefined,
      status:
        status === "all"
          ? undefined
          : (status as "active" | "cancelled" | "all" | undefined),
      date_from: dateFrom ? parseIsoDate(dateFrom) : undefined,
      date_to: dateTo ? parseIsoDate(dateTo) : undefined,
    }));
  }, [searchParams]);
  // eslint-disable-next-line react-hooks/rules-of-hook

  const loadReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listReservations(filters);
      setReservations(data);
    } catch (e) {
      setError((e as Error).message ?? "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [JSON.stringify(filters) as string]);

  // Aplicar filtros a la UI
  const displayed = reservations.filter((r) => {
    if (filters.room_id && r.room_id !== filters.room_id) return false;
    if (filters.status && filters.status !== "all" && r.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="mt-4 space-y-6">
      <div className="rounded border p-4">
        <h3 className="text-xl font-semibold mb-4">Todas las reservas</h3>

        {/* Formulario de filtros */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sala</label>
            <select
              value={filters.room_id || ""}
              onChange={(e) => {
                const roomId = e.target.value || undefined;
                const newFilters = { ...filters, room_id: roomId };
                setFilters(newFilters);
                const sp = new URLSearchParams();
                if (roomId) sp.set("room", roomId);
                if (filters.status) sp.set("status", filters.status);
                if (filters.date_from) sp.set("date_from", filters.date_from);
                if (filters.date_to) sp.set("date_to", filters.date_to);
                router.push(`?${sp.toString()}`);
              }}
              className="mt-1 block w-full rounded border p-2"
            >
              <option value="">Todas las salas</option>
              {/* Las opciones de sala se poblarían aquí o se cargarían dinámicamente */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              value={filters.status || ""}
              onChange={(e) => {
                const status = e.target.value || "all";
                setFilters({ ...filters, status: status === "all" ? undefined : (status as "active" | "cancelled" | "all" | undefined) });
                const sp = new URLSearchParams();
                if (filters.room_id) sp.set("room", filters.room_id);
                if (status !== "all") sp.set("status", status);
                if (filters.date_from) sp.set("date_from", filters.date_from);
                if (filters.date_to) sp.set("date_to", filters.date_to);
                router.push(`?${sp.toString()}`);
              }}
              className="mt-1 block w-full rounded border p-2"
            >
              <option value="all">Todos</option>
              <option value="active">Activas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Fecha desde</label>
            <input
              type="date"
              value={filters.date_from || ""}
              onChange={(e) => {
                setFilters({ ...filters, date_from: e.target.value || undefined });
                const sp = new URLSearchParams();
                if (filters.room_id) sp.set("room", filters.room_id);
                if (filters.status) sp.set("status", filters.status);
                if (e.target.value) sp.set("date_from", e.target.value);
                if (filters.date_to) sp.set("date_to", filters.date_to);
                router.push(`?${sp.toString()}`);
              }}
              className="mt-1 block w-full rounded border p-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Fecha hasta</label>
            <input
              type="date"
              value={filters.date_to || ""}
              onChange={(e) => {
                setFilters({ ...filters, date_to: e.target.value || undefined });
                const sp = new URLSearchParams();
                if (filters.room_id) sp.set("room", filters.room_id);
                if (filters.status) sp.set("status", filters.status);
                if (filters.date_from) sp.set("date_from", filters.date_from);
                if (e.target.value) sp.set("date_to", e.target.value);
                router.push(`?${sp.toString()}`);
              }}
              className="mt-1 block w-full rounded border p-2"
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="rounded bg-black px-4 py-2 text-white mt-2"
            >
              Aplicar filtros
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de reservas */}
      {error && <p className="text-red-600">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Cargando reservas...</p>
      ) : displayed.length === 0 ? (
        <p className="text-gray-500">No hay reservas con los filtros aplicados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Sala</th>
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Fecha inicio</th>
                <th className="px-6 py-3">Fecha fin</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayed.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm">
                    {res.room_name}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {res.user_email}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {new Date(res.start_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {new Date(res.end_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        res.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {res.status === "active" ? "Activa" : "Cancelada"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-sm">
                    {res.status === "active" && (
                      <button
                        onClick={() =>
                          window.confirm(
                            "¿Seguro que querés cancelar esta reserva? Ingresá el motivo."
                          )
                        }
                        className="text-blue-600 hover:text-blue-900 underline"
                      >
                        Cancelar
                      </button>
                    )}
                    {res.status === "cancelled" && (
                      <span className="text-gray-500">Cancelada</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}