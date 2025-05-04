import React from "react";
import DataTableGenerico from "../components/DataTableGenerico";
import getBadgeClassType from "../utils/badges";
import {
  IconoCombustible,
  IconoEstado,
  IconoNombreVehiculo,
  IconoPlaca,
  IconoTipoMaquinaria,
} from "../assets/IconosComponentes";
import AccionesTemplate from "../components/AccionesTemplate";
import { Button } from "primereact/button";

function Vehiculos() {
  const data = [
    {
      id: 1,
      placa: "ABC123",
      nombre_vehiculo: "Toyota Hilux",
      descripcion: "Vehículo liviano para transporte urbano.",
      tipo_maquinaria: "Liviana",
      estado_operativo: "Operativo",
      capacidad_combustible: 80.5,
      fecha_registro: "2024-12-01T10:00:00",
      connsumo_combustible_km: 5.2,
      estado: "Activo",
    },
    {
      id: 2,
      placa: "XYZ789",
      nombre_vehiculo: "Caterpillar 950M",
      descripcion: "Cargadora pesada usada en obras viales.",
      tipo_maquinaria: "Pesada",
      estado_operativo: "Mantenimiento",
      capacidad_combustible: 120.0,
      fecha_registro: "2023-08-15T14:30:00",
      connsumo_combustible_km: 3.8,
      estado: "Activo",
    },
    {
      id: 3,
      placa: "LMN456",
      nombre_vehiculo: "Ford Ranger",
      descripcion: "Camioneta liviana con uso en logística.",
      tipo_maquinaria: "Liviana",
      estado_operativo: "Operativo",
      capacidad_combustible: 65.0,
      fecha_registro: "2025-01-10T08:45:00",
      connsumo_combustible_km: 6.1,
      estado: "Eliminado",
    },
    {
      id: 4,
      placa: "DEF234",
      nombre_vehiculo: "Volvo FMX",
      descripcion: "Camión pesado para transporte de carga.",
      tipo_maquinaria: "Pesada",
      estado_operativo: "Operativo",
      capacidad_combustible: 150.2,
      fecha_registro: "2022-05-20T11:15:00",
      connsumo_combustible_km: 4.3,
      estado: "Activo",
    },
    {
      id: 5,
      placa: "GHI567",
      nombre_vehiculo: "Nissan Frontier",
      descripcion: "Vehículo de apoyo en operaciones de campo.",
      tipo_maquinaria: "Liviana",
      estado_operativo: "Mantenimiento",
      capacidad_combustible: 70.0,
      fecha_registro: "2023-11-25T09:00:00",
      connsumo_combustible_km: 5.0,
      estado: "Activo",
    },
  ];

  const columns = [
    {
      field: "placa",
      header: (
        <div className="flex items-center gap-2">
          <IconoPlaca /> Placa
        </div>
      ),
      sortable: false,
    },
    {
      field: "nombre_vehiculo",
      header: (
        <div className="flex items-center gap-2">
          <IconoNombreVehiculo /> Nombre
        </div>
      ),
      sortable: false,
    },
    {
      field: "tipo_maquinaria",
      header: (
        <div className="flex items-center gap-2">
          <IconoTipoMaquinaria /> Tipo de Maquinaria
        </div>
      ),
      sortable: false,
      body: (data) => (
        <span className={getBadgeClassType(data.tipo_maquinaria)}>
          {data.tipo_maquinaria}
        </span>
      ),
    },
    {
      field: "capacidad_combustible",
      header: (
        <div className="flex items-center gap-2">
          <IconoCombustible /> Capacidad Combustible
        </div>
      ),
      sortable: false,
    },
    {
      field: "estado_operativo",
      header: (
        <div className="flex items-center gap-2">
          <IconoEstado /> Estado Operativo
        </div>
      ),
      sortable: false,
    },
  ];
  const actions = (data) => (
    <div className="flex gap-2">
      {AccionesTemplate({
        data,
        onEdit: () => {
          console.log("editar");
        },
        onDelete: () => {
          console.log("eliminar");
        },
      })}
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-info p-button-text p-button-sm"
        onClick={() => console.log("ver detalles")}
        tooltip="Ver detalles"
        tooltipOptions={{ position: "top" }}
      />
    </div>
  );
  return (
    <DataTableGenerico
      data={data}
      columns={columns}
      actions={actions}
    ></DataTableGenerico>
  );
}

export default Vehiculos;
