import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
function App() {
  return (
    <>
      <PrimeReactProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Todas las rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/administracion" element={<Home />} />
              <Route path="/" element={<Home />} /> // Ruta principal protegida
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PrimeReactProvider>
    </>
  );
}

export default App;
