import React from "react";
import { Dialog } from "primereact/dialog";

const ModalFormulario = ({ visible, onHide, titulo, children, footer }) => {
  const renderHeader = () => (
    <div className="flex justify-content-between align-items-center">
      <span>{titulo}</span>
      <button
        data-testid="modal-close-button"
        onClick={onHide}
        className="p-dialog-header-icon p-dialog-header-close p-link"
      >
        <span className="pi pi-times" />
      </button>
    </div>
  );

  return (
    <Dialog
      header={renderHeader}
      visible={visible}
      style={{ width: "40vw" }}
      onHide={onHide}
      modal
      className="p-fluid"
    >
      {children}
      {footer && <div className="pt-4">{footer}</div>}
    </Dialog>
  );
};

export default ModalFormulario;
