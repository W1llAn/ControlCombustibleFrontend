import React from "react";
import DataTableGenerico from "../components/DataTableGenerico";
import getBadgeClassType from "../utils/badges";
import {
  IconoCombustible,
  IconoCrear,
  IconoEstado,
  IconoNombreVehiculo,
  IconoPlaca,
  IconoTipoMaquinaria,
} from "../assets/IconosComponentes";
import AccionesTemplate from "../components/AccionesTemplate";
import { Button } from "primereact/button";
import Boton from "../components/Boton";
import { InputSwitch } from "primereact/inputswitch";
import FormularioGenerico from "../components/FormularioGenerico";
import ModalFormulario from "../components/ModalFormulario";
import VehiculoDetalles from "../components/VehiculoDetalles";
import useVehiculos from "../hooks/useVehiculos";

function Vehiculos() {
  const {
    data,
    modalVisible,
    globalFilter,
    setGlobalFilter,
    vehiculoSeleccionado,
    detalleVisible,
    isEditing,
    nuevoVehiculo,
    setNuevoVehiculo,
    formFields,
    errors,
    isSubmitting,
    estadoOperativoMap,
    handleEstadoChange,
    handleNuevoVehiculo,
    handleEdit,
    handleDelete,
    handleVerDetalles,
    handleCancel,
    handleGuardarVehiculo,
    handleCerrarDetalles,
  } = useVehiculos();

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
      body: (rowData) => {
        const isChecked =
          estadoOperativoMap[rowData.id] ??
          rowData.estado_operativo === "Operativo";

        return (
          <div className="flex items-center gap-2 flex-col">
            <span>{isChecked ? "Operativo" : "Mantenimiento"}</span>
            <InputSwitch
              checked={isChecked}
              onChange={(e) => handleEstadoChange(rowData.id, e.value)}
            />
          </div>
        );
      },
      sortable: false,
    },
  ];

  const actions = (data) => (
    <div className="flex gap-2">
      {AccionesTemplate({
        data,
        onEdit: () => handleEdit(data),
        onDelete: () => handleDelete(data),
      })}
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-info p-button-text p-button-sm"
        onClick={() => handleVerDetalles(data)}
        tooltip="Ver detalles"
        tooltipOptions={{ position: "top" }}
      />
    </div>
  );

  // Footer del modal del formulario
  const modalFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className=" p-button-danger"
        onClick={handleCancel}
        disabled={isSubmitting}
      />
      <Button
        label={isEditing ? "Actualizar" : "Guardar"}
        icon="pi pi-check"
        className="p-button-primary"
        onClick={handleGuardarVehiculo}
        loading={isSubmitting}
      />
    </div>
  );

  return (
    <section className="py-6 px-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Gestión de Vehículos</h1>
        <Boton
          text="Registrar Vehículo"
          icon={IconoCrear}
          onClick={handleNuevoVehiculo}
        />
      </div>
      <DataTableGenerico
        data={data}
        columns={columns}
        actions={actions}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />
      <ModalFormulario
        visible={modalVisible}
        onHide={handleCancel}
        titulo={isEditing ? "Editar Vehículo" : "Registrar Vehículo"}
        footer={modalFooter}
      >
        <FormularioGenerico
          fields={formFields}
          formData={nuevoVehiculo}
          onChange={(field, value) =>
            setNuevoVehiculo({ ...nuevoVehiculo, [field]: value })
          }
        />
        {Object.keys(errors).length > 0 && (
          <div className="text-red-500 text-sm mt-2">
            {errors.submit || "Por favor, corrige los errores en el formulario"}
          </div>
        )}
      </ModalFormulario>
      <VehiculoDetalles
        visible={detalleVisible}
        onHide={handleCerrarDetalles}
        vehiculo={vehiculoSeleccionado}
      />
    </section>
  );
}

export default Vehiculos;
