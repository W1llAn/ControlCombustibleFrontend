import { useState, useEffect } from "react";
import api from "../api/config"; // Importa la configuración de Axios

const useRutas = (toastRef) => {
  // Estado de la lista de rutas (formato interno del frontend)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado del formulario (formato interno)
  const [nuevaRuta, setNuevaRuta] = useState({
    nombre: "",
    puntoInicio: "",
    puntoFin: "",
    distancia: 0,
    estado: 1,
  });

  // Estado del modal y ruta seleccionada
  const [modalVisible, setModalVisible] = useState(false);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [estadoMap, setEstadoMap] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [rutaToDelete, setRutaToDelete] = useState(null);

  // Opciones para los dropdowns
  const estados = [
    { label: "Activo", value: 1 },
    { label: "Inactivo", value: 0 },
  ];

  // Campos del formulario
  const formFields = [
    {
      name: "nombre",
      label: "Nombre de la Ruta",
      type: "text",
      required: true,
      placeholder: "Ej. Ruta Norte",
    },
    {
      name: "puntoInicio",
      label: "Punto de Inicio",
      type: "text",
      required: true,
      placeholder: "Ej. Almacén Central",
    },
    {
      name: "puntoFin",
      label: "Punto de Fin",
      type: "text",
      required: true,
      placeholder: "Ej. Distribuidora Norte",
    },
    {
      name: "distancia",
      label: "Distancia (km)",
      type: "number",
      required: true,
      min: 0,
      step: 0.1,
      placeholder: "Ej. 120.5",
    },
    {
      name: "estado",
      label: "Estado",
      type: "dropdown",
      required: true,
      options: estados,
      placeholder: "Seleccione un estado",
    },
  ];

  // Convierte datos de la API al formato interno
  const toInternalFormat = (apiData) => ({
    id: apiData.id,
    nombre: apiData.nombre,
    puntoInicio: apiData.puntoInicio,
    puntoFin: apiData.puntoFin,
    distancia: apiData.distancia,
    estado: apiData.estado,
  });

  // Convierte datos internos al formato de la API
  const toApiFormat = (internalData) => ({
    id: internalData.id || 0,
    nombre: internalData.nombre,
    puntoInicio: internalData.puntoInicio,
    puntoFin: internalData.puntoFin,
    distancia: internalData.distancia,
    estado: internalData.estado,
  });

  // Cargar rutas al montar el componente
  const fetchRoutes = async () => {
    try {
      const response = await api.get("/Rutas/listar");
      const sortedData = response.data
        .map(toInternalFormat)
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
      setData(sortedData);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar las rutas:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail:
          "No se pudieron cargar las rutas. Verifica la conexión con el servidor.",
        life: 3000,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Validaciones del formulario
  const validateForm = () => {
    const validationErrors = [];

    if (!nuevaRuta.nombre || nuevaRuta.nombre.trim().length < 3) {
      validationErrors.push(
        "El nombre de la ruta debe tener al menos 3 caracteres"
      );
    }

    if (!nuevaRuta.puntoInicio || nuevaRuta.puntoInicio.trim().length === 0) {
      validationErrors.push("El punto de inicio es obligatorio");
    }

    if (!nuevaRuta.puntoFin || nuevaRuta.puntoFin.trim().length === 0) {
      validationErrors.push("El punto de fin es obligatorio");
    }

    if (nuevaRuta.distancia <= 0) {
      validationErrors.push("La distancia debe ser mayor a 0");
    }

    if (nuevaRuta.estado === null || nuevaRuta.estado === undefined) {
      validationErrors.push("Seleccione un estado");
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

  // Maneja el cambio de estado
  const handleEstadoChange = async (id, value) => {
    setEstadoMap((prev) => ({
      ...prev,
      [id]: value,
    }));
    const updatedRoute = {
      ...data.find((r) => r.id === id),
      estado: value ? 1 : 0,
    };
    try {
      await api.put("/Rutas/actualizar", toApiFormat(updatedRoute));
      setData((prev) =>
        prev.map((ruta) => (ruta.id === id ? updatedRoute : ruta))
      );
      toastRef.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Estado actualizado correctamente",
        life: 3000,
      });
    } catch (err) {
      console.error("Error al actualizar el estado:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar el estado",
        life: 3000,
      });
    }
  };

  // Abre el modal para crear una nueva ruta
  const handleNuevaRuta = () => {
    setNuevaRuta({
      nombre: "",
      puntoInicio: "",
      puntoFin: "",
      distancia: 0,
      estado: 1,
    });
    setRutaSeleccionada(null);
    setIsEditing(false);
    setModalVisible(true);
  };

  // Abre el modal para editar una ruta
  const handleEdit = async (ruta) => {
    try {
      const response = await api.get(`/Rutas/${ruta.id}`);
      setNuevaRuta(toInternalFormat(response.data));
      setRutaSeleccionada(toInternalFormat(response.data));
      setIsEditing(true);
      setModalVisible(true);
    } catch (err) {
      console.error("Error al cargar los datos de la ruta:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los datos de la ruta",
        life: 3000,
      });
    }
  };

  // Inicia el proceso de eliminación mostrando el ConfirmDialog
  const handleDelete = (ruta) => {
    setRutaToDelete(ruta);
    setConfirmDialogVisible(true);
  };

  // Confirma la eliminación de la ruta
  const confirmDelete = async () => {
    if (!rutaToDelete) return;

    try {
      await api.delete(`/Rutas/eliminar/${rutaToDelete.id}`);
      setData((prev) => prev.filter((r) => r.id !== rutaToDelete.id));
      toastRef.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Ruta eliminada correctamente",
        life: 3000,
      });
    } catch (err) {
      console.error("Error al eliminar la ruta:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar la ruta",
        life: 3000,
      });
    } finally {
      setConfirmDialogVisible(false);
      setRutaToDelete(null);
    }
  };

  // Cancela la eliminación
  const cancelDelete = () => {
    setConfirmDialogVisible(false);
    setRutaToDelete(null);
  };

  // Muestra los detalles de una ruta
  const handleVerDetalles = async (ruta) => {
    try {
      const response = await api.get(`/Rutas/${ruta.id}`);
      setRutaSeleccionada(toInternalFormat(response.data));
      setDetalleVisible(true);
    } catch (err) {
      console.error("Error al cargar los detalles de la ruta:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los detalles de la ruta",
        life: 3000,
      });
    }
  };

  // Cierra el modal
  const handleCancel = () => {
    setModalVisible(false);
    setRutaSeleccionada(null);
    setIsEditing(false);
  };

  // Cierra el modal de detalles
  const handleCerrarDetalles = () => {
    setDetalleVisible(false);
    setRutaSeleccionada(null);
  };

  // Guarda una ruta (crear o editar)
  const handleGuardarRuta = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const routeData = toApiFormat(nuevaRuta);

      if (isEditing) {
        // Editar ruta
        const response = await api.put("/Rutas/actualizar", routeData);
        setData((prev) =>
          prev.map((r) =>
            r.id === routeData.id ? toInternalFormat(response.data) : r
          )
        );
        toastRef.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Ruta actualizada correctamente",
          life: 3000,
        });
        fetchRoutes(); // Recargar la lista de rutas
      } else {
        // Crear ruta
        const response = await api.post("/Rutas/crear", routeData);
        setData((prev) => [...prev, toInternalFormat(response.data)]);
        toastRef.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Ruta creada correctamente",
          life: 3000,
        });
        fetchRoutes();
      }
      handleCancel();
    } catch (error) {
      console.error("Error al guardar la ruta:", error);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar la ruta",
        life: 3000,
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
    rutaSeleccionada,
    detalleVisible,
    isEditing,
    nuevaRuta,
    setNuevaRuta,
    formFields,
    isSubmitting,
    confirmDialogVisible,
    rutaToDelete,
    estados,
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
  };
};

export default useRutas;
