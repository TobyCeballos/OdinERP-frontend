import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import { FaUserCircle } from "react-icons/fa";

import POSCollapse from "./POSCollapse";
import { Link } from "react-router-dom";
import { API_ENDPOINT } from "../utils/config";

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPos, setShowPos] = useState(false);
  const userId = localStorage.getItem("userId"); // Aquí debes proporcionar el userId deseado

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "x-access-token": `${token}`,
    },
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        await axios
          .get(`${API_ENDPOINT}api/users/${userId}`, config)
          .then((response) => {
            console.log(response.data);
            setUserData(response.data);
            setLoading(false);
          })
          .catch((err) => console.error(`Error! ${err}`));
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  const toggleShowPos = () => {
    setShowPos(!showPos);
  };

  const linkStyles =
    "ml-1 w-full hover:text-violet-500 border-0 hover:border-l pl-3 hover:border-l-violet-500";

  return (
    <>
      {userData?.username ? (
        <div className="fixed w-full p-2">
          <div className="bg-white flex flex-row justify-between items-center  px-6 rounded-lg shadow-md shadow-black text-center">
            <div className="flex">
              <span className="text-gray-600 text-2xl ">
                ¡Bienvenido/a,{" "}
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
                <li className="hover:bg-violet-700 hover:text-white px-10 py-4 font-bold transition-all duration-300 ease-in-out">
                  CRM
                </li>
              </ul>
            </span>
            <div className="flex">
              <input
                type="button"
                onClick={handleLogout}
                className="border-2 transition-all duration-300 ease-in-out hover:shadow-md text-violet-800 font-semibold text-xl border-violet-800 rounded-xl py-2 px-3 hover:bg-violet-500 hover:text-white"
                value="Salir"
              />
              <button className="flex flex-col text-violet-600 justify-center ml-3 item-center">
                <FaUserCircle className="text-3xl" />
              </button>
            </div>
          </div>
          {showPos ? <POSCollapse linkStyles={linkStyles} toggleShowPos={toggleShowPos} /> : null}
        </div>
      ) : null}
    </>
  );
};

export default Navbar;
