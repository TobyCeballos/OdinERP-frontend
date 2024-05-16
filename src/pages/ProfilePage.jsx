import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINT } from "../utils/config";
import Loader from "../components/Loader";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useParams();
  const token = localStorage.getItem("token");
  const company = localStorage.getItem("company");

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
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
        // Redirigir a la página de inicio de sesión si hay un error
      }
    };
    const getUsers = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}api/users/${company}/list`,
          config
        );
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
        // Redirigir a la página de inicio de sesión si hay un error
      }
    };

    getUserProfile();
    getUsers();
  }, []);
  const handleLogout = async () => {
    // Llamar al endpoint toggleUserState
    await axios.get(`${API_ENDPOINT}api/users/state-handler/${userId}`, {
      headers: {
        "x-access-token": token,
      },
    });
    // Lógica para cerrar sesión
    localStorage.clear();
    navigate("/")
  };

  const formatBirthday = (birthdate) => {
    const date = new Date(birthdate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="pt-20 px-5">
      <h2 className="text-2xl pl-2 font-semibold mb-5">Perfil de Usuario</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-wrap">
          <div className="flex flex-col w-1/2">
            <div className="bg-white rounded-2xl p-4 mb-4">
              <h3 className="w-full flex  justify-between text-xl mb-3 border-b border-b-violet-500 pl-5 pb-2">
                Información Básica:
              </h3>
              <div className="px-5">
                <p>
                  <strong>Nombre de usuario:</strong> {user?.username}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Último acceso:</strong> {user?.last_access}
                </p>
                <p>
                  <strong>Fecha de admisión:</strong> {user?.admission_date}
                </p>
                <p>
                  <strong>ID de usuario:</strong> {user?.user_id}
                </p>
                <p>
                  <strong>Estado del usuario:</strong>{" "}
                  {user?.user_state === "active" ? "Activo" : "Inactivo"}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4">
              <h3 className="w-full flex  justify-between text-xl mb-3 border-b border-b-violet-500 pl-5 pb-2">
                Información Adicional
              </h3>
              <div className="px-5">
                <p>
                  <strong>Tema:</strong> {user?.theme}
                </p>
                <p>
                  <strong>Posición en la empresa:</strong>{" "}
                  {user?.company_position}
                </p>
                <p>
                  <strong>Departamento:</strong> {user?.department}
                </p>
                <p>
                  <strong>Fecha de nacimiento:</strong>{" "}
                  {formatBirthday(user?.birthdate)}
                </p>
                <p>
                  <strong>Skills:</strong> {user?.skills.join(", ")}
                </p>
              </div>
            </div>
          </div>
          <div className=" pl-4 w-1/2">
            <div className="bg-white rounded-2xl py-3 px-6 w-full h-full">
              <h2 className="w-full flex  justify-between text-xl mb-3 border-b border-b-violet-500 pl-5 pb-2">
                Listados de usuarios activos
              </h2>
              <ul className="overflow-y-auto max-h-96">
                {users.map((user) => (
                  <li
                    key={user?._id}
                    className="mx-1 mb-3 px-6 py-3 border-b flex justify-between rounded-full shadow-md border-b-slate-300"
                  >
                    <p className="w-1/3">{user?.username}</p>
                    <p className="w-1/3 text-center">
                      {user?.user_state === "active" ? (
                        <span className="bg-green-500 px-5 text-white rounded-full">
                          Conectado
                        </span>
                      ) : (
                        <span className="bg-red-500 px-5 text-white rounded-full">
                          Desconectado
                        </span>
                      )}
                    </p>
                    <p className="w-1/3 text-right">
                      {new Date(user?.updatedAt).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                    {/* Agrega aquí más detalles del usuario si lo necesitas */}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-full flex justify-center mt-5 border-t border-t-slate-500">
            <button
              className="px-16 text-red-500 hover:bg-neutral-800 py-2 rounded-md mt-2"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
