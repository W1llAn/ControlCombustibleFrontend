import { useState, useEffect } from "react";
import api from "../api/config"; // Importa la configuración de Axios

const useVehiculos = (toastRef) => {
  // Estado de la lista de vehículos (formato interno del frontend)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado del formulario (formato interno)
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    placa: "",
    nombre: "",
    descripcion: "",
    tipoMaquinaria: "",
    estadoOperativo: "Operativo",
    capacidadCombustible: 0,
    consumoCombustibleKm: 0,
    fechaRegistro: null,
    estado: "Activo",
  });

  // Estado del modal y vehículo seleccionado
  const [modalVisible, setModalVisible] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [estadoOperativoMap, setEstadoOperativoMap] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [vehiculoToDelete, setVehiculoToDelete] = useState(null);

  // Opciones para los dropdowns
  const tiposMaquinaria = [
    { label: "Liviana", value: "Liviana" },
    { label: "Pesada", value: "Pesada" },
  ];

  const estadosOperativos = [
    { label: "Operativo", value: "Operativo" },
    { label: "Mantenimiento", value: "Mantenimiento" },
  ];

  // Campos del formulario
  const formFields = [
    {
      id: "placa",
      label: "Placa",
      type: "text",
      required: true,
      placeholder: "Ej. ABC123",
    },
    {
      id: "nombre",
      label: "Nombre del Vehículo",
      type: "text",
      required: true,
      placeholder: "Ej. Toyota Hilux",
    },
    {
      id: "descripcion",
      label: "Descripción",
      type: "text",
      required: false,
      placeholder: "Ej. Vehículo para transporte urbano",
    },
    {
      id: "tipoMaquinaria",
      label: "Tipo de Maquinaria",
      type: "dropdown",
      required: true,
      options: tiposMaquinaria,
      placeholder: "Seleccione un tipo",
    },
    {
      id: "estadoOperativo",
      label: "Estado Operativo",
      type: "dropdown",
      required: true,
      options: estadosOperativos,
      placeholder: "Seleccione un estado",
    },
    {
      id: "capacidadCombustible",
      label: "Capacidad de Combustible (litros)",
      type: "number",
      required: true,
      min: 0,
    },
    {
      id: "consumoCombustibleKm",
      label: "Consumo de Combustible (km/l)",
      type: "number",
      required: true,
      min: 0,
    },
    {
      id: "fechaRegistro",
      label: "Fecha de Registro",
      type: "date",
      required: true,
    },
  ];

  // Convierte datos de la API al formato interno
  const toInternalFormat = (apiData) => ({
    id: apiData.id,
    placa: apiData.placa,
    nombre: apiData.nombre,
    descripcion: apiData.descripcion,
    tipoMaquinaria: apiData.tipoMaquinaria,
    estadoOperativo: apiData.estadoOperativo,
    capacidadCombustible: apiData.capacidadCombustible,
    consumoCombustibleKm: apiData.consumoCombustibleKm,
    fechaRegistro: apiData.fechaRegistro
      ? new Date(apiData.fechaRegistro)
      : null,
    estado: apiData.estado,
  });

  // Convierte datos internos al formato de la API
  const toApiFormat = (internalData) => ({
    id: internalData.id || 0,
    placa: internalData.placa,
    nombre: internalData.nombre,
    descripcion: internalData.descripcion,
    tipoMaquinaria: internalData.tipoMaquinaria,
    estadoOperativo: internalData.estadoOperativo,
    capacidadCombustible: internalData.capacidadCombustible,
    consumoCombustibleKm: internalData.consumoCombustibleKm,
    fechaRegistro: internalData.fechaRegistro
      ? internalData.fechaRegistro.toISOString()
      : new Date().toISOString(),
    estado: internalData.estado,
  });

  // Cargar vehículos al montar el componente
  const fetchVehicles = async () => {
    try {
      const response = await api.get("/Vehiculos/listar");
      const sortedData = response.data
        .map(toInternalFormat)
        .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
      setData(sortedData);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar los vehículos:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail:
          "No se pudieron cargar los vehículos. Verifica la conexión con el servidor.",
        life: 3000,
      });
      setLoading(false);
      // Datos de respaldo
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Validaciones del formulario
  const validateForm = () => {
    const validationErrors = [];

    if (!nuevoVehiculo.placa || nuevoVehiculo.placa.length < 3) {
      validationErrors.push("La placa debe tener al menos 3 caracteres");
    }

    if (!nuevoVehiculo.nombre) {
      validationErrors.push("El nombre del vehículo es obligatorio");
    }

    if (!nuevoVehiculo.tipoMaquinaria) {
      validationErrors.push("Seleccione un tipo de maquinaria");
    }

    if (nuevoVehiculo.capacidadCombustible <= 0) {
      validationErrors.push("La capacidad de combustible debe ser mayor a 0");
    }

    if (nuevoVehiculo.consumoCombustibleKm <= 0) {
      validationErrors.push("El consumo de combustible debe ser mayor a 0");
    }

    if (!nuevoVehiculo.fechaRegistro) {
      validationErrors.push("La fecha de registro es obligatoria");
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

  // Maneja el cambio de estado operativo
  const handleEstadoChange = async (id, value) => {
    setEstadoOperativoMap((prev) => ({
      ...prev,
      [id]: value,
    }));
    const updatedVehicle = {
      ...data.find((v) => v.id === id),
      estadoOperativo: value ? "Operativo" : "Mantenimiento",
    };
    try {
      await api.put("/vehiculos/actualizar", toApiFormat(updatedVehicle));
      setData((prev) =>
        prev.map((vehiculo) => (vehiculo.id === id ? updatedVehicle : vehiculo))
      );
      toastRef.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Estado operativo actualizado correctamente",
        life: 3000,
      });
    } catch (err) {
      console.error("Error al actualizar el estado operativo:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar el estado operativo",
        life: 3000,
      });
    }
  };

  // Abre el modal para crear un nuevo vehículo
  const handleNuevoVehiculo = () => {
    setNuevoVehiculo({
      placa: "",
      nombre: "",
      descripcion: "",
      tipoMaquinaria: "",
      estadoOperativo: "Operativo",
      capacidadCombustible: 0,
      consumoCombustibleKm: 0,
      fechaRegistro: null,
      estado: "Activo",
    });
    setVehiculoSeleccionado(null);
    setIsEditing(false);
    setModalVisible(true);
  };

  // Abre el modal para editar un vehículo
  const handleEdit = async (vehiculo) => {
    try {
      const response = await api.get(`/Vehiculos/${vehiculo.id}`);
      setNuevoVehiculo(toInternalFormat(response.data));
      setVehiculoSeleccionado(toInternalFormat(response.data));
      setIsEditing(true);
      setModalVisible(true);
    } catch (err) {
      console.error("Error al cargar los datos del vehículo:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los datos del vehículo",
        life: 3000,
      });
    }
  };

  // Inicia el proceso de eliminación mostrando el ConfirmDialog
  const handleDelete = (vehiculo) => {
    setVehiculoToDelete(vehiculo);
    setConfirmDialogVisible(true);
  };

  // Confirma la eliminación del vehículo
  const confirmDelete = async () => {
    if (!vehiculoToDelete) return;

    try {
      await api.delete(`/Vehiculos/eliminar/${vehiculoToDelete.id}`);
      setData((prev) => prev.filter((v) => v.id !== vehiculoToDelete.id));
      toastRef.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Vehículo eliminado correctamente",
        life: 3000,
      });
    } catch (err) {
      console.error("Error al eliminar el vehículo:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el vehículo",
        life: 3000,
      });
    } finally {
      setConfirmDialogVisible(false);
      setVehiculoToDelete(null);
    }
  };

  // Cancela la eliminación
  const cancelDelete = () => {
    setConfirmDialogVisible(false);
    setVehiculoToDelete(null);
  };

  // Muestra los detalles de un vehículo
  const handleVerDetalles = async (vehiculo) => {
    try {
      const response = await api.get(`/Vehiculos/${vehiculo.id}`);
      setVehiculoSeleccionado(toInternalFormat(response.data));
      setDetalleVisible(true);
    } catch (err) {
      console.error("Error al cargar los detalles del vehículo:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los detalles del vehículo",
        life: 3000,
      });
    }
  };

  // Cierra el modal
  const handleCancel = () => {
    setModalVisible(false);
    setVehiculoSeleccionado(null);
    setIsEditing(false);
  };

  // Cierra el modal de detalles
  const handleCerrarDetalles = () => {
    setDetalleVisible(false);
    setVehiculoSeleccionado(null);
  };

  // Guarda un vehículo (crear o editar)
  const handleGuardarVehiculo = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const vehicleData = toApiFormat(nuevoVehiculo);

      if (isEditing) {
        // Editar vehículo
        const response = await api.put(
          "/vehiculos/actualizar",
          vehicleData,
          {}
        );
        setData((prev) =>
          prev.map((v) =>
            v.id === vehicleData.id ? toInternalFormat(response.data) : v
          )
        );
        toastRef.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Vehículo actualizado correctamente",
          life: 3000,
        });
        fetchVehicles(); // Recargar la lista de vehículos
      } else {
        // Crear vehículo
        const response = await api.post("/Vehiculos/crear", vehicleData);
        setData((prev) => [...prev, toInternalFormat(response.data)]);
        toastRef.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Vehículo creado correctamente",
          life: 3000,
        });
        fetchVehicles();
      }
      handleCancel();
    } catch (error) {
      console.error("Error al guardar el vehículo:", error);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el vehículo",
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
    vehiculoSeleccionado,
    detalleVisible,
    isEditing,
    nuevoVehiculo,
    setNuevoVehiculo,
    formFields,
    isSubmitting,
    confirmDialogVisible,
    vehiculoToDelete,
    tiposMaquinaria,
    estadosOperativos,
    estadoOperativoMap,
    handleEstadoChange,
    handleNuevoVehiculo,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleVerDetalles,
    handleCancel,
    handleGuardarVehiculo,
    handleCerrarDetalles,
  };
};

export default useVehiculos;
