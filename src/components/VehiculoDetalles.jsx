import React from "react";
import { Button } from "primereact/button";
import ModalFormulario from "./ModalFormulario";

const VehiculoDetalles = ({ visible, onHide, vehiculo }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <ModalFormulario
      visible={visible}
      onHide={onHide}
      titulo="Detalles del Vehículo"
    >
      {vehiculo && (
        <div className="grid gap-6 mt-4">
          <div className="border-b pb-4">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">
              Información General
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Placa</p>
                <p className="font-medium">
                  {vehiculo.placa || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">
                  {vehiculo.nombre_vehiculo || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo de Maquinaria</p>
                <p className="font-medium">
                  {vehiculo.tipo_maquinaria || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado Operativo</p>
                <p className="font-medium">
                  {vehiculo.estado_operativo || "No especificado"}
                </p>
              </div>
            </div>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-2xl font-bold mb-3 text-blue-600">
              Especificaciones Técnicas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Capacidad de Combustible
                </p>
                <p className="font-medium">
                  {vehiculo.capacidad_combustible
                    ? `${vehiculo.capacidad_combustible} L`
                    : "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Consumo de Combustible</p>
                <p className="font-medium">
                  {vehiculo.consumo_combustible_km
                    ? `${vehiculo.consumo_combustible_km} km/L`
                    : "No especificado"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Otros Detalles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Descripción</p>
                <p className="font-medium">
                  {vehiculo.descripcion || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de Registro</p>
                <p className="font-medium">
                  {formatDate(vehiculo.fecha_registro)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="font-medium">
                  {vehiculo.estado || "No especificado"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalFormulario>
  );
};

export default VehiculoDetalles;
