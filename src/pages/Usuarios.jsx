import React, { useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import DataTableGenerico from "../components/DataTableGenerico";
import FormularioGenerico from "../components/FormularioGenerico";
import ModalFormulario from "../components/ModalFormulario";
import useUsuarios from "../hooks/useUsuarios";
import {
  IconoCrear,
  IconoEmail,
  IconoPersona,
  IconoPlaca,
} from "../assets/IconosComponentes";
import Boton from "../components/Boton";
import AccionesTemplate from "../components/AccionesTemplate";
import UsuarioDetalles from "../components/UsuarioDetalles";

function Usuarios(idUsuario) {
  const toast = useRef(null);
  const {
    data,
    modalVisible,
    globalFilter,
    setGlobalFilter,
    usuarioSeleccionado,
    detalleVisible,
    isEditing,
    nuevoUsuario,
    setNuevoUsuario,
    formFields,
    isSubmitting,
    confirmDialogVisible,
    usuarioToDelete,
    handleNuevoUsuario,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleVerDetalles,
    handleCancel,
    handleGuardarUsuario,
    handleCerrarDetalles,
  } = useUsuarios(toast, idUsuario);

  const columns = [
    {
      field: "email",
      header: (
        <div className="flex items-center gap-2">
          <IconoEmail /> Correo Electrónico
        </div>
      ),
      sortable: true,
      body: (data) => data.email || "No especificado",
    },
    {
      field: "nombreUsuario",
      header: (
        <div className="flex items-center gap-2">
          <IconoPlaca /> Nombre de Usuario
        </div>
      ),
      sortable: true,
      body: (data) => data.nombreUsuario || "No especificado",
    },
    {
      field: "rol.nombre",
      header: (
        <div className="flex items-center gap-2">
          <IconoPersona /> Rol
        </div>
      ),
      sortable: true,
      body: (data) => data.rol?.nombre || "No especificado",
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
        onClick={handleGuardarUsuario}
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
        message={`¿Estás seguro de que deseas eliminar al usuario ${
          usuarioToDelete?.nombreUsuario || "desconocido"
        }?`}
        header="Confirmar Eliminación"
        icon="pi pi-exclamation-triangle"
        accept={confirmDelete}
        reject={cancelDelete}
        acceptLabel="Sí, eliminar"
        rejectLabel="Cancelar"
      />
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Boton
          text="Registrar Usuario"
          icon={IconoCrear}
          onClick={handleNuevoUsuario}
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
        titulo={isEditing ? "Editar Usuario" : "Registrar Usuario"}
        footer={modalFooter}
      >
        <FormularioGenerico
          fields={formFields}
          formData={nuevoUsuario}
          onChange={(field, value) => {
            setNuevoUsuario({ ...nuevoUsuario, [field]: value });
          }}
        />
      </ModalFormulario>
      <UsuarioDetalles
        visible={detalleVisible}
        onHide={handleCerrarDetalles}
        usuario={usuarioSeleccionado}
      />
    </section>
  );
}

export default Usuarios;
