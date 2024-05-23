import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../utils/config";
import { TbCashBanknoteOff } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import AddEditCustomers from "../components/AddEditCustomers.jsx"
import { IoPersonAdd } from "react-icons/io5";
import Loader from "../components/Loader.jsx";
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga

  const company = localStorage.getItem("company");
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
      // Si el input está vacío, obtener todos los productos
      try {
        const response = await axios.get(`${API_ENDPOINT}api/customers/${company}?page=${currentPage}`, {
          headers,
        });
        setCustomers(response.data);
        setIsLoading(false); // Desactivar el indicador de carga
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false); // Desactivar el indicador de carga en caso de error
      }
    } else {
      // Si hay un término de búsqueda, realizar la búsqueda
      try {
        const response = await axios.get(
          `${API_ENDPOINT}api/customers/${company}/search/${value}?page=${currentPage}`,
          {headers: headers}
        );
        setCustomers(response.data);
        setIsLoading(false); // Desactivar el indicador de carga
      } catch (error) {
        console.error("Error searching products:", error);
        setIsLoading(false); // Desactivar el indicador de carga en caso de error
      }
    }
  };

  const token = localStorage.getItem("token");
  const headers = {
    "x-access-token": token,
  };

  const fetchCustomers = async () => {
    setIsLoading(true); // Activar el indicador de carga
    try {
      const response = await axios.get(`${API_ENDPOINT}api/customers/${company}?page=${currentPage}`, {
        headers,
      });
      setCustomers(response.data);
      setIsLoading(false); // Desactivar el indicador de carga
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
      setIsLoading(false); // Desactivar el indicador de carga en caso de error
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);
  const navigate = useNavigate();
  const handleRowClick = (productId) => {
    // Redirigir al usuario a la página de detalles del producto
    navigate(`/POS/customers/details/${productId}`);
  };
  return (
    <div className="pt-20 px-5">{isLoading ? (
        <Loader/>
      ) : (<>
      <div className="w-full mb-2 flex justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
        <h2>Listado de clientes</h2>
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
              <th className="py-2 px-4">Cliente</th>
              <th className="py-2 px-4">Dirección</th>
              <th className="py-2 px-4 text-center">Estado</th>
              <th className="py-2 px-4 text-right">Fecha de admision</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr
                onDoubleClick={() => handleRowClick(customer._id)}
                key={customer._id}
                className="odd:bg-neutral-100 capitalize bg-white text-left text-neutral-900"
              >
                <td className="py-2 px-4">{customer.customer_id}</td>
                <td className="py-2 px-4">{customer.customer_name}</td>
                <td className="py-2 px-4">{customer.shipping_address}</td>
                <td
                  className={`py-2 px-4 flex flex-row justify-center items-center text-center font-semibold ${
                    customer.customer_state === "active"
                      ? "text-green-500"
                      : "text-red-600"
                  }`}
                >
                  {customer.customer_state === "active" ? "Activo" : "Inactivo"}
                </td>
                <td className="py-2 px-4 text-right">
                  {customer.admission_date}
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
        <div>
          <AddEditCustomers icon={<IoPersonAdd className="text-violet-500"/>}/>
        </div>
      </div></>
      )}
    </div>
  );
};

export default Customers;
