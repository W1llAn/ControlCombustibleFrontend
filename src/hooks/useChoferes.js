import { useState, useEffect } from "react";
import api from "../api/config"; // Importa la configuración de Axios
import { Toast } from "primereact/toast";

const useChoferes = (toastRef) => {
  // Estado de la lista de choferes (formato interno del frontend)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado del formulario (formato interno)
  const [nuevoChofer, setNuevoChofer] = useState({
    identificacion: "",
    nombre: "",
    email: "",
    nombreUsuario: "",
    hashContrasena: "",
    tipoMaquinaria: "",
    disponible: true,
    estado: "ACTIVO",
    fechaNacimiento: null,
    rolId: 9,
  });

  // Estado del modal y chofer seleccionado
  const [modalVisible, setModalVisible] = useState(false);
  const [choferSeleccionado, setChoferSeleccionado] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [disponibilidadMap, setDisponibilidadMap] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [choferToDelete, setChoferToDelete] = useState(null);

  // Opciones para los dropdowns
  const tiposMaquinaria = [
    { label: "Liviano", value: "Liviano" },
    { label: "Pesado", value: "Pesado" },
  ];

  const estados = [
    { label: "Activo", value: "ACTIVO" },
    { label: "Eliminado", value: "ELIMINADO" },
  ];

  // Campos del formulario
  const baseFormFields = [
    {
      name: "identificacion",
      label: "Cédula",
      type: "text",
      required: true,
      placeholder: "Ej. 1294567890",
    },
    {
      name: "nombre",
      label: "Nombre del Chofer",
      type: "text",
      required: true,
      placeholder: "Ej. Juan Pérez",
    },
    {
      name: "email",
      label: "Correo Electrónico",
      type: "text",
      required: false,
      placeholder: "Ej. juan.perez@example.com",
    },

    {
      name: "tipoMaquinaria",
      label: "Tipo de Maquinaria",
      type: "dropdown",
      required: true,
      options: tiposMaquinaria,
      placeholder: "Seleccione un tipo",
    },
    {
      name: "disponible",
      label: "Disponibilidad",
      type: "dropdown",
      required: true,
      options: [
        { label: "Disponible", value: true },
        { label: "No Disponible", value: false },
      ],
      placeholder: "Seleccione disponibilidad",
    },
    {
      name: "estado",
      label: "Estado",
      type: "dropdown",
      required: true,
      options: estados,
      placeholder: "Seleccione un estado",
    },
    {
      name: "fechaNacimiento",
      label: "Fecha de Nacimiento",
      type: "date",
      required: true,
    },
  ];
  const formFields = isEditing
    ? baseFormFields.filter((field) => field.name !== "email")
    : baseFormFields;

  // Convierte datos de la API al formato interno
  const toInternalFormat = (apiData) => ({
    id: apiData.id,
    identificacion: apiData.identificacion,
    nombre: apiData.nombre,
    email: apiData.email,
    nombreUsuario: apiData.email,
    hashContrasena: apiData.identificacion,
    tipoMaquinaria: apiData.tipoMaquinaria === 0 ? "Liviano" : "Pesado",
    disponible: apiData.disponible,
    estado: apiData.estado === 0 ? "ELIMINADO" : "ACTIVO",
    fechaNacimiento: apiData.fechaNacimiento
      ? new Date(apiData.fechaNacimiento)
      : null,
    rolId: 9,
    idUsuario: apiData.idUsuario || null,
  });

  // Convierte datos internos al formato de la API
  const toApiFormat = (internalData) => ({
    id: internalData.id || 0,
    identificacion: internalData.identificacion,
    nombre: internalData.nombre,
    email: internalData.email,
    nombreUsuario: internalData.email,
    hashContrasena: internalData.identificacion,
    tipoMaquinaria: internalData.tipoMaquinaria === "Liviano" ? 0 : 1,
    disponible: internalData.disponible,
    estado: internalData.estado === "ACTIVO" ? 1 : 0,
    fechaNacimiento: internalData.fechaNacimiento
      ? internalData.fechaNacimiento.toISOString()
      : null,
    rolId: 9,
    idUsuario: internalData.idUsuario || null,
  });

  // Cargar choferes al montar el componente
  const fetchChoferes = async () => {
    try {
      const response = await api.get("/Choferes/listar");
      const sortedData = response.data
        .map(toInternalFormat)
        .sort(
          (a, b) => new Date(b.fechaNacimiento) - new Date(a.fechaNacimiento)
        ); // Log para verificar los datos
      setData(sortedData);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar los choferes:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail:
          "No se pudieron cargar los choferes. Verifica la conexión con el servidor.",
        life: 9000,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChoferes();
  }, []);

  // Validaciones del formulario
  const validateForm = () => {
    const validationErrors = [];

    if (!nuevoChofer.identificacion || nuevoChofer.identificacion.length < 10) {
      validationErrors.push("La cédula debe tener 10 digitos");
    }

    if (!nuevoChofer.nombre) {
      validationErrors.push("El nombre del chofer es obligatorio");
    }

    if (!nuevoChofer.tipoMaquinaria) {
      validationErrors.push("Seleccione un tipo de maquinaria");
    }

    if (!nuevoChofer.fechaNacimiento) {
      validationErrors.push("La fecha de nacimiento es obligatoria");
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

  // Maneja el cambio de disponibilidad
  const handleDisponibilidadChange = async (id, value) => {
    setDisponibilidadMap((prev) => ({
      ...prev,
      [id]: value,
    }));
    const updatedChofer = {
      ...data.find((c) => c.id === id),
      disponible: value,
    };
    console.log("updatedChofer:", updatedChofer); // Log para verificar el objeto
    const payload = toApiFormat(updatedChofer);
    console.log("Payload enviado:", payload);
    try {
      const response = await api.put(
        "/Choferes/actualizar",
        toApiFormat(updatedChofer)
      );
      setData((prev) =>
        prev.map((chofer) => (chofer.id === id ? updatedChofer : chofer))
      );
      toastRef.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Disponibilidad actualizada correctamente",
        life: 9000,
      });
      console.log("Respuesta", response.data);
    } catch (err) {
      console.error("Error al actualizar la disponibilidad:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar la disponibilidad",
        life: 9000,
      });
    }
  };

  // Abre el modal para crear un nuevo chofer
  const handleNuevoChofer = () => {
    setNuevoChofer({
      identificacion: "",
      nombre: "",
      email: "",
      nombreUsuario: "",
      hashContrasena: "",
      tipoMaquinaria: "",
      disponible: true,
      estado: "ACTIVO",
      fechaNacimiento: null,
      rolId: 0,
    });
    setChoferSeleccionado(null);
    setIsEditing(false);
    setModalVisible(true);
  };

  // Abre el modal para editar un chofer
  const handleEdit = async (chofer) => {
    try {
      const response = await api.get(`/Choferes/${chofer.id}`);
      setNuevoChofer(toInternalFormat(response.data));
      setChoferSeleccionado(toInternalFormat(response.data));
      setIsEditing(true);
      setModalVisible(true);
    } catch (err) {
      console.error("Error al cargar los datos del chofer:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los datos del chofer",
        life: 9000,
      });
    }
  };

  // Inicia el proceso de eliminación mostrando el ConfirmDialog
  const handleDelete = (chofer) => {
    setChoferToDelete(chofer);
    setConfirmDialogVisible(true);
  };

  // Confirma la eliminación del chofer
  const confirmDelete = async () => {
    if (!choferToDelete) return;

    try {
      await api.delete(`/Choferes/eliminar/${choferToDelete.id}`);
      setData((prev) => prev.filter((c) => c.id !== choferToDelete.id));
      toastRef.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Chofer eliminado correctamente",
        life: 9000,
      });
    } catch (err) {
      console.error("Error al eliminar el chofer:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el chofer",
        life: 9000,
      });
    } finally {
      setConfirmDialogVisible(false);
      setChoferToDelete(null);
    }
  };

  // Cancela la eliminación
  const cancelDelete = () => {
    setConfirmDialogVisible(false);
    setChoferToDelete(null);
  };

  // Muestra los detalles de un chofer
  const handleVerDetalles = async (chofer) => {
    try {
      const response = await api.get(`/Choferes/${chofer.id}`);
      setChoferSeleccionado(toInternalFormat(response.data));
      setDetalleVisible(true);
    } catch (err) {
      console.error("Error al cargar los detalles del chofer:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los detalles del chofer",
        life: 9000,
      });
    }
  };

  // Cierra el modal
  const handleCancel = () => {
    setModalVisible(false);
    setChoferSeleccionado(null);
    setIsEditing(false);
  };

  // Cierra el modal de detalles
  const handleCerrarDetalles = () => {
    setDetalleVisible(false);
    setChoferSeleccionado(null);
  };

  // Guarda un chofer (crear o editar)
  const handleGuardarChofer = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const choferData = toApiFormat(nuevoChofer);

      if (isEditing) {
        // Editar chofer
        const response = await api.put("/Choferes/actualizar", choferData);
        setData((prev) =>
          prev.map((c) =>
            c.id === choferData.id ? toInternalFormat(response.data) : c
          )
        );
        toastRef.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Chofer actualizado correctamente",
          life: 9000,
        });
        fetchChoferes(); // Recargar la lista de choferes
      } else {
        // Crear chofer
        const response = await api.post("/Choferes/crear", choferData);
        setData((prev) => [...prev, toInternalFormat(response.data)]);
        toastRef.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Chofer creado correctamente",
          life: 9000,
        });
        fetchChoferes();
      }
      handleCancel();
    } catch (error) {
      console.error("Error al guardar el chofer:", error);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el chofer",
        life: 9000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    data,
    loading,
    modalVisible,
    setModalVisible,
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
    tiposMaquinaria,
    estados,
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
  };
};

export default useChoferes;
