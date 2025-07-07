import React from "react";
import ModalFormulario from "./ModalFormulario";

// Función para formatear la fecha a DD/MM/YYYY
const formatDate = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) {
    return "No especificado";
  }
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const AsignacionDetalles = ({ visible, onHide, asignacion }) => {
  console.log("Detalles de la asignación:", asignacion);

  return (
    <ModalFormulario
      visible={visible}
      onHide={onHide}
      titulo="Detalles de la Asignación"
    >
      {asignacion && (
        <div className="grid gap-6 mt-4">
          <div className="border-b pb-4">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">
              Información General
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Fecha de Asignación</p>
                <p className="font-medium">
                  {formatDate(asignacion.fechaAsignacion)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="font-medium">
                  {asignacion.estado || "No especificado"}
                </p>
              </div>
            </div>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-2xl font-bold mb-3 text-blue-600">
              Información del Chofer
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Cédula</p>
                <p className="font-medium">
                  {asignacion.chofer?.identificacion || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">
                  {asignacion.chofer?.nombre || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo de Maquinaria</p>
                <p className="font-medium">
                  {asignacion.chofer?.tipoMaquinaria || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Correo Electrónico</p>
                <p className="font-medium">
                  {asignacion.chofer?.email || "No especificado"}
                </p>
              </div>
            </div>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-2xl font-bold mb-3 text-blue-600">
              Información del Vehículo
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Placa</p>
                <p className="font-medium">
                  {asignacion.vehiculo?.placa || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">
                  {asignacion.vehiculo?.nombre || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Capacidad de Combustible
                </p>
                <p className="font-medium">
                  {asignacion.vehiculo?.capacidadCombustible
                    ? `${asignacion.vehiculo.capacidadCombustible} L`
                    : "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Consumo de Combustible</p>
                <p className="font-medium">
                  {asignacion.vehiculo?.consumoCombustibleKm
                    ? `${asignacion.vehiculo.consumoCombustibleKm} km/L`
                    : "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado Operativo</p>
                <p className="font-medium">
                  {asignacion.vehiculo?.estadoOperativo || "No especificado"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Información de la Ruta
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">
                  {asignacion.ruta?.nombre || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Punto de Inicio</p>
                <p className="font-medium">
                  {asignacion.ruta?.puntoInicio || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Punto de Fin</p>
                <p className="font-medium">
                  {asignacion.ruta?.puntoFin || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Distancia</p>
                <p className="font-medium">
                  {asignacion.ruta?.distancia
                    ? `${asignacion.ruta.distancia} km`
                    : "No especificado"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalFormulario>
  );
};

export default AsignacionDetalles;
