import React, { useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import DataTableGenerico from "../components/DataTableGenerico";
import FormularioGenerico from "../components/FormularioGenerico";
import ModalFormulario from "../components/ModalFormulario";
import AsignacionDetalles from "../components/AsignacionDetalles";
import useAsignacionesRutas from "../hooks/useAsignacionesRutas";
import {
  IconoCalendario,
  IconoChofer,
  IconoCrear,
  IconoEstado,
  IconoNombreVehiculo,
  IconoPlaca,
  IconoRuta,
} from "../assets/IconosComponentes";
import Boton from "../components/Boton";
import AccionesTemplate from "../components/AccionesTemplate";
import getBadgeClassType from "../utils/badges";
function AsignacionesRutas() {
  const toast = useRef(null);
  const {
    data,
    modalVisible,
    globalFilter,
    setGlobalFilter,
    asignacionSeleccionada,
    detalleVisible,
    isEditing,
    nuevaAsignacion,
    setNuevaAsignacion,
    formFields,
    isSubmitting,
    confirmDialogVisible,
    asignacionToDelete,
    handleNuevoAsignacion,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleVerDetalles,
    handleCancel,
    handleGuardarAsignacion,
    handleCerrarDetalles,
  } = useAsignacionesRutas(toast);

  const columns = [
    {
      field: "fechaAsignacion",
      sortable: true,
      header: (
        <div className="flex items-center gap-2">
          <IconoCalendario /> Fecha de Asignación
        </div>
      ),
      body: (data) =>
        data.fechaAsignacion
          ? new Date(data.fechaAsignacion).toLocaleDateString("es-ES")
          : "No especificado",
    },
    {
      field: "chofer.nombre",
      sortable: true,
      header: (
        <div className="flex items-center gap-2">
          <IconoChofer /> Chofer Asignado
        </div>
      ),
      body: (data) => data.chofer?.nombre || "No especificado",
    },
    {
      field: "vehiculo.placa",
      sortable: true,
      header: (
        <div className="flex items-center gap-2">
          <IconoPlaca /> Placa del Vehículo
        </div>
      ),
      body: (data) => data.vehiculo?.placa || "No especificado",
    },
    {
      field: "vehiculo.nombre",
      sortable: true,
      header: (
        <div className="flex items-center gap-2">
          <IconoNombreVehiculo /> Nombre del Vehículo
        </div>
      ),
      body: (data) => data.vehiculo?.nombre || "No especificado",
    },
    {
      field: "ruta.nombre",
      header: (
        <div className="flex items-center gap-2">
          <IconoRuta /> Ruta
        </div>
      ),
      sortable: true,
      body: (data) => data.ruta?.nombre || "No especificado",
    },
    {
      field: "estado",
      header: (
        <div className="flex items-center gap-2">
          <IconoEstado /> Estado
        </div>
      ),
      sortable: true,
      body: (data) => (
        <span className={getBadgeClassType(data.estado)}>
          {data.estado || "No especificado"}
        </span>
      ),
    },
  ];

  const actions = (data) => (
    <div className="flex gap-2">
      {AccionesTemplate({
        data,
        onEdit: () => handleEdit(data),
        onDelete: () => handleDelete(data),
        hideEdit: data.estado === "Completado",
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

  const modalFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={handleCancel}
        disabled={isSubmitting}
      />
      <Button
        label={isEditing ? "Actualizar" : "Guardar"}
        icon="pi pi-check"
        className="p-button-primary"
        onClick={handleGuardarAsignacion}
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
        message={`¿Estás seguro de que deseas eliminar la asignación del ${
          asignacionToDelete?.fechaAsignacion
            ? new Date(asignacionToDelete.fechaAsignacion).toLocaleDateString(
                "es-ES"
              )
            : "desconocido"
        }?`}
        header="Confirmar Eliminación"
        icon="pi pi-exclamation-triangle"
        accept={confirmDelete}
        reject={cancelDelete}
        acceptLabel="Sí, eliminar"
        rejectLabel="Cancelar"
      />
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Gestión de Asignaciones de Rutas</h1>
        <Boton
          text="Registrar Asignación"
          icon={IconoCrear}
          onClick={handleNuevoAsignacion}
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
        titulo={isEditing ? "Editar Asignación" : "Registrar Asignación"}
        footer={modalFooter}
      >
        <FormularioGenerico
          fields={formFields}
          formData={nuevaAsignacion}
          onChange={(field, value) => {
            if (field === "choferId") {
              formFields.find((f) => f.id === "choferId").onChange(value);
            }
            setNuevaAsignacion({ ...nuevaAsignacion, [field]: value });
          }}
        />
      </ModalFormulario>
      <AsignacionDetalles
        visible={detalleVisible}
        onHide={handleCerrarDetalles}
        asignacion={asignacionSeleccionada}
      />
    </section>
  );
}

export default AsignacionesRutas;
