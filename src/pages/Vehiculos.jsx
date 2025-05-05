import React, { useRef } from "react";
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
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";

function Vehiculos() {
  const toast = useRef(null);
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
    isSubmitting,
    confirmDialogVisible,
    vehiculoToDelete,
    estadoOperativoMap,
    handleEstadoChange,
    handleNuevoVehiculo,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleVerDetalles,
    handleCancel,
    handleGuardarVehiculo,
    handleCerrarDetalles,
  } = useVehiculos(toast);

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
      field: "nombre",
      header: (
        <div className="flex items-center gap-2">
          <IconoNombreVehiculo /> Nombre
        </div>
      ),
      sortable: true,
    },
    {
      field: "tipoMaquinaria",
      header: (
        <div className="flex items-center gap-2">
          <IconoTipoMaquinaria /> Tipo de Maquinaria
        </div>
      ),
      sortable: true,
      body: (data) => (
        <span className={getBadgeClassType(data.tipoMaquinaria)}>
          {data.tipoMaquinaria}
        </span>
      ),
    },
    {
      field: "capacidadCombustible",
      header: (
        <div className="flex items-center gap-2">
          <IconoCombustible /> Capacidad Combustible
        </div>
      ),
      sortable: false,
    },
    {
      field: "estadoOperativo",
      header: (
        <div className="flex items-center gap-2">
          <IconoEstado /> Estado Operativo
        </div>
      ),
      body: (rowData) => {
        const isChecked =
          estadoOperativoMap[rowData.id] ??
          rowData.estadoOperativo === "Operativo";

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
      <Toast ref={toast} />
      <ConfirmDialog
        visible={confirmDialogVisible}
        onHide={cancelDelete}
        message={`¿Estás seguro de que deseas eliminar el vehículo "${vehiculoToDelete?.nombre}"?`}
        header="Confirmar Eliminación"
        icon="pi pi-exclamation-triangle"
        accept={confirmDelete}
        reject={cancelDelete}
        acceptLabel="Sí, eliminar"
        rejectLabel="Cancelar"
      />
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
