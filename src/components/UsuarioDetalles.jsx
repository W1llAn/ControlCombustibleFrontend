import React from "react";
import ModalFormulario from "./ModalFormulario";

const UsuarioDetalles = ({ visible, onHide, usuario }) => {
  return (
    <ModalFormulario
      visible={visible}
      onHide={onHide}
      titulo="Detalles del Usuario"
    >
      {usuario && (
        <div className="grid gap-6 mt-4">
          <div className="border-b pb-4">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">
              Información del Usuario
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Correo Electrónico</p>
                <p className="font-medium">
                  {usuario.email || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nombre de Usuario</p>
                <p className="font-medium">
                  {usuario.nombreUsuario || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <p className="font-medium">
                  {usuario.rol?.nombre || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Descripción del Rol</p>
                <p className="font-medium">
                  {usuario.rol?.descripcion || "No especificado"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalFormulario>
  );
};

export default UsuarioDetalles;
