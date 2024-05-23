import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../utils/config";
import { TbCashBanknoteOff } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import AddEditProvider from "../components/AddEditProvider";
import Loader from "../components/Loader"; // Importar el componente Loader

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga

  const company = localStorage.getItem("company");
  const token = localStorage.getItem("token");
  const headers = {
    "x-access-token": token,
  };

  const fetchProviders = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}api/providers/${company}?page=${currentPage}`,
        { headers }
      );
      setProviders(response.data);
      setIsLoading(false); // Desactivar el indicador de carga
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
      setIsLoading(false); // Desactivar el indicador de carga en caso de error
    }
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = async (event) => {
    const { value } = event.target;
    setSearchValue(value);
    setIsLoading(true); // Activar el indicador de carga
    if (value.trim() === "") {
      // Si el input está vacío, obtener todos los proveedores
      try {
        const response = await axios.get(
          `${API_ENDPOINT}api/providers/${company}?page=${currentPage}`,
          { headers }
        );
        setProviders(response.data);
        setIsLoading(false); // Desactivar el indicador de carga
      } catch (error) {
        console.error("Error fetching providers:", error);
        setIsLoading(false); // Desactivar el indicador de carga en caso de error
      }
    } else {
      // Si hay un término de búsqueda, realizar la búsqueda
      try {
        const response = await axios.get(
          `${API_ENDPOINT}api/providers/${company}/search/${value}?page=${currentPage}`,
          { headers }
        );
        setProviders(response.data);
        setIsLoading(false); // Desactivar el indicador de carga
      } catch (error) {
        console.error("Error searching providers:", error);
        setIsLoading(false); // Desactivar el indicador de carga en caso de error
      }
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [currentPage]);

  const navigate = useNavigate();

  const handleRowClick = (providerId) => {
    // Redirigir al usuario a la página de detalles del proveedor
    navigate(`/POS/provider/details/${providerId}`);
  };

  return (
    <div className="pt-20 px-5">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full mb-2 flex justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
            <h2>Listado de proveedores</h2>
            <div className="flex z-0 items-center relative mr-3 w-80">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchValue}
                onChange={handleSearch}
                className="text-base py-1 w-full px-5 shadow-md rounded-full bg-white"
              />
              <FaSearch className="absolute right-3 text-base" />
            </div>
          </div>

          <table className="w-full text-left rounded-md overflow-hidden">
            <thead>
              <tr className="bg-violet-700 text-white uppercase text-sm leading-normal">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Proveedor</th>
                <th className="py-2 px-4">Dirección</th>
                <th className="py-2 px-4 text-center">Estado</th>
                <th className="py-2 px-4 text-right">Fecha de admisión</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider, index) => (
                <tr
                  onDoubleClick={() => handleRowClick(provider._id)}
                  key={provider._id}
                  className="odd:bg-neutral-100 bg-white text-left text-neutral-900"
                >
                  <td className="py-2 px-4">{provider.provider_id}</td>
                  <td className="py-2 px-4">{provider.provider_name}</td>
                  <td className="py-2 px-4">{provider.shipping_address}</td>
                  <td
                    className={`py-2 px-4 flex flex-row justify-center items-center text-center font-semibold ${
                      provider.provider_state === "active"
                        ? "text-green-500"
                        : "text-red-600"
                    }`}
                  >
                    {provider.provider_state === "active"
                      ? "Activo"
                      : "Inactivo"}
                  </td>
                  <td className="py-2 px-4 text-right">
                    {provider.admission_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-white flex justify-between w-full p-2 rounded-xl mt-2">
            <div className="flex justify-center items-center">
              <button
                type="button"
                onClick={prevPage}
                className="p-1 hover:bg-slate-200 rounded-full m-1"
              >
                <IoIosArrowBack />
              </button>
              <span>{currentPage}</span>
              <button
                type="button"
                onClick={nextPage}
                className="p-1 hover:bg-slate-200 rounded-full m-1"
              >
                <IoIosArrowForward />
              </button>
            </div>
            <AddEditProvider
              icon={<IoPersonAdd />}
              fetchProvider={fetchProviders}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Providers;
