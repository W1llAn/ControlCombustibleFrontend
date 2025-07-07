import { useState, useEffect } from "react";
import api from "../api/config";

const useReportes = (toastRef) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    asignaciones: [],
    choferes: [],
    consumos: [],
    rutas: [],
    vehiculos: [],
  });

  // Estados para las métricas calculadas
  const [metricas, setMetricas] = useState({
    totalVehiculos: 0,
    vehiculosOperativos: 0,
    totalChoferes: 0,
    choferesDisponibles: 0,
    totalRutas: 0,
    rutasActivas: 0,
    totalAsignaciones: 0,
    asignacionesActivas: 0,
    consumoPromedio: 0,
    eficienciaPromedio: 0,
  });

  // Cargar todos los datos del dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        asignacionesRes,
        choferesRes,
        consumosRes,
        rutasRes,
        vehiculosRes,
      ] = await Promise.all([
        api.get("/AsignacionRutas/listar"),
        api.get("/Choferes/listar"),
        api.get("/ConsumoCombustible/listar"),
        api.get("/Rutas/listar"),
        api.get("/Vehiculos/listar"),
      ]);

      const data = {
        asignaciones: asignacionesRes.data,
        choferes: choferesRes.data,
        consumos: consumosRes.data,
        rutas: rutasRes.data,
        vehiculos: vehiculosRes.data,
      };

      setDashboardData(data);
      calcularMetricas(data);
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los datos del dashboard",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcular métricas del dashboard
  const calcularMetricas = (data) => {
    const { vehiculos, choferes, rutas, asignaciones, consumos } = data;

    // Métricas de vehículos
    const totalVehiculos = vehiculos.length;
    const vehiculosOperativos = vehiculos.filter(
      (v) => v.estadoOperativo === "Operativo"
    ).length;

    // Métricas de choferes
    const totalChoferes = choferes.length;
    const choferesDisponibles = choferes.filter((c) => c.disponible).length;

    // Métricas de rutas
    const totalRutas = rutas.length;
    const rutasActivas = rutas.filter((r) => r.estado === 1).length;

    // Métricas de asignaciones
    const totalAsignaciones = asignaciones.length;
    const asignacionesActivas = asignaciones.filter(
      (a) => a.estado === 1
    ).length;

    // Métricas de consumo
    const consumoPromedio =
      consumos.length > 0
        ? consumos.reduce((sum, c) => sum + c.combustibleReal, 0) /
          consumos.length
        : 0;

    // Eficiencia promedio (combustible real vs estimado)
    const eficienciaPromedio =
      consumos.length > 0
        ? consumos.reduce((sum, c) => {
            const eficiencia =
              c.combustibleEstimado > 0
                ? (c.combustibleReal / c.combustibleEstimado) * 100
                : 100;
            return sum + eficiencia;
          }, 0) / consumos.length
        : 100;

    setMetricas({
      totalVehiculos,
      vehiculosOperativos,
      totalChoferes,
      choferesDisponibles,
      totalRutas,
      rutasActivas,
      totalAsignaciones,
      asignacionesActivas,
      consumoPromedio: Math.round(consumoPromedio * 100) / 100,
      eficienciaPromedio: Math.round(eficienciaPromedio * 100) / 100,
    });
  };

  // Datos para gráfica de vehículos por tipo
  const getVehiculosPorTipoData = () => {
    const { vehiculos } = dashboardData;
    const liviana = vehiculos.filter(
      (v) => v.tipoMaquinaria === "Liviana"
    ).length;
    const pesada = vehiculos.filter(
      (v) => v.tipoMaquinaria === "Pesada"
    ).length;

    return {
      labels: ["Maquinaria Liviana", "Maquinaria Pesada"],
      datasets: [
        {
          data: [liviana, pesada],
          backgroundColor: [
            "#3B82F6", // Azul
            "#8B5CF6", // Púrpura
          ],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    };
  };

  // Datos para gráfica de estado de vehículos
  const getEstadoVehiculosData = () => {
    const { vehiculos } = dashboardData;
    const operativos = vehiculos.filter(
      (v) => v.estadoOperativo === "Operativo"
    ).length;
    const mantenimiento = vehiculos.filter(
      (v) => v.estadoOperativo === "Mantenimiento"
    ).length;

    return {
      labels: ["Operativo", "Mantenimiento"],
      datasets: [
        {
          data: [operativos, mantenimiento],
          backgroundColor: [
            "#10B981", // Verde
            "#F59E0B", // Amarillo
          ],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    };
  };

  // Datos para gráfica de consumo por ruta
  const getConsumoPorRutaData = () => {
    const { consumos } = dashboardData;

    // Agrupar consumos por ruta
    const consumoPorRuta = {};
    consumos.forEach((consumo) => {
      const rutaNombre = consumo.asignacionRuta?.ruta?.nombre || "Sin ruta";
      if (!consumoPorRuta[rutaNombre]) {
        consumoPorRuta[rutaNombre] = [];
      }
      consumoPorRuta[rutaNombre].push(consumo.combustibleReal);
    });

    // Calcular promedio por ruta
    const labels = Object.keys(consumoPorRuta);
    const data = labels.map((ruta) => {
      const consumos = consumoPorRuta[ruta];
      return consumos.reduce((sum, c) => sum + c, 0) / consumos.length;
    });

    return {
      labels,
      datasets: [
        {
          label: "Consumo Promedio (L)",
          data,
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  };

  // Datos para gráfica de eficiencia de combustible
  const getEficienciaCombustibleData = () => {
    const { consumos } = dashboardData;

    const eficiente = consumos.filter(
      (c) => c.combustibleReal <= c.combustibleEstimado
    ).length;
    const ineficiente = consumos.filter(
      (c) => c.combustibleReal > c.combustibleEstimado
    ).length;

    return {
      labels: ["Consumo Eficiente", "Consumo Excesivo"],
      datasets: [
        {
          data: [eficiente, ineficiente],
          backgroundColor: [
            "#10B981", // Verde
            "#EF4444", // Rojo
          ],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    };
  };

  // Datos para gráfica de asignaciones por mes
  const getAsignacionesPorMesData = () => {
    const { asignaciones } = dashboardData;

    // Agrupar por mes
    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const asignacionesPorMes = new Array(12).fill(0);

    asignaciones.forEach((asignacion) => {
      const fecha = new Date(asignacion.fechaAsignacion);
      const mes = fecha.getMonth();
      asignacionesPorMes[mes]++;
    });

    return {
      labels: meses,
      datasets: [
        {
          label: "Asignaciones",
          data: asignacionesPorMes,
          backgroundColor: "rgba(139, 92, 246, 0.8)",
          borderColor: "rgba(139, 92, 246, 1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  // Datos para gráfica de distancia por ruta
  const getDistanciaPorRutaData = () => {
    const { rutas } = dashboardData;

    const labels = rutas.map((r) => r.nombre);
    const data = rutas.map((r) => r.distancia);

    return {
      labels,
      datasets: [
        {
          label: "Distancia (km)",
          data,
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    loading,
    dashboardData,
    metricas,
    fetchDashboardData,
    getVehiculosPorTipoData,
    getEstadoVehiculosData,
    getConsumoPorRutaData,
    getEficienciaCombustibleData,
    getAsignacionesPorMesData,
    getDistanciaPorRutaData,
  };
};

export default useReportes;
