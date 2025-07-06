import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/config";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import { jwtDecode } from "jwt-decode";
import Boton from "../components/Boton";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.current.show({
        severity: "warn",
        summary: "Campos incompletos",
        detail: "Por favor ingrese usuario y contraseña.",
        life: 3000,
      });
      return;
    }

    try {
      const response = await api.post("/Usuarios/login", {
        nombreUsuario: username,
        hashContrasena: password,
      });

      const token = response.data.token;
      localStorage.setItem("jwtToken", token);

      toast.current.show({
        severity: "success",
        summary: "Inicio de sesión exitoso",
        detail: "Bienvenido al sistema.",
        life: 3000,
      });

      const decodedToken = jwtDecode(token);

      // Redirección con timeout
      if (decodedToken.TipoEmpleado === "Administrador") {
        setTimeout(() => {
          navigate("/administracion");
        }, 1000); // 1 segundo de delay
      } else {
        setTimeout(() => {
          navigate("/");
        }, 1000); // Mismo delay para consistencia
      }
    } catch (error) {
      console.error("Error en el login:", error);
      const errorMessage =
        error.response?.data?.mensaje ||
        "Credenciales inválidas o error en el servidor.";
      toast.current.show({
        severity: "error",
        summary: "Error de login",
        detail: errorMessage,
        life: 3000,
      });
    }
  };
  return (
    <>
      <div className="flex h-screen bg-gradient-to-r from-white to-white-200 flex-row-reverse">
        {" "}
        {/* Added flex-row-reverse */}
        {/* Sección derecha - Imagen */}
        <div className="hidden lg:flex w-1/2 h-full items-center justify-center bg-white p-4">
          <img
            className="object-contain h-[85%] w-full max-w-[600px]" // Ajustado para mejor escala
            src="./Images/ImagenLogin.png"
            alt="Sistema de control de combustible"
          />
        </div>
        {/* Sección izquierda - Formulario */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 lg:p-8">
            <Toast ref={toast} position="top-right" />

            {/* Encabezado */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Sistema de control de combustible
              </h1>
              <p className="text-gray-600">Para la agencia XYZ</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo de usuario */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Nombre de usuario
                </label>
                <InputText
                  className="w-full p-3 border rounded-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej: JuanPerez21"
                />
              </div>

              {/* Campo de contraseña - Ajustado para ocupar todo el espacio */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Contraseña
                </label>
                <Password
                  className="w-full [&>div]:w-full" // Forzado ancho completo
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  toggleMask
                  feedback={false}
                  inputClassName="w-full p-3 border rounded-lg"
                  placeholder="Ingrese su contraseña"
                />
              </div>

              {/* Botón de inicio de sesión */}
              <Boton
                text="Iniciar Sesión"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                type="submit"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
