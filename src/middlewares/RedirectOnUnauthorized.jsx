import axios from "axios";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const RedirectOnUnauthorized = ({ children }) => {

  useEffect(() => {
    const handleUnauthorized = (error) => {
      console.log("este es el error => "+error);
      if (error.response && error.response.status === 401) {
        // Redirigir al usuario a la página de inicio de sesión
        
        window.location.href = "/";
      }
    };
    const handleNotFound = (error) => {
      if (error.response && error.response.status === 404) {
        // Redirigir al usuario a la página de inicio de sesión
        return <Navigate to="/404" />
      }
    };

    // Agregar un interceptor para manejar las respuestas 401 en toda la aplicación
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        handleNotFound(error);
        handleUnauthorized(error);
        return Promise.reject(error);
      }
    );

    // Limpia el interceptor al desmontar el componente
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [Navigate]);

  return <>{children}</>;
};

export default RedirectOnUnauthorized;
