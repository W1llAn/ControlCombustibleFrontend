import React from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import {
  IconoRuta,
  IconoLocation,
  IconoDistancia,
  IconoEstado,
} from "../assets/IconosComponentes/index";

const RutaDetalles = ({ visible, onHide, ruta }) => {
  if (!ruta) return null;

  const getEstadoBadge = (estado) => {
    return estado === 1 ? (
      <Badge value="Activo" severity="success" />
    ) : (
      <Badge value="Inactivo" severity="danger" />
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={
        <div className="flex items-center gap-2">
          <IconoRuta />
          <span>Detalles de la Ruta</span>
        </div>
      }
      modal
      className="w-full max-w-2xl"
      contentStyle={{ padding: "2rem" }}>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <IconoRuta className="text-blue-500" />
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Nombre de la Ruta
                </label>
                <p className="text-lg font-semibold">{ruta.nombre}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IconoLocation className="text-green-500" />
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Punto de Inicio
                </label>
                <p className="text-lg">{ruta.puntoInicio}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IconoLocation className="text-red-500" />
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Punto de Fin
                </label>
                <p className="text-lg">{ruta.puntoFin}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <IconoDistancia className="text-purple-500" />
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Distancia
                </label>
                <p className="text-lg font-semibold">{ruta.distancia} km</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IconoEstado className="text-blue-500" />
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Estado
                </label>
                <div className="mt-1">{getEstadoBadge(ruta.estado)}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Dialog>
  );
};

export default RutaDetalles;
