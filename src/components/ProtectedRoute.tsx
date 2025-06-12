import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../hooks/useUserStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, checkAuthStatus } = useUserStore();

  useEffect(() => {
    // Verificar estado de autenticación
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/loginRegister");
      return;
    }

    if (requireAdmin && currentUser?.role !== "ADMIN") {
      navigate("/");
      return;
    }
  }, [isAuthenticated, currentUser, navigate, requireAdmin]);

  // Si no está autenticado o no tiene permisos, no renderizar nada
  if (!isAuthenticated || (requireAdmin && currentUser?.role !== "ADMIN")) {
    return null;
  }

  return <>{children}</>;
}; 