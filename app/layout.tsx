// Metadata nos permite configurar el título y
// la descripción general de nuestra aplicación.
import type { Metadata } from "next";

// ReactNode representa cualquier contenido que React
// puede mostrar dentro del layout.
// Lo usamos en lugar de LayoutProps para no depender
// de tipos temporales generados por Next.js.
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Reservas",
  description: "Sistema para la gestión y reserva de salas",
};

// Define qué datos recibe el layout principal.
//
// children representa todas las páginas que Next.js
// colocará dentro de este layout.
type RootLayoutProps = {
  children: ReactNode;
};

// Layout principal compartido por toda la aplicación.
export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
