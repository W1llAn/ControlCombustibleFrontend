import PropTypes from "prop-types";
import { Button } from "primereact/button"; // Usamos íconos con p-button

const accionesTemplate = ({ rowData, onEdit, onDelete }) => {
  // Validaciones para asegurarse de que onEdit y onDelete sean funciones
  const handleEdit =
    typeof onEdit === "function" ? () => onEdit(rowData) : () => {};
  const handleDelete =
    typeof onDelete === "function" ? () => onDelete(rowData) : () => {};
  return (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text p-button-sm"
        onClick={handleEdit}
        tooltip="Editar"
        data-testid="edit-button"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-text p-button-sm"
        onClick={handleDelete}
        tooltip="Eliminar"
        data-testid="delete-button"
      />
    </div>
  );
};
accionesTemplate.propTypes = {
  rowData: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
export default accionesTemplate;
