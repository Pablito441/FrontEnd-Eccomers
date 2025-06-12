import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Footer } from "./components/ui/Footer/Footer";
import { Navbar } from "./components/ui/Navbar/Navbar";
import { AppRouter } from "./routes/AppRoutes";
import { useUserStore } from "./hooks/useUserStore";
import "./App.css";

function App() {
  const { checkAuthStatus } = useUserStore();
  const location = useLocation();

  // Verificar si estamos en una ruta de admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Verificar el estado de autenticación al cargar la aplicación
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <div className="containerApp">
      <div className="content">
        <Navbar />
        <AppRouter />
        {!isAdminRoute && <Footer />}
      </div>
    </div>
  );
}

export default App;
