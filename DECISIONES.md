# Decisiones de Reservus

Esta bitácora comienza con la regla adicional aprobada durante este bloque.
Queda pendiente incorporar las entradas D1–D5 y las demás decisiones técnicas del reto.

## D6 — Anticipación máxima de nuevas reservas

**Fecha/hora:** 2026-09-19; hora de aprobación no registrada.

**Opciones consideradas:** sin máximo (el PDF no lo exige), 7 días o 14 días.

**Decisión:** miembros y administradores pueden crear reservas desde hoy hasta
hoy + 14 días, inclusive, usando el calendario de `America/Costa_Rica`.
El último día completo está permitido dentro del horario 07:00–21:00.
No es una ventana móvil de exactamente 336 horas.

Se mantiene RN-05: al menos 30 minutos de anticipación. Se mantiene RN-06:
máximo 3 reservas activas por semana para miembros; los administradores siguen
exentos del límite de cantidad, pero no del nuevo límite de anticipación.

Las reservas ya creadas fuera de la ventana se conservan y pueden consultarse.
Por eso el selector de disponibilidad no tiene este máximo. El formulario de
creación no precarga una fecha consultada que esté fuera de la ventana.

**Por qué:** dos semanas permiten planificar reuniones sin bloquear salas con
años de anticipación. La regla fue confirmada explícitamente por el responsable
del proyecto; es una decisión adicional, no un requisito del PDF.

**Qué se sacrifica con esta decisión:** no se pueden programar nuevas reuniones
con más de dos semanas de anticipación, ni siquiera siendo administrador.
Las reservas antiguas pueden quedar temporalmente fuera de la ventana nueva.

**Implementación:** `lib/reservation-dates.ts` centraliza fechas reales y límites
para la Server Action y las propiedades del formulario. El servidor recalcula
la ventana en cada envío. La migración
`20260919200000_limit_reservation_advance.sql` actualiza la RPC sin cambiar su
firma, sus permisos ni las restricciones existentes. La comparación SQL ocurre
antes de la excepción de cantidad semanal para administradores.

El límite del navegador es orientativo: una página abierta durante el cambio de
día puede mostrar el rango anterior hasta recargarse; servidor y base de datos
aplican el calendario actual. La migración debe aplicarse a Supabase para que las
llamadas directas a la RPC queden protegidas por la nueva regla.

**Verificación (2026-09-19):** migración aplicada al proyecto Supabase enlazado y
confirmada en el historial remoto. Prueba SQL transaccional con rol
`authenticated` y perfiles temporales member/admin: ambos aceptaron el día +14,
rechazaron el +15 con el mensaje esperado y consultaron una reserva preexistente
a dos años. El admin reservó el último bloque del día +14 (20:00–21:00).
Los datos de prueba se revirtieron con `ROLLBACK`.

También pasaron 13 comprobaciones de calendario en TypeScript (incluyendo
medianoche de Costa Rica, cambio de año y bisiestos), `npx tsc --noEmit`,
`npm run lint` y `npm run build`. Queda pendiente la comprobación visual del
selector actualizado en el navegador.
