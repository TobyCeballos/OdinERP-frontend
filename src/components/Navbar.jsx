import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import { FaUserCircle } from "react-icons/fa";

import POSCollapse from "./POSCollapse";
import { Link, Navigate } from "react-router-dom";
import { API_ENDPOINT } from "../utils/config";

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPos, setShowPos] = useState(false);
  const userId = localStorage.getItem("userId"); // Aquí debes proporcionar el userId deseado

  const token = localStorage.getItem("token");
  const [time, setTime] = useState(new Date());


  
  useEffect(() => {
    const handleUnauthorized = (error) => {
      if (error.response && error.response.status === 401) {
        // Redirigir al usuario a la página de inicio de sesión
        return <Navigate to="/signin" />
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


  useEffect(() => {
    // Función para actualizar el estado de la hora cada segundo
    const updateTime = () => {
      setTime(new Date());
    };

    // Establecer un intervalo para llamar a updateTime cada segundo
    const interval = setInterval(updateTime, 1000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  const currentTime =  time.getHours();
  let greeting;

  if (currentTime < 12 && currentTime > 5) {
    greeting = "¡Buenos días";
  } else if (currentTime > 12 && currentTime < 19) {
    greeting = "¡Buenas tardes";
  } else {
    greeting = "¡Buenas noches";
  }
  const config = {
    headers: {
      "x-access-token": `${token}`,
    },
  };
  const searchRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verificar si el clic ocurrió fuera del cuadro de búsqueda
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowPos(false); // Ocultar el cuadro de búsqueda
      }
    };

    // Agregar el manejador de eventos al documento
    document.addEventListener("mousedown", handleClickOutside);
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_ENDPOINT}api/users/${userId}`, config);
        console.log(response.data);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        if (error.response) {
          if (error.response.status === 401) {
            // Redirect to signin page
            localStorage.clear();
            window.location.href = '/signin';
          } else if (error.response.status === 404) {
            // Navigate to 404 page
            navigate('/404');
          }
        } else {
          console.error("Network error:", error.message);
          // Handle other types of errors here
        }
      }
    };
    fetchUserData();
    // Limpiar el manejador de eventos al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);
  const toggleShowPos = () => {
    setShowPos(!showPos);
  };

  const linkStyles =
    "ml-1 w-full hover:text-violet-500 border-0 hover:border-l pl-3 hover:border-l-violet-500";

  return (
    <>
      {userData?.username ? (
        <div className="fixed w-full z-50 p-2"  ref={searchRef}>
          <div className="bg-white flex flex-row justify-between items-center  px-6 rounded-lg shadow-md shadow-black text-center">
            <div className="flex">
              <span className="text-gray-600 text-2xl ">
                {greeting},{" "}
                <span className="text-violet-400">{userData?.username}</span>!
              </span>
            </div>
            <span className="text-violet-700 text-xl">
              <ul className="flex">
                  <Link className="hover:bg-violet-700 hover:text-white px-10 py-4 font-bold transition-all duration-300 ease-in-out" to={"/"}>Inicio</Link>

                <li
                  onClick={toggleShowPos}
                  className="hover:bg-violet-700 hover:text-white px-10 py-4 font-bold transition-all duration-300 ease-in-out"
                >
                  POS
                </li>
                <Link to={"/CRM"} className="hover:bg-violet-700 hover:text-white px-10 py-4 font-bold transition-all duration-300 ease-in-out">
                  CRM
                </Link>
              </ul>
            </span>
            <div className="flex">
              <Link to={`/profile/${userData._id}`} className="flex flex-col text-violet-600 justify-center ml-3 item-center">
                <FaUserCircle className="text-3xl" />
              </Link>
            </div>
          </div>
          {showPos ? <POSCollapse linkStyles={linkStyles} toggleShowPos={toggleShowPos} /> : null}
        </div>
      ) : null}
    </>
  );
};

export default Navbar;
