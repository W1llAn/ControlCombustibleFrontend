import axios from "axios";

// SE CREA EL OBJETO API PARA CONSUMIRLO CON AXIOS
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // TIEMPO DE ESPERA MÁXIMO
  headers: {
    "ngrok-skip-browser-warning": "true", // Añade este encabezado
  },
});

// SE ENVÍA AUTOMÁTICAMENTE EL JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// SE MANEJAN LOS ERRORES
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("ERROR EN LA CONSULTA", error);
      localStorage.removeItem("jwtToken"); // Eliminar el token inválido
      window.location.href = "/login"; // Redirigir al login
    }
    return Promise.reject(error);
  }
);

export default api;
