import React, { useRef } from "react";
import DataTableGenerico from "../components/DataTableGenerico";
import {
  IconoComsumoCombsutible,
  IconoCrear,
  IconoChofer,
  IconoNombreVehiculo,
  IconoRuta,
  IconoGasolina,
} from "../assets/IconosComponentes/";
import AccionesTemplate from "../components/AccionesTemplate";
import { Button } from "primereact/button";
import Boton from "../components/Boton";
import FormularioGenerico from "../components/FormularioGenerico";
import ModalFormulario from "../components/ModalFormulario";
import ConsumoDetalles from "../components/ConsumoDetalles";
import useConsumoCombustible from "../hooks/useConsumoCombustible";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";

function ConsumoCombustible() {
  const toast = useRef(null);
  const {
    data,
    modalVisible,
    globalFilter,
    setGlobalFilter,
    consumoSeleccionado,
    detalleVisible,
    isEditing,
    nuevoConsumo,
    setNuevoConsumo,
    formFields,
    isSubmitting,
    confirmDialogVisible,
    consumoToDelete,
    handleNuevoConsumo,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleVerDetalles,
    handleCancel,
    handleGuardarConsumo,
    handleCerrarDetalles,
    rol,
  } = useConsumoCombustible(toast);

  const getCombustibleColor = (combustibleReal, combustibleEstimado) => {
    if (combustibleReal <= combustibleEstimado) {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-orange-100 text-orange-800";
    }
  };

  const columns = [
    {
      field: "chofer",
      header: (
        <div>
          <IconoChofer /> Chofer
        </div>
      ),
      sortable: true,
      body: (data) => data.chofer?.nombre || "N/A",
    },
    {
      field: "vehiculo",
      header: (
        <div>
          <IconoNombreVehiculo /> Vehículo
        </div>
      ),
      sortable: true,
      body: (data) => data.vehiculo?.nombre || "N/A",
    },
    {
      field: "ruta",
      header: (
        <div>
          <IconoRuta /> Ruta
        </div>
      ),
      sortable: true,
      body: (data) => data.ruta?.nombre || "N/A",
    },
    {
      field: "combustibleEstimado",
      header: (
        <div>
          <IconoGasolina /> Combustible Estimado
        </div>
      ),
      sortable: true,
      body: (data) => `${data.combustibleEstimado || 0} L`,
    },
    {
      field: "combustibleReal",
      header: (
        <div>
          <IconoComsumoCombsutible /> Combustible promedio consumido
        </div>
      ),
      sortable: true,
      body: (data) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCombustibleColor(
            data.combustibleReal,
            data.combustibleEstimado
          )}`}>
          {data.combustibleReal} L
        </span>
      ),
    },
  ];

  const actions = (data) => {
    if (rol === "Operador") {
      return (
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info p-button-text p-button-sm"
          onClick={() => handleVerDetalles(data)}
          tooltip="Ver detalles"
          tooltipOptions={{ position: "top" }}
        />
      );
    }

    return (
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
  };

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
        onClick={handleGuardarConsumo}
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
        message={`¿Estás seguro de que deseas eliminar este registro de consumo?`}
        header="Confirmar Eliminación"
        icon="pi pi-exclamation-triangle"
        accept={confirmDelete}
        reject={cancelDelete}
        acceptLabel="Sí, eliminar"
        rejectLabel="Cancelar"
      />

      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Gestión Consumo de combustible</h1>
        {rol === "Operador" && (
          <Boton
            text="Registrar Consumo"
            icon={IconoCrear}
            onClick={handleNuevoConsumo}
          />
        )}
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
        titulo={isEditing ? "Editar Consumo" : "Registrar Consumo"}
        footer={modalFooter}
        width="120vw">
        <FormularioGenerico
          fields={formFields}
          formData={nuevoConsumo}
          onChange={setNuevoConsumo}
        />
      </ModalFormulario>

      <ConsumoDetalles
        visible={detalleVisible}
        onHide={handleCerrarDetalles}
        consumo={consumoSeleccionado}
      />
    </section>
  );
}

export default ConsumoCombustible;
