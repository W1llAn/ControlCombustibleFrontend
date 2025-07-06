import React, { useRef } from "react";
import DataTableGenerico from "../components/DataTableGenerico";
import getBadgeClassType from "../utils/badges";
import {
  IconoRuta,
  IconoCrear,
  IconoEstado,
  IconoLocation,
  IconoDistancia,
} from "../assets/IconosComponentes/";
import AccionesTemplate from "../components/AccionesTemplate";
import { Button } from "primereact/button";
import Boton from "../components/Boton";
import { InputSwitch } from "primereact/inputswitch";
import FormularioGenerico from "../components/FormularioGenerico";
import ModalFormulario from "../components/ModalFormulario";
import RutaDetalles from "../components/RutaDetalles";
import useRutas from "../hooks/useRutas";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";

function Rutas() {
  const toast = useRef(null);
  const {
    data,
    modalVisible,
    globalFilter,
    setGlobalFilter,
    rutaSeleccionada,
    detalleVisible,
    isEditing,
    nuevaRuta,
    setNuevaRuta,
    formFields,
    isSubmitting,
    confirmDialogVisible,
    rutaToDelete,
    estadoMap,
    handleEstadoChange,
    handleNuevaRuta,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleVerDetalles,
    handleCancel,
    handleGuardarRuta,
    handleCerrarDetalles,
  } = useRutas(toast);

  const columns = [
    {
      field: "nombre",
      header: (
        <div className="flex items-center gap-2">
          <IconoRuta /> Nombre
        </div>
      ),
      sortable: true,
    },
    {
      field: "puntoInicio",
      header: (
        <div className="flex items-center gap-2">
          <IconoLocation /> Punto de Inicio
        </div>
      ),
      sortable: true,
    },
    {
      field: "puntoFin",
      header: (
        <div className="flex items-center gap-2">
          <IconoLocation /> Punto de Fin
        </div>
      ),
      sortable: true,
    },
    {
      field: "distancia",
      header: (
        <div className="flex items-center gap-2">
          <IconoDistancia /> Distancia (km)
        </div>
      ),
      sortable: true,
      body: (data) => `${data.distancia} km`,
    },
    {
      field: "estado",
      header: (
        <div className="flex items-center gap-2">
          <IconoEstado /> Estado
        </div>
      ),
      body: (rowData) => {
        const isChecked = estadoMap[rowData.id] ?? rowData.estado === 1;

        return (
          <div className="flex items-center gap-2 flex-col">
            <span>{isChecked ? "Activo" : "Inactivo"}</span>
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
        onClick={handleGuardarRuta}
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
        message={`¿Estás seguro de que deseas eliminar la ruta "${rutaToDelete?.nombre}"?`}
        header="Confirmar Eliminación"
        icon="pi pi-exclamation-triangle"
        accept={confirmDelete}
        reject={cancelDelete}
        acceptLabel="Sí, eliminar"
        rejectLabel="Cancelar"
      />
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Gestión de Rutas</h1>
        <Boton
          text="Registrar Ruta"
          icon={IconoCrear}
          onClick={handleNuevaRuta}
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
        titulo={isEditing ? "Editar Ruta" : "Registrar Ruta"}
        footer={modalFooter}>
        <FormularioGenerico
          fields={formFields}
          formData={nuevaRuta}
          onChange={(field, value) =>
            setNuevaRuta({ ...nuevaRuta, [field]: value })
          }
        />
      </ModalFormulario>
      <RutaDetalles
        visible={detalleVisible}
        onHide={handleCerrarDetalles}
        ruta={rutaSeleccionada}
      />
    </section>
  );
}

export default Rutas;
