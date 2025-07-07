import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import {
  IconoReportes,
  IconoVehiculos,
  IconoChofer,
  IconoRuta,
  IconoAsignacionRuta,
  IconoComsumoCombsutible,
  IconoGasolina,
} from "../assets/IconosComponentes";
import useReportes from "../hooks/useReportes";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const Reportes = () => {
  const toast = useRef(null);
  const {
    loading,
    metricas,
    getVehiculosPorTipoData,
    getEstadoVehiculosData,
    getConsumoPorRutaData,
    getEficienciaCombustibleData,
    getAsignacionesPorMesData,
    getDistanciaPorRutaData,
  } = useReportes(toast);

  // Opciones para las gráficas
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };
  const sinDatos = (dataset) =>
    !dataset || dataset.length === 0 || dataset.every((val) => val === 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <section className="py-6 px-4">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <IconoReportes className="text-blue-600 w-8 h-8" />
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard de Reportes
        </h1>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm">Total Vehículos</p>
              <p className="text-3xl font-bold">{metricas.totalVehiculos}</p>
              <p className="text-blue-500 text-xs">
                {metricas.vehiculosOperativos} operativos
              </p>
            </div>
            <IconoVehiculos className="w-12 h-12 text-blue-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm">Total Choferes</p>
              <p className="text-3xl font-bold">{metricas.totalChoferes}</p>
              <p className="text-green-500 text-xs">
                {metricas.choferesDisponibles} disponibles
              </p>
            </div>
            <IconoChofer className="w-12 h-12 text-green-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm">Total Rutas</p>
              <p className="text-3xl font-bold">{metricas.totalRutas}</p>
              <p className="text-purple-500 text-xs">
                {metricas.rutasActivas} activas
              </p>
            </div>
            <IconoRuta className="w-12 h-12 text-purple-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm">Consumo Promedio</p>
              <p className="text-3xl font-bold">{metricas.consumoPromedio}L</p>
              <p className="text-orange-500 text-xs">
                Eficiencia: {metricas.eficienciaPromedio}%
              </p>
            </div>
            <IconoGasolina className="w-12 h-12 text-orange-200" />
          </div>
        </Card>
      </div>

      {/* Gráficas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Distribución de Vehículos por Tipo" className="h-96">
          <div className="h-70">
            {sinDatos(getVehiculosPorTipoData().datasets[0].data) ? (
              <p className="text-center text-gray-500 mt-8">
                No hay datos disponibles para mostrar.
              </p>
            ) : (
              <Doughnut
                data={getVehiculosPorTipoData()}
                options={doughnutOptions}
              />
            )}
          </div>
        </Card>

        <Card title="Estado Operativo de Vehículos" className="h-96">
          <div className="h-70">
            {sinDatos(getEstadoVehiculosData().datasets[0].data) ? (
              <p className="text-center text-gray-500 mt-8">
                No hay datos disponibles para mostrar.
              </p>
            ) : (
              <Doughnut
                data={getEstadoVehiculosData()}
                options={doughnutOptions}
              />
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Consumo Promedio por Ruta" className="h-96">
          <div className="h-70">
            {getConsumoPorRutaData().datasets[0].data.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">
                No hay datos de consumo por ruta.
              </p>
            ) : (
              <Bar data={getConsumoPorRutaData()} options={chartOptions} />
            )}
          </div>
        </Card>

        <Card title="Eficiencia de Consumo de Combustible" className="h-96">
          <div className="h-70">
            {sinDatos(getEficienciaCombustibleData().datasets[0].data) ? (
              <p className="text-center text-gray-500 mt-8">
                No hay datos de eficiencia disponibles.
              </p>
            ) : (
              <Doughnut
                data={getEficienciaCombustibleData()}
                options={doughnutOptions}
              />
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Asignaciones por Mes" className="h-96">
          <div className="h-70">
            {sinDatos(getAsignacionesPorMesData().datasets[0].data) ? (
              <p className="text-center text-gray-500 mt-8">
                No hay asignaciones registradas este año.
              </p>
            ) : (
              <Line data={getAsignacionesPorMesData()} options={chartOptions} />
            )}
          </div>
        </Card>

        <Card title="Distancia por Ruta (km)" className="h-96">
          <div className="h-70">
            {sinDatos(getDistanciaPorRutaData().datasets[0].data) ? (
              <p className="text-center text-gray-500 mt-8">
                No hay información de distancias por ruta.
              </p>
            ) : (
              <Bar data={getDistanciaPorRutaData()} options={chartOptions} />
            )}
          </div>
        </Card>
      </div>

      {/* Resumen de métricas adicionales */}
      <div className="mt-8">
        <Card title="Resumen de Actividad" className="bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <IconoAsignacionRuta className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-gray-800">
                {metricas.totalAsignaciones}
              </p>
              <p className="text-sm text-gray-600">Total Asignaciones</p>
            </div>

            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <IconoAsignacionRuta className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-gray-800">
                {metricas.asignacionesActivas}
              </p>
              <p className="text-sm text-gray-600">Asignaciones Activas</p>
            </div>

            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <IconoComsumoCombsutible className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-gray-800">
                {metricas.consumoPromedio}L
              </p>
              <p className="text-sm text-gray-600">Consumo Promedio</p>
            </div>

            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <IconoGasolina className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-gray-800">
                {metricas.eficienciaPromedio}%
              </p>
              <p className="text-sm text-gray-600">Eficiencia Promedio</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Reportes;
