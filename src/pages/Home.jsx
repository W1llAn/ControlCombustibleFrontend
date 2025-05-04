import React, { useState } from "react";
import {
  IconoCerrarSesion,
  IconoChofer,
  IconoPerfil,
  IconoReportes,
  IconoRuta,
  IconoVehiculos,
} from "../assets/IconosComponentes";
import Vehiculos from "./Vehiculos";

const Home = () => {
  const [activeSection, setActiveSection] = useState("vehiculos");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { key: "vehiculos", label: "Vehiculos", icon: <IconoVehiculos /> },
    { key: "choferes", label: "Choferes", icon: <IconoChofer /> },
    { key: "rutas", label: "Rutas", icon: <IconoRuta /> },
    { key: "reportes", label: "Reportes", icon: <IconoReportes /> },
  ];

  const baseLinkClasses =
    "flex items-center px-6 py-3 mb-4 text-text-primary transition-colors duration-300 transform rounded-md cursor-pointer hover:bg-hover-gray";

  const renderSection = () => {
    switch (activeSection) {
      case "vehiculos":
        return <Vehiculos />;
      default:
        return <h1>Sección: {activeSection}</h1>;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <a href="#" className="flex items-center flex-col gap-2 mb-0">
        <img
          className="w-auto h-12"
          src="Images/LogoCombustibles.png"
          alt="Logo"
        />
        <span
          className="mx-3 font-extrabold text-transparent bg-clip-text text-center"
          style={{
            backgroundImage:
              "linear-gradient(to left, rgba(78, 89, 246), #725AC1)",
          }}
        >
          Control Combustibles XYZ
        </span>
      </a>

      <nav className="mt-6 flex-1">
        {navItems.map(({ key, label, icon }) => (
          <div
            key={key}
            onClick={() => {
              setActiveSection(key);
              setSidebarOpen(false); // Cierra en móvil
            }}
            className={`${baseLinkClasses} ${
              activeSection === key ? "bg-hover-gray text-gray-700" : ""
            }`}
          >
            <span className="mx-2">{icon}</span>
            <span className="mx-4 font-semibold">{label}</span>
          </div>
        ))}
      </nav>

      <div
        onClick={() => {
          console.log("cerrar sesion");
        }}
        className={`${baseLinkClasses} items-center justify-center mt-auto`}
      >
        <IconoCerrarSesion />
        <span className="mx-4 font-medium">Cerrar Sesión</span>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar fijo en desktop */}
      <aside className="hidden md:flex w-64 bg-bg-primary shadow-lg p-4">
        <SidebarContent />
      </aside>

      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.22)] z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-bg-primary p-4 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <SidebarContent />
      </div>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <div className="flex items-center justify-between md:justify-end bg-bg-primary shadow-md p-4 border-b border-gray-200 sticky top-0 z-10 ">
          {/* Menú móvil */}
          <button
            className="md:hidden text-2xl text-gray-700 z-40"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="pi pi-bars" />
          </button>

          {/* Perfil */}
          <div className="flex items-center gap-3">
            <IconoPerfil />
            <div className="text-right">
              <p className="text-text-primary font-semibold text-xs">
                Administrador
              </p>
              <p className="text-text-primary font-semibold text-xs">
                Juan Perez
              </p>
              <span className="text-text-secondary font-light text-xs">
                juanperez@gmail.com
              </span>
            </div>
          </div>
        </div>

        {/* Sección activa */}
        <div className="p-6">{renderSection()}</div>
      </main>
    </div>
  );
};

export default Home;
