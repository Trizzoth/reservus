// Server Component que lista salas y renderiza el formulario de cliente.
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { AdminEditButton, AdminNewRoomButton } from "./admin-rooms-actions";

type Room = {
  id: string;
  name: string;
  capacity: number;
  is_active: boolean;
  created_at: string;
};

export type { Room };

async function RoomsList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("id, name, capacity, is_active, created_at")
    .order("name");

  if (error) {
    return (
      <p className="text-gray-500">No hay salas registradas.</p>
    );
  }

  const rooms = data ?? [];

  return (
    <div className="mt-4 space-y-3">
      {rooms.length === 0 ? (
        <p className="text-gray-500">No hay salas registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td className="px-4 py-3 text-sm">{room.name}</td>
                  <td className="px-4 py-3 text-sm">{room.capacity}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        room.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {room.is_active ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <AdminEditButton room={room} />
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

// Exporta el componente de la pestaña Salas (Server Component).
export default async function AdminRooms() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Gestión de salas</h3>
        <AdminNewRoomButton />
      </div>

      <Suspense fallback={<p className="mt-4">Cargando salas...</p>}>
        <RoomsList />
      </Suspense>
    </div>
  );
}