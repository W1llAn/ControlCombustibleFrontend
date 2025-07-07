import React, { useEffect, useState } from "react";
import {
  IconoAsignacionRuta,
  IconoCerrarSesion,
  IconoChofer,
  IconoPerfil,
  IconoReportes,
  IconoRuta,
  IconoUsuarios,
  IconoVehiculos,
} from "../assets/IconosComponentes";
import Vehiculos from "./Vehiculos";
import Rutas from "./Rutas";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Choferes from "./Choferes";
import AsignacionRutas from "./AsignacionRutas";
import Usuarios from "./Usuarios";

const Home = () => {
  const [activeSection, setActiveSection] = useState("vehiculos");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    confirmDialog({
      message: "¿Estás seguro que deseas cerrar sesión?",
      header: "Confirmación de cierre de sesión",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí",
      rejectLabel: "No",
      accept: () => {
        localStorage.removeItem("jwtToken");
        toast.current.show({
          severity: "success",
          summary: "Sesión finalizada",
          detail: "Has cerrado sesión correctamente",
          life: 3000,
        });
        setTimeout(() => navigate("/login"), 1000);
      },
      reject: () => {
        toast.current.show({
          severity: "info",
          summary: "Operación cancelada",
          detail: "Continúas en la sesión actual",
          life: 3000,
        });
      },
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const navItems = [
    { key: "vehiculos", label: "Vehiculos", icon: <IconoVehiculos /> },
    { key: "choferes", label: "Choferes", icon: <IconoChofer /> },
    { key: "rutas", label: "Rutas", icon: <IconoRuta /> },
    {
      key: "asignacion_rutas",
      label: "Asignación de Rutas",
      icon: <IconoAsignacionRuta />,
    },
    { key: "usuarios", label: "Usuarios", icon: <IconoUsuarios /> },

    { key: "reportes", label: "Reportes", icon: <IconoReportes /> },
  ];

  const baseLinkClasses =
    "flex items-center px-6 py-3 mb-4 text-text-primary transition-colors duration-300 transform rounded-md cursor-pointer hover:bg-hover-gray";

  const renderSection = () => {
    switch (activeSection) {
      case "vehiculos":
        return <Vehiculos />;
      case "choferes":
        return <Choferes />;
      case "rutas":
        return <Rutas />;
      case "asignacion_rutas":
        return <AsignacionRutas />;
      case "usuarios":
        return <Usuarios />;
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
        onClick={handleLogout} // Usar la nueva función aquí
        className={`${baseLinkClasses} items-center justify-center mt-auto`}
      >
        <IconoCerrarSesion />
        <span className="mx-4 font-medium">Cerrar Sesión</span>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      <Toast ref={toast} position="top-right" />
      <ConfirmDialog />
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
