import React from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import {
  IconoComsumoCombsutible,
  IconoChofer,
  IconoNombreVehiculo,
  IconoRuta,
  IconoGasolina,
  IconoEstado,
} from "../assets/IconosComponentes";

const ConsumoDetalles = ({ visible, onHide, consumo }) => {
  if (!consumo) return null;

  const getEstadoBadge = (estado) => {
    return estado === 1 ? (
      <Badge value="Activo" severity="success" />
    ) : (
      <Badge value="Inactivo" severity="danger" />
    );
  };

  const getCombustibleBadge = (combustibleReal, combustibleEstimado) => {
    if (combustibleReal <= combustibleEstimado) {
      return <Badge value={`${combustibleReal} L`} severity="success" />;
    } else {
      return <Badge value={`${combustibleReal} L`} severity="warning" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={
        <div className="flex items-center gap-2">
          <IconoComsumoCombsutible />
          <span>Detalles del Consumo de Combustible</span>
        </div>
      }
      modal
      className="w-full max-w-4xl"
      contentStyle={{ padding: "2rem" }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del Consumo */}
        <Card title="Información del Consumo" className="h-fit">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <IconoComsumoCombsutible className="text-blue-500" />
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Fecha de Registro
                </label>
                <p className="text-lg">{formatDate(consumo.fechaRegistro)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IconoGasolina className="text-yellow-500" />
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Combustible Estimado
                </label>
                <p className="text-lg font-semibold">
                  {consumo.combustibleEstimado || 0} L
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IconoComsumoCombsutible className="text-green-500" />
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Combustible Real Consumido
                </label>
                <div className="mt-1">
                  {getCombustibleBadge(
                    consumo.combustibleReal,
                    consumo.combustibleEstimado
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IconoEstado className="text-blue-500" />
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Estado
                </label>
                <div className="mt-1">{getEstadoBadge(consumo.estado)}</div>
              </div>
            </div>

            {consumo.motivo && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Motivo/Observaciones
                </label>
                <p className="text-sm bg-gray-50 p-3 rounded-md">
                  {consumo.motivo}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Información de la Asignación */}
        <Card title="Información de la Asignación" className="h-fit">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <IconoChofer className="text-purple-500" />
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Chofer
                </label>
                <p className="text-lg font-semibold">
                  {consumo.chofer?.nombre || "N/A"}
                </p>
                {consumo.chofer?.identificacion && (
                  <p className="text-sm text-gray-500">
                    {consumo.chofer.identificacion}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IconoNombreVehiculo className="text-blue-500" />
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Vehículo
                </label>
                <p className="text-lg font-semibold">
                  {consumo.vehiculo?.nombre || "N/A"}
                </p>
                {consumo.vehiculo?.placa && (
                  <p className="text-sm text-gray-500">
                    Placa: {consumo.vehiculo.placa}
                  </p>
                )}
                {consumo.vehiculo?.tipoMaquinaria && (
                  <p className="text-sm text-gray-500">
                    Tipo: {consumo.vehiculo.tipoMaquinaria}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IconoRuta className="text-green-500" />
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Ruta
                </label>
                <p className="text-lg font-semibold">
                  {consumo.ruta?.nombre || "N/A"}
                </p>
                {consumo.ruta?.puntoInicio && consumo.ruta?.puntoFin && (
                  <p className="text-sm text-gray-500">
                    {consumo.ruta.puntoInicio} → {consumo.ruta.puntoFin}
                  </p>
                )}
                {consumo.ruta?.distancia && (
                  <p className="text-sm text-gray-500">
                    Distancia: {consumo.ruta.distancia} km
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Análisis del Consumo */}
      <Card title="Análisis del Consumo" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800">
              Combustible Estimado
            </h4>
            <p className="text-2xl font-bold text-blue-600">
              {consumo.combustibleEstimado || 0} L
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800">Combustible Real</h4>
            <p className="text-2xl font-bold text-green-600">
              {consumo.combustibleReal} L
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800">Diferencia</h4>
            <p
              className={`text-2xl font-bold ${
                consumo.combustibleReal - (consumo.combustibleEstimado || 0) <=
                0
                  ? "text-green-600"
                  : "text-orange-600"
              }`}>
              {Math.abs(
                consumo.combustibleReal - (consumo.combustibleEstimado || 0)
              ).toFixed(1)}{" "}
              L
            </p>
          </div>
        </div>
      </Card>
    </Dialog>
  );
};

export default ConsumoDetalles;
