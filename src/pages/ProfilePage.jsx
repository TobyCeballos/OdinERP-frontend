import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_ENDPOINT } from "../utils/config";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const {userId} = useParams();
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "x-access-token": `${token}`,
    },
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}api/users/${userId}`,
          config
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
        // Redirigir a la página de inicio de sesión si hay un error
        navigate("/login");
      }
    };

    getUserProfile();
  }, []);

  return (
    <div className="pt-20 px-5">
      <h2 className="text-2xl font-semibold mb-5">Perfil de Usuario</h2>
      {user && (
        <div>
          <p><strong>Nombre de usuario:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Último acceso:</strong> {user.last_access}</p>
          <p><strong>Fecha de admisión:</strong> {user.admission_date}</p>
          <p><strong>ID de usuario:</strong> {user.user_id}</p>
          <p><strong>Estado del usuario:</strong> {user.user_state}</p>
          <p><strong>Tema:</strong> {user.theme}</p>
          <p><strong>Posición en la empresa:</strong> {user.company_position}</p>
          <p><strong>Departamento:</strong> {user.department}</p>
          <p><strong>Fecha de nacimiento:</strong> {user.birthdate}</p>
          <p><strong>Skills:</strong> {user.skills.join(", ")}</p>
          <p><strong>Roles:</strong> {user.roles.map(role => role.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
