import { useState, useEffect } from "react";
import api from "../api/config";
import { jwtDecode } from "jwt-decode";

const useConsumoCombustible = (toastRef) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [asignaciones, setAsignaciones] = useState([]);
  const [nuevoConsumo, setNuevoConsumo] = useState({
    fechaRegistro: new Date(),
    estado: 1,
    combustibleReal: 0,
    asignacionRutaId: null,
    motivo: "",
    combustibleEstimado: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [consumoSeleccionado, setConsumoSeleccionado] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [consumoToDelete, setConsumoToDelete] = useState(null);
  const [rol, setRol] = useState(null);
  const editableFields = ["combustibleReal", "motivo"];

  const calculateCombustibleEstimado = (asignacionRutaId) => {
    const asignacion = asignaciones.find((a) => a.id === asignacionRutaId);
    if (asignacion) {
      const distancia = asignacion.ruta?.distancia || 0;
      const consumoKm = asignacion.vehiculo?.consumoCombustibleKm || 0;
      return parseFloat((distancia * consumoKm).toFixed(1)); // Convertir a número
    }
    return 0;
  };

  const formFields = [
    {
      name: "fechaRegistro",
      label: "Fecha de Registro",
      type: "date",
      required: true,
      disabled: true,
    },
    {
      name: "asignacionRutaId",
      label: "Asignación de Ruta",
      type: "dropdown",
      required: true,
      options: asignaciones.map((asignacion) => ({
        label: `${asignacion.chofer.nombre} - ${asignacion.vehiculo.nombre} - ${asignacion.ruta.nombre}`,
        value: asignacion.id,
      })),
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione una asignación",
      disabled: isEditing, // Bloqueado en modo edición
    },
    {
      name: "combustibleEstimado",
      label: "Combustible Estimado (litros)",
      type: "number",
      required: false,
      disabled: true,
    },
    {
      name: "combustibleReal",
      label: "Combustible Real Consumido (litros)",
      type: "number",
      required: true,
      locale: "en-US",
      maxFractionDigits: 3,
      disabled: isEditing && !editableFields.includes("combustibleReal"),
      onChange: (value) => {
        handleConsumoChange("combustibleReal", value);
        // Forzar actualización del campo motivo
        handleConsumoChange("motivo", nuevoConsumo.motivo);
      },
    },
    {
      name: "motivo",
      label: "Motivo/Observaciones",
      type: "textarea",
      required: nuevoConsumo.combustibleReal > nuevoConsumo.combustibleEstimado,
      placeholder: "Ingrese observaciones o motivos del consumo",
      rows: 3,
      visible: nuevoConsumo.combustibleReal > nuevoConsumo.combustibleEstimado,
      disabled: isEditing && !editableFields.includes("motivo"),
    },
  ];

  const toInternalFormat = (apiData) => ({
    id: apiData.id,
    fechaRegistro: apiData.fechaRegistro
      ? new Date(apiData.fechaRegistro)
      : new Date(),
    estado: apiData.estado,
    combustibleReal: apiData.combustibleReal,
    asignacionRutaId: apiData.asignacionRuta?.id || null, // CORREGIDO: Usar el ID
    motivo: apiData.motivo || "",
    combustibleEstimado: apiData.combustibleEstimado || 0,
    chofer: apiData.asignacionRuta?.chofer || {
      id: null,
      nombre: "",
      identificacion: "",
      disponible: false,
      fechaNacimiento: "",
      idUsuario: null,
      usuario: { id: null, email: "", nombreUsuario: "" },
    },
    vehiculo: apiData.asignacionRuta?.vehiculo || {
      id: null,
      placa: "",
      tipoMaquinaria: "",
      estadoOperativo: "",
      capacidadCombustible: 0,
      fechaRegistro: "",
      consumoCombustibleKm: 0,
      estado: "",
      descripcion: "",
      nombre: "",
    },
    ruta: apiData.asignacionRuta?.ruta || {
      id: null,
      nombre: "",
      puntoInicio: "",
      puntoFin: "",
      distancia: 0,
      estado: 0,
    },
  });

  const toApiFormat = (internalData) => ({
    id: internalData.id || 0,
    fechaRegistro: internalData.fechaRegistro
      ? internalData.fechaRegistro.toISOString()
      : new Date().toISOString(),
    estado: 1,
    combustibleReal: internalData.combustibleReal,
    asignacionRutaId: internalData.asignacionRutaId,
    motivo:
      internalData.combustibleReal > internalData.combustibleEstimado
        ? internalData.motivo || ""
        : "Sin motivo",
    combustibleEstimado: parseFloat(internalData.combustibleEstimado) || 0,
  });

  const fetchAsignaciones = async () => {
    try {
      const response = await api.get("/AsignacionRutas/listar");
      const token = localStorage.getItem("jwtToken");
      let asignacionesFiltradas = response.data;

      if (token) {
        const decoded = jwtDecode(token);
        setRol(decoded.Rol);
        const idUsuario = parseInt(decoded.idUsuario);

        if (decoded.Rol === "Operador") {
          asignacionesFiltradas = response.data.filter(
            (a) => a.chofer?.idUsuario === idUsuario
          );
        }
      }
      setAsignaciones(asignacionesFiltradas);
    } catch (err) {
      console.error("Error al cargar las asignaciones:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las asignaciones de rutas",
        life: 3000,
      });
    }
  };

  const fetchConsumos = async () => {
    try {
      const response = await api.get("/ConsumoCombustible/listar");
      const sortedData = response.data
        .map(toInternalFormat)
        .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
      setData(sortedData);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar los consumos:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los consumos de combustible",
        life: 3000,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsignaciones();
    fetchConsumos();
  }, []);

  const validateForm = () => {
    const errors = [];
    if (!nuevoConsumo.fechaRegistro)
      errors.push("La fecha de registro es obligatoria");
    if (!nuevoConsumo.asignacionRutaId)
      errors.push("Debe seleccionar una asignación de ruta");
    if (nuevoConsumo.combustibleReal <= 0)
      errors.push("El combustible real debe ser mayor a 0");
    if (
      nuevoConsumo.combustibleReal > nuevoConsumo.combustibleEstimado &&
      !nuevoConsumo.motivo
    )
      errors.push(
        "El motivo es obligatorio si el combustible real excede el estimado"
      );

    if (errors.length > 0) {
      toastRef.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: `Errores:\n- ${errors.join("\n- ")}`,
        life: 5000,
      });
      return false;
    }
    return true;
  };

  const handleNuevoConsumo = () => {
    setNuevoConsumo({
      fechaRegistro: new Date(),
      estado: 1,
      combustibleReal: 0,
      asignacionRutaId: null,
      motivo: "",
      combustibleEstimado: 0,
    });
    setConsumoSeleccionado(null);
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleEdit = async (consumo) => {
    console.log("Editando consumo:", consumo);

    try {
      const response = await api.get(
        `/ConsumoCombustible/${consumo.vehiculo.tipoMaquinaria}/${consumo.id}`
      );
      console.log("Datos del consumo a editar:", response.data);

      const consumoData = toInternalFormat(response.data);

      // Calculamos el combustible estimado usando asignacionRutaId
      const combustibleEstimado = calculateCombustibleEstimado(
        consumoData.asignacionRutaId
      );

      setNuevoConsumo({
        ...consumoData,
        combustibleEstimado,
      });
      setConsumoSeleccionado(consumoData);
      setIsEditing(true);
      setModalVisible(true);
    } catch (err) {
      console.error("Error al cargar consumo:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los datos del consumo",
        life: 3000,
      });
    }
  };

  const handleDelete = (consumo) => {
    setConsumoToDelete(consumo);
    setConfirmDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (!consumoToDelete) return;
    try {
      await api.delete(
        `/ConsumoCombustible/eliminar/${consumoToDelete.vehiculo.tipoMaquinaria}/${consumoToDelete.id}`
      );
      setData((prev) => prev.filter((c) => c.id !== consumoToDelete.id));
      toastRef.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Consumo eliminado correctamente",
        life: 3000,
      });
    } catch (err) {
      console.error("Error al eliminar consumo:", err);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el consumo",
        life: 3000,
      });
    } finally {
      setConfirmDialogVisible(false);
      setConsumoToDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDialogVisible(false);
    setConsumoToDelete(null);
  };

  const handleVerDetalles = async (consumo) => {
    if (rol !== "Operador") {
      try {
        let tipoMaquinaria = consumo.vehiculo.tipoMaquinaria;

        const response = await api.get(
          `/ConsumoCombustible/${tipoMaquinaria}/${consumo.id}`
        );
        setConsumoSeleccionado(toInternalFormat(response.data));
        setDetalleVisible(true);
      } catch (err) {
        console.error("Error al cargar detalles:", err);
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los detalles",
          life: 3000,
        });
      }
    } else {
      try {
        let tipoMaquinaria = consumo.vehiculo.tipoMaquinaria;

        const response = await api.get(`/ConsumoCombustible/${consumo.id}`);
        setConsumoSeleccionado(toInternalFormat(response.data));
        setDetalleVisible(true);
      } catch (err) {
        console.error("Error al cargar detalles:", err);
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los detalles",
          life: 3000,
        });
      }
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setConsumoSeleccionado(null);
    setIsEditing(false);
  };

  const handleCerrarDetalles = () => {
    setDetalleVisible(false);
    setConsumoSeleccionado(null);
  };

  const handleGuardarConsumo = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const consumoData = toApiFormat(nuevoConsumo);
      if (isEditing) {
        const response = await api.put(
          `/ConsumoCombustible/actualizar/${nuevoConsumo.vehiculo.tipoMaquinaria}`,
          consumoData
        );
        setData((prev) =>
          prev.map((c) =>
            c.id === consumoData.id ? toInternalFormat(response.data) : c
          )
        );
        toastRef.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Consumo actualizado correctamente",
          life: 3000,
        });
      } else {
        console.log("Guardando nuevo consumo:", consumoData);

        const response = await api.post(
          "/ConsumoCombustible/crear",
          consumoData
        );
        setData((prev) => [...prev, toInternalFormat(response.data)]);
        toastRef.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Consumo creado correctamente",
          life: 3000,
        });
      }
      fetchConsumos();
      handleCancel();
    } catch (error) {
      console.error("Error al guardar consumo:", error);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el consumo",
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConsumoChange = (field, value) => {
    let updatedConsumo = { ...nuevoConsumo, [field]: value };
    if (field === "asignacionRutaId") {
      updatedConsumo.combustibleEstimado = calculateCombustibleEstimado(value);
    }
    setNuevoConsumo(updatedConsumo);
  };

  return {
    data,
    loading,
    modalVisible,
    setModalVisible,
    globalFilter,
    setGlobalFilter,
    rol,
    consumoSeleccionado,
    detalleVisible,
    isEditing,
    nuevoConsumo,
    setNuevoConsumo: handleConsumoChange,
    formFields,
    isSubmitting,
    confirmDialogVisible,
    consumoToDelete,
    asignaciones,
    handleNuevoConsumo,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleVerDetalles,
    handleCancel,
    handleGuardarConsumo,
    handleCerrarDetalles,
  };
};

export default useConsumoCombustible;
