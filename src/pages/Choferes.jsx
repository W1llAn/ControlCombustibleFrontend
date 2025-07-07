import React, { useRef } from "react";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import DataTableGenerico from "../components/DataTableGenerico";
import FormularioGenerico from "../components/FormularioGenerico";
import ModalFormulario from "../components/ModalFormulario";
import ChoferDetalles from "../components/ChoferDetalles";
import useChoferes from "../hooks/useChoferes";
import {
  IconoCrear,
  IconoEstado,
  IconoPersona,
  IconoPlaca,
  IconoTipoMaquinaria,
} from "../assets/IconosComponentes";
import Boton from "../components/Boton";
import AccionesTemplate from "../components/AccionesTemplate";
import getBadgeClassType from "../utils/badges";

function Choferes() {
  const toast = useRef(null);
  const {
    data,
    modalVisible,
    globalFilter,
    setGlobalFilter,
    choferSeleccionado,
    detalleVisible,
    isEditing,
    nuevoChofer,
    setNuevoChofer,
    formFields,
    isSubmitting,
    confirmDialogVisible,
    choferToDelete,
    disponibilidadMap,
    handleDisponibilidadChange,
    handleNuevoChofer,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleVerDetalles,
    handleCancel,
    handleGuardarChofer,
    handleCerrarDetalles,
  } = useChoferes(toast);

  const columns = [
    {
      field: "identificacion",
      header: (
        <div className="flex items-center gap-2">
          <IconoPlaca /> Cédula
        </div>
      ),
      sortable: true,
    },
    {
      field: "nombre",
      header: (
        <div className="flex items-center gap-2">
          <IconoPersona /> Nombre
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
      field: "disponible",
      header: (
        <div className="flex items-center gap-2">
          <IconoEstado /> Disponibilidad
        </div>
      ),
      body: (rowData) => {
        const isChecked = disponibilidadMap[rowData.id] ?? rowData.disponible;

        return (
          <div className="flex items-center gap-2 flex-col">
            <span>{isChecked ? "Disponible" : "No Disponible"}</span>
            <InputSwitch
              checked={isChecked}
              onChange={(e) => handleDisponibilidadChange(rowData.id, e.value)}
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
        className="p-button-danger"
        onClick={handleCancel}
        disabled={isSubmitting}
      />
      <Button
        label={isEditing ? "Actualizar" : "Guardar"}
        icon="pi pi-check"
        className="p-button-primary"
        onClick={handleGuardarChofer}
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
        message={`¿Estás seguro de que deseas eliminar el chofer "${choferToDelete?.nombre}"?`}
        header="Confirmar Eliminación"
        icon="pi pi-exclamation-triangle"
        accept={confirmDelete}
        reject={cancelDelete}
        acceptLabel="Sí, eliminar"
        rejectLabel="Cancelar"
      />
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Gestión de Choferes</h1>
        <Boton
          text="Registrar Chofer"
          icon={IconoCrear}
          onClick={handleNuevoChofer}
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
        titulo={isEditing ? "Editar Chofer" : "Registrar Chofer"}
        footer={modalFooter}
      >
        <FormularioGenerico
          fields={formFields}
          formData={nuevoChofer}
          onChange={(field, value) =>
            setNuevoChofer({ ...nuevoChofer, [field]: value })
          }
        />
      </ModalFormulario>
      <ChoferDetalles
        visible={detalleVisible}
        onHide={handleCerrarDetalles}
        chofer={choferSeleccionado}
      />
    </section>
  );
}

export default Choferes;
