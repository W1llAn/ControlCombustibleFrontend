import { useState, useEffect } from "react";
import api from "../api/config";
import { Toast } from "primereact/toast";

const useAsignacionesRutas = (toastRef) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [asignacionToDelete, setAsignacionToDelete] = useState(null);
  const [choferes, setChoferes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);

  const [nuevaAsignacion, setNuevaAsignacion] = useState({
    fechaAsignacion: new Date(),
    estado: "Pendiente",
    choferId: null,
    vehiculoId: null,
    rutaId: null,
  });

  // Cargar datos de choferes, vehículos y rutas
  const fetchData = async () => {
    try {
      setLoading(true);
      // Cargar choferes disponibles
      const choferesResponse = await api.get("/Choferes/listar");
      const choferesDisponibles = choferesResponse.data
        .filter((chofer) => chofer.disponible)
        .map((chofer) => ({
          id: chofer.id,
          identificacion: chofer.identificacion,
          nombre: chofer.nombre,
          tipoMaquinaria: chofer.tipoMaquinaria === 0 ? "Liviana" : "Pesada",
        }));
      setChoferes(choferesDisponibles);

      // Cargar vehículos
      const vehiculosResponse = await api.get("/Vehiculos/listar");
      const vehiculosData = vehiculosResponse.data.map((vehiculo) => ({
        id: vehiculo.id,
        placa: vehiculo.placa,
        nombre: vehiculo.nombre,
        tipoMaquinaria: vehiculo.tipoMaquinaria,
        capacidadCombustible: vehiculo.capacidadCombustible,
        consumoCombustibleKm: vehiculo.consumoCombustibleKm,
      }));
      setVehiculos(vehiculosData);
      setFilteredVehiculos(vehiculosData); // Inicialmente, todos los vehículos

      // Cargar rutas
      const rutasResponse = await api.get("/Rutas/listar");
      const rutasData = rutasResponse.data.map((ruta) => ({
        id: ruta.id,
        nombre: ruta.nombre,
        puntoInicio: ruta.puntoInicio,
        puntoFin: ruta.puntoFin,
        distancia: ruta.distancia,
      }));
      setRutas(rutasData);

      // Cargar asignaciones
      const asignacionesResponse = await api.get("/AsignacionRutas/listar");
      const sortedData = asignacionesResponse.data
        .map(toInternalFormat)
        .sort(
          (a, b) => new Date(b.fechaAsignacion) - new Date(a.fechaAsignacion)
        );
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
    fechaAsignacion: apiData.fechaAsignacion
      ? new Date(apiData.fechaAsignacion)
      : null,
    estado: apiData.estado === 1 ? "Pendiente" : "Completado",
    choferId: apiData.chofer?.id || null,
    vehiculoId: apiData.vehiculo?.id || null,
    rutaId: apiData.ruta?.id || null,
    chofer: {
      id: apiData.chofer?.id || null,
      nombre: apiData.chofer?.nombre || "No especificado",
      identificacion: apiData.chofer?.identificacion || "No especificado",
      tipoMaquinaria:
        apiData.chofer?.tipoMaquinaria === 0
          ? "Liviano"
          : apiData.chofer?.tipoMaquinaria === 1
          ? "Pesado"
          : apiData.chofer?.tipoMaquinaria || "No especificado",
      email: apiData.chofer?.usuario?.email || "No especificado",
      nombreUsuario:
        apiData.chofer?.usuario?.nombreUsuario || "No especificado",
    },
    vehiculo: {
      id: apiData.vehiculo?.id || null,
      placa: apiData.vehiculo?.placa || "No especificado",
      nombre: apiData.vehiculo?.nombre || "No especificado",
      tipoMaquinaria: apiData.vehiculo?.tipoMaquinaria || "No especificado",
      capacidadCombustible:
        apiData.vehiculo?.capacidadCombustible || "No especificado",
      consumoCombustibleKm:
        apiData.vehiculo?.consumoCombustibleKm || "No especificado",
      estadoOperativo: apiData.vehiculo?.estadoOperativo || "No especificado",
    },
    ruta: {
      id: apiData.ruta?.id || null,
      nombre: apiData.ruta?.nombre || "No especificado",
      puntoInicio: apiData.ruta?.puntoInicio || "No especificado",
      puntoFin: apiData.ruta?.puntoFin || "No especificado",
      distancia: apiData.ruta?.distancia || "No especificado",
    },
  });

  const toApiFormat = (
    internalData,
    isEditing = false,
    originalChoferId = null
  ) => {
    const baseData = {
      id: internalData.id || 0,
      fechaAsignacion: internalData.fechaAsignacion
        ? new Date(internalData.fechaAsignacion).toISOString().split("T")[0]
        : null, // No usar fecha actual como fallback
      estado: internalData.estado === "Pendiente" ? 1 : 0,
      choferId: internalData.choferId,
      vehiculoId: internalData.vehiculoId,
      rutaId: internalData.rutaId,
    };

    // Incluir choferIdAnterior solo en modo edición
    if (isEditing && originalChoferId !== null) {
      return {
        ...baseData,
        choferIdAnterior: originalChoferId,
      };
    }

    return baseData;
  };

  // Filtrar vehículos según el tipo de maquinaria del chofer
  const handleChoferChange = (choferId) => {
    const chofer = choferes.find((c) => c.id === choferId);
    const tipoMaquinaria = chofer ? chofer.tipoMaquinaria : null;
    setFilteredVehiculos(
      tipoMaquinaria
        ? vehiculos.filter((v) => v.tipoMaquinaria === tipoMaquinaria)
        : vehiculos
    );
    setNuevaAsignacion((prev) => ({
      ...prev,
      choferId,
      vehiculoId: null, // Resetear vehículo al cambiar chofer
    }));
  };

  // Definir los campos del formulario dinámicamente según el modo
  const getFormFields = () => {
    const baseFields = [
      {
        id: "fechaAsignacion",
        label: "Fecha de Asignación",
        type: "date",
        required: true,
      },
      {
        id: "choferId",
        label: "Chofer",
        type: "dropdown",
        required: true,
        options: choferes.map((chofer) => ({
          label: `${chofer.identificacion} - ${chofer.nombre}`,
          value: chofer.id,
        })),
        placeholder: "Seleccione un chofer",
        filter: true,
        onChange: handleChoferChange,
      },
      {
        id: "vehiculoId",
        label: "Vehículo",
        type: "dropdown",
        required: true,
        options: filteredVehiculos.map((vehiculo) => ({
          label: `${vehiculo.placa} - ${vehiculo.nombre}`,
          value: vehiculo.id,
        })),
        placeholder: "Seleccione un vehículo",
        filter: true,
      },
      {
        id: "rutaId",
        label: "Ruta",
        type: "dropdown",
        required: true,
        options: rutas.map((ruta) => ({
          label: ruta.nombre,
          value: ruta.id,
        })),
        placeholder: "Seleccione una ruta",
        filter: true,
      },
    ];

    if (isEditing) {
      baseFields.push({
        id: "estado",
        label: "Estado",
        type: "dropdown",
        required: true,
        options: [
          { label: "Pendiente", value: "Pendiente" },
          { label: "Completado", value: "Completado" },
        ],
        placeholder: "Seleccione un estado",
      });
    }

    return baseFields;
  };
  const validateForm = () => {
    const validationErrors = [];

    if (!nuevaAsignacion.fechaAsignacion) {
      validationErrors.push("La fecha de asignación es obligatoria");
    }
    if (!nuevaAsignacion.choferId) {
      validationErrors.push("Seleccione un chofer");
    }
    if (!nuevaAsignacion.vehiculoId) {
      validationErrors.push("Seleccione un vehículo");
    }
    if (!nuevaAsignacion.rutaId) {
      validationErrors.push("Seleccione una ruta");
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

  const handleNuevoAsignacion = () => {
    setNuevaAsignacion({
      fechaAsignacion: new Date().toISOString().split("T")[0],
      estado: "Pendiente",
      choferId: null,
      vehiculoId: null,
      rutaId: null,
    });
    setAsignacionSeleccionada(null);
    setIsEditing(false);
    setModalVisible(true);
    setFilteredVehiculos(vehiculos); // Resetear vehículos
  };

  const handleEdit = async (asignacion) => {
    const tipoConexionUrl = asignacion.vehiculo.tipoMaquinaria;
    try {
      const response = await api.get(
        `/AsignacionRutas/${tipoConexionUrl}/${asignacion.id}`
      );
      const asignacionData = toInternalFormat(response.data);
      setNuevaAsignacion(asignacionData);
      setAsignacionSeleccionada(asignacionData);
      setIsEditing(true);
      setModalVisible(true);
      // Filtrar vehículos según el tipo de maquinaria del chofer
      const chofer = choferes.find((c) => c.id === asignacionData.choferId);
      const tipoMaquinaria = chofer ? chofer.tipoMaquinaria : null;
      setFilteredVehiculos(
        tipoMaquinaria
          ? vehiculos.filter((v) => v.tipoMaquinaria === tipoMaquinaria)
          : vehiculos
      );
    } catch (err) {
      console.error("Error al cargar los datos de la asignación:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los datos de la asignación",
        life: 3000,
      });
    }
  };

  const handleDelete = (asignacion) => {
    setAsignacionToDelete(asignacion);
    setConfirmDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (!asignacionToDelete) return;

    try {
      await api.delete(
        `/AsignacionRutas/eliminar/${asignacionToDelete.vehiculo.tipoMaquinaria}/${asignacionToDelete.id}`
      );
      setData((prev) => prev.filter((a) => a.id !== asignacionToDelete.id));
      toastRef.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Asignación eliminada correctamente",
        life: 3000,
      });
    } catch (err) {
      console.error("Error al eliminar la asignación:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar la asignación",
        life: 3000,
      });
    } finally {
      setConfirmDialogVisible(false);
      setAsignacionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDialogVisible(false);
    setAsignacionToDelete(null);
  };

  const handleVerDetalles = async (asignacion) => {
    const tipoConexionUrl = asignacion.vehiculo.tipoMaquinaria;
    try {
      const response = await api.get(
        `/AsignacionRutas/${tipoConexionUrl}/${asignacion.id}`
      );
      setAsignacionSeleccionada(toInternalFormat(response.data));
      setDetalleVisible(true);
    } catch (err) {
      console.error("Error al cargar los detalles de la asignación:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los detalles de la asignación",
        life: 3000,
      });
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setAsignacionSeleccionada(null);
    setIsEditing(false);
    setFilteredVehiculos(vehiculos);
  };

  const handleCerrarDetalles = () => {
    setDetalleVisible(false);
    setAsignacionSeleccionada(null);
  };

  const handleGuardarAsignacion = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const asignacionData = toApiFormat(
        nuevaAsignacion,
        isEditing,
        isEditing ? asignacionSeleccionada?.choferId : null
      );

      if (isEditing) {
        const response = await api.put(
          "/AsignacionRutas/actualizar",
          asignacionData
        );
        setData((prev) =>
          prev.map((a) =>
            a.id === asignacionData.id ? toInternalFormat(response.data) : a
          )
        );
        toastRef.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Asignación actualizada correctamente",
          life: 3000,
        });
      } else {
        const response = await api.post(
          "/AsignacionRutas/crear",
          asignacionData
        );
        setData((prev) => [...prev, toInternalFormat(response.data)]);
        toastRef.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Asignación creada correctamente",
          life: 3000,
        });
      }
      await fetchData(); // Recargar datos para asegurar consistencia
    } catch (error) {
      console.error("Error al guardar la asignación:", error);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar la asignación",
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
    asignacionSeleccionada,
    detalleVisible,
    isEditing,
    nuevaAsignacion,
    setNuevaAsignacion,
    formFields: getFormFields(),
    isSubmitting,
    confirmDialogVisible,
    asignacionToDelete,
    handleNuevoAsignacion,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleVerDetalles,
    handleCancel,
    handleGuardarAsignacion,
    handleCerrarDetalles,
  };
};

export default useAsignacionesRutas;
