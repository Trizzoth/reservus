"use client";
import { useState } from "react";
import { AdminRoomsForm } from "./admin-rooms-form";
import type { Room } from "./admin-rooms";

type AdminEditButtonProps = {
  room: Room;
};

export function AdminEditButton({ room }: AdminEditButtonProps) {
  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="text-blue-600 hover:text-blue-900 underline"
      >
        Editar
      </button>
    );
  }

  return (
    <div>
      <AdminRoomsForm room={room} onClose={() => setShowForm(false)} />
    </div>
  );
}

// Botón para crear nueva sala.
export function AdminNewRoomButton() {
  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Nueva sala
      </button>
    );
  }

  return (
    <div className="mt-4">
      <AdminRoomsForm onClose={() => setShowForm(false)} />
    </div>
  );
}