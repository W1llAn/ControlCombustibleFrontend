import { useState, useEffect } from "react";
import api from "../api/config";
import { Toast } from "primereact/toast";

// Asumimos que el ID del usuario autenticado está disponible (puedes reemplazar esto con tu mecanismo real)
const authUserId = 1;
const useUsuarios = (toastRef) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [roles, setRoles] = useState([]);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    email: "",
    nombreUsuario: "",
    hashContrasena: "",
    rolId: null, // Inicializar como null para requerir selección
  });

  // Cargar datos de roles y usuarios
  const fetchData = async () => {
    try {
      setLoading(true);
      // Cargar roles, excluyendo "Operador" (rolId: 3)
      const rolesResponse = await api.get("/Roles/listar");
      const rolesFiltrados = rolesResponse.data
        .filter((rol) => rol.nombre !== "Operador")
        .map((rol) => ({
          id: rol.id,
          nombre: rol.nombre,
          descripcion: rol.descripcion,
        }));
      setRoles(rolesFiltrados);

      // Cargar usuarios, excluyendo los de rol "Operador" (rolId: 3)
      const usuariosResponse = await api.get("/Usuarios/listar");
      const sortedData = usuariosResponse.data
        .filter((usuario) => usuario.rol.nombre !== "Operador")
        .map(toInternalFormat)
        .sort((a, b) => a.nombreUsuario.localeCompare(b.nombreUsuario));
      setData(sortedData);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail:
          "No se pudieron cargar los datos. Verifica la conexión con el servidor.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toInternalFormat = (apiData) => ({
    id: apiData.id,
    email: apiData.email || "No especificado",
    nombreUsuario: apiData.nombreUsuario || "No especificado",
    hashContrasena: apiData.hashContrasena || "No especificado",
    rolId: apiData.rolId || null,
    rol: {
      id: apiData.rol?.id || null,
      nombre: apiData.rol?.nombre || "No especificado",
      descripcion: apiData.rol?.descripcion || "No especificado",
    },
  });

  const toApiFormat = (internalData) => ({
    id: internalData.id || 0,
    email: internalData.email,
    nombreUsuario: internalData.nombreUsuario,
    hashContrasena: internalData.hashContrasena,
    rolId: internalData.rolId,
  });

  // Definir los campos del formulario dinámicamente
  const getFormFields = () => {
    const baseFields = [
      {
        id: "email",
        label: "Correo Electrónico",
        type: "text",
        required: true,
        placeholder: "Ingrese el correo electrónico",
        value: nuevoUsuario.email,
      },
      {
        id: "nombreUsuario",
        label: "Nombre de Usuario",
        type: "text",
        required: true,
        placeholder: "Ingrese el nombre de usuario",
        value: nuevoUsuario.nombreUsuario,
      },
      {
        id: "hashContrasena",
        label: "Contraseña",
        type: "password",
        required: true,
        placeholder: "Ingrese la contraseña",
        value: nuevoUsuario.hashContrasena,
      },
      {
        id: "rolId",
        label: "Rol",
        type: "dropdown",
        required: true,
        options: roles.map((rol) => ({
          label: `${rol.nombre} - ${rol.descripcion}`,
          value: rol.id,
        })),
        placeholder: "Seleccione un rol",
        filter: true,
        value: nuevoUsuario.rolId,
      },
    ];

    return baseFields;
  };

  const validateForm = () => {
    const validationErrors = [];

    if (!nuevoUsuario.email) {
      validationErrors.push("El correo electrónico es obligatorio");
    } else if (!/\S+@\S+\.\S+/.test(nuevoUsuario.email)) {
      validationErrors.push("El correo electrónico no es válido");
    }
    if (!nuevoUsuario.nombreUsuario) {
      validationErrors.push("El nombre de usuario es obligatorio");
    }
    if (!nuevoUsuario.hashContrasena) {
      validationErrors.push("La contraseña es obligatoria");
    }
    if (!nuevoUsuario.rolId) {
      validationErrors.push("Seleccione un rol");
    }

    if (validationErrors.length > 0) {
      toastRef.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: `Errores en el formulario:\n- ${validationErrors.join("\n- ")}`,
        life: 5000,
      });
      return false;
    }

    return true;
  };

  const handleNuevoUsuario = () => {
    setNuevoUsuario({
      email: "",
      nombreUsuario: "",
      hashContrasena: "",
      rolId: null, // Requiere selección manual
    });
    setUsuarioSeleccionado(null);
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleEdit = (usuario) => {
    // Usar los datos de la fila directamente
    const usuarioData = {
      id: usuario.id,
      email: usuario.email || "No especificado",
      nombreUsuario: usuario.nombreUsuario || "No especificado",
      hashContrasena: usuario.hashContrasena || "No especificado",
      rolId: usuario.rol.id || null,
    };
    setNuevoUsuario(usuarioData);
    setUsuarioSeleccionado(usuario);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDelete = (usuario) => {
    // Verificar si el usuario es el autenticado
    if (usuario.id === authUserId) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No puedes eliminar tu propio usuario.",
        life: 3000,
      });
      return;
    }
    setUsuarioToDelete(usuario);
    setConfirmDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (!usuarioToDelete) return;

    try {
      await api.delete(`/Usuarios/eliminar/${usuarioToDelete.id}`);
      setData((prev) => prev.filter((u) => u.id !== usuarioToDelete.id));
      toastRef.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Usuario eliminado correctamente",
        life: 3000,
      });
    } catch (err) {
      console.error("Error al eliminar el usuario:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el usuario",
        life: 3000,
      });
    } finally {
      setConfirmDialogVisible(false);
      setUsuarioToDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDialogVisible(false);
    setUsuarioToDelete(null);
  };

  const handleVerDetalles = (usuario) => {
    // Usar los datos de la fila directamente
    setUsuarioSeleccionado(usuario);
    setDetalleVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setUsuarioSeleccionado(null);
    setIsEditing(false);
  };

  const handleCerrarDetalles = () => {
    setDetalleVisible(false);
    setUsuarioSeleccionado(null);
  };

  const handleGuardarUsuario = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const usuarioData = toApiFormat(nuevoUsuario);

      if (isEditing) {
        const response = await api.put("/Usuarios/actualizar", usuarioData);
        setData((prev) =>
          prev.map((u) =>
            u.id === usuarioData.id ? toInternalFormat(response.data) : u
          )
        );
        toastRef.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Usuario actualizado correctamente",
          life: 3000,
        });
      } else {
        const response = await api.post("/Usuarios/registrar", usuarioData);
        setData((prev) => [...prev, toInternalFormat(response.data)]);
        toastRef.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Usuario creado correctamente",
          life: 3000,
        });
      }
      await fetchData(); // Recargar datos para asegurar consistencia
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el usuario",
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
      handleCancel();
    }
  };

  return {
    data,
    loading,
    modalVisible,
    setModalVisible,
    globalFilter,
    setGlobalFilter,
    usuarioSeleccionado,
    detalleVisible,
    isEditing,
    nuevoUsuario,
    setNuevoUsuario,
    formFields: getFormFields(),
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
  };
};

export default useUsuarios;
