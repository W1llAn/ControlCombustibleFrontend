import React from "react";
import ModalFormulario from "./ModalFormulario";

const ChoferDetalles = ({ visible, onHide, chofer }) => {
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
      titulo="Detalles del Chofer"
    >
      {chofer && (
        <div className="grid gap-6 mt-4">
          <div className="border-b pb-4">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">
              Información General
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Cédula</p>
                <p className="font-medium">
                  {chofer.identificacion || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">
                  {chofer.nombre || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo de Maquinaria</p>
                <p className="font-medium">
                  {chofer.tipoMaquinaria || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Disponibilidad</p>
                <p className="font-medium">
                  {chofer.disponible ? "Disponible" : "No Disponible"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                <p className="font-medium">
                  {formatDate(chofer.fechaNacimiento)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="font-medium">
                  {chofer.estado || "No especificado"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalFormulario>
  );
};

export default ChoferDetalles;
