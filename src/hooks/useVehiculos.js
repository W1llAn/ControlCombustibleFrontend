import { useState } from "react";

const useVehiculos = () => {
  // Estado de la lista de vehículos
  const [data, setData] = useState([
    {
      id: 1,
      placa: "ABC123",
      nombre_vehiculo: "Toyota Hilux",
      descripcion: "Vehículo liviano para transporte urbano.",
      tipo_maquinaria: "Liviana",
      estado_operativo: "Operativo",
      capacidad_combustible: 80.5,
      consumo_combustible_km: 5.2,
      fecha_registro: "2024-12-01T10:00:00",
      estado: "Activo",
    },
    {
      id: 2,
      placa: "XYZ789",
      nombre_vehiculo: "Caterpillar 950M",
      descripcion: "Cargadora pesada usada en obras viales.",
      tipo_maquinaria: "Pesada",
      estado_operativo: "Mantenimiento",
      capacidad_combustible: 120.0,
      consumo_combustible_km: 3.8,
      fecha_registro: "2023-08-15T14:30:00",
      estado: "Activo",
    },
    {
      id: 3,
      placa: "LMN456",
      nombre_vehiculo: "Ford Ranger",
      descripcion: "Camioneta liviana con uso en logística.",
      tipo_maquinaria: "Liviana",
      estado_operativo: "Operativo",
      capacidad_combustible: 65.0,
      consumo_combustible_km: 6.1,
      fecha_registro: "2025-01-10T08:45:00",
      estado: "Eliminado",
    },
    {
      id: 4,
      placa: "DEF234",
      nombre_vehiculo: "Volvo FMX",
      descripcion: "Camión pesado para transporte de carga.",
      tipo_maquinaria: "Pesada",
      estado_operativo: "Operativo",
      capacidad_combustible: 150.2,
      consumo_combustible_km: 4.3,
      fecha_registro: "2022-05-20T11:15:00",
      estado: "Activo",
    },
    {
      id: 5,
      placa: "GHI567",
      nombre_vehiculo: "Nissan Frontier",
      descripcion: "Vehículo de apoyo en operaciones de campo.",
      tipo_maquinaria: "Liviana",
      estado_operativo: "Mantenimiento",
      capacidad_combustible: 70.0,
      consumo_combustible_km: 5.0,
      fecha_registro: "2023-11-25T09:00:00",
      estado: "Activo",
    },
  ]);

  // Estado del formulario
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    placa: "",
    nombre_vehiculo: "",
    descripcion: "",
    tipo_maquinaria: "",
    estado_operativo: "Operativo",
    capacidad_combustible: 0,
    consumo_combustible_km: 0,
    fecha_registro: null,
    estado: "Activo",
  });

  // Estado del modal y vehículo seleccionado
  const [modalVisible, setModalVisible] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [estadoOperativoMap, setEstadoOperativoMap] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      id: "nombre_vehiculo",
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
      id: "tipo_maquinaria",
      label: "Tipo de Maquinaria",
      type: "dropdown",
      required: true,
      options: tiposMaquinaria,
      placeholder: "Seleccione un tipo",
    },
    {
      id: "estado_operativo",
      label: "Estado Operativo",
      type: "dropdown",
      required: true,
      options: estadosOperativos,
      placeholder: "Seleccione un estado",
    },
    {
      id: "capacidad_combustible",
      label: "Capacidad de Combustible (litros)",
      type: "number",
      required: true,
      min: 0,
    },
    {
      id: "consumo_combustible_km",
      label: "Consumo de Combustible (km/l)",
      type: "number",
      required: true,
      min: 0,
    },
    {
      id: "fecha_registro",
      label: "Fecha de Registro",
      type: "date",
      required: true,
    },
  ];

  // Validaciones del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!nuevoVehiculo.placa || nuevoVehiculo.placa.length < 3) {
      newErrors.placa = "La placa debe tener al menos 3 caracteres";
    }

    if (!nuevoVehiculo.nombre_vehiculo) {
      newErrors.nombre_vehiculo = "El nombre del vehículo es obligatorio";
    }

    if (!nuevoVehiculo.tipo_maquinaria) {
      newErrors.tipo_maquinaria = "Seleccione un tipo de maquinaria";
    }

    if (nuevoVehiculo.capacidad_combustible <= 0) {
      newErrors.capacidad_combustible = "La capacidad debe ser mayor a 0";
    }

    if (nuevoVehiculo.consumo_combustible_km <= 0) {
      newErrors.consumo_combustible_km = "El consumo debe ser mayor a 0";
    }

    if (!nuevoVehiculo.fecha_registro) {
      newErrors.fecha_registro = "La fecha de registro es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el cambio de estado operativo
  const handleEstadoChange = (id, value) => {
    setEstadoOperativoMap((prev) => ({
      ...prev,
      [id]: value,
    }));
    setData((prev) =>
      prev.map((vehiculo) =>
        vehiculo.id === id
          ? {
              ...vehiculo,
              estado_operativo: value ? "Operativo" : "Mantenimiento",
            }
          : vehiculo
      )
    );
  };

  // Abre el modal para crear un nuevo vehículo
  const handleNuevoVehiculo = () => {
    setNuevoVehiculo({
      placa: "",
      nombre_vehiculo: "",
      descripcion: "",
      tipo_maquinaria: "",
      estado_operativo: "Operativo",
      capacidad_combustible: 0,
      consumo_combustible_km: 0,
      fecha_registro: null,
      estado: "Activo",
    });
    setVehiculoSeleccionado(null);
    setIsEditing(false);
    setErrors({});
    setModalVisible(true);
  };

  // Abre el modal para editar un vehículo
  const handleEdit = (vehiculo) => {
    setNuevoVehiculo({
      ...vehiculo,
      fecha_registro: vehiculo.fecha_registro
        ? new Date(vehiculo.fecha_registro)
        : null,
    });
    setVehiculoSeleccionado(vehiculo);
    setIsEditing(true);
    setErrors({});
    setModalVisible(true);
  };

  // Elimina un vehículo
  const handleDelete = (vehiculo) => {
    setData((prev) => prev.filter((v) => v.id !== vehiculo.id));
  };

  // Muestra los detalles de un vehículo
  const handleVerDetalles = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setDetalleVisible(true);
  };

  // Cierra el modal
  const handleCancel = () => {
    setModalVisible(false);
    setVehiculoSeleccionado(null);
    setIsEditing(false);
    setErrors({});
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
      const vehicleData = {
        ...nuevoVehiculo,
        id: isEditing ? nuevoVehiculo.id : Date.now(), // ID temporal para datos locales
        fecha_registro: nuevoVehiculo.fecha_registro.toISOString(),
      };

      if (isEditing) {
        // Editar vehículo existente
        setData((prev) =>
          prev.map((v) => (v.id === vehicleData.id ? vehicleData : v))
        );
      } else {
        // Crear nuevo vehículo
        setData((prev) => [...prev, vehicleData]);
      }
      handleCancel();
    } catch (error) {
      console.log(error);

      setErrors({ submit: "Error al guardar el vehículo" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    data,
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
    errors,
    isSubmitting,
    tiposMaquinaria,
    estadosOperativos,
    estadoOperativoMap,
    handleEstadoChange,
    handleNuevoVehiculo,
    handleEdit,
    handleDelete,
    handleVerDetalles,
    handleCancel,
    handleGuardarVehiculo,
    handleCerrarDetalles,
  };
};

export default useVehiculos;
