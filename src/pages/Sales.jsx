import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../utils/config";
import { TbCashBanknoteOff } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import Loader from "../components/Loader"; // Importar el componente Loader

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga

  const handlePayOff = async (sellId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "x-access-token": token,
      };

      setIsLoading(true); // Activar el indicador de carga
      await axios.put(
        `${API_ENDPOINT}api/sells/payoff/${sellId}`,
        {},
        { headers }
      );
      fetchSales(); // Actualizar las ventas después de pagar
      setIsLoading(false); // Desactivar el indicador de carga después de completar la operación
    } catch (error) {
      console.error("Error al saldar la venta:", error);
      setIsLoading(false); // Desactivar el indicador de carga en caso de error
      // Aquí puedes manejar el error de acuerdo a tus necesidades
    }
  };

  const token = localStorage.getItem("token");
  const headers = {
    "x-access-token": token,
  };

  const fetchSales = async () => {
    setIsLoading(true); // Activar el indicador de carga
    try {
      const response = await axios.get(
        `${API_ENDPOINT}api/sells?page=${currentPage}`,
        {
          headers,
        }
      );
      setSales(response.data);
      setIsLoading(false); // Desactivar el indicador de carga después de obtener los datos
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
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
      // Si el input está vacío, obtener todas las ventas
      try {
        const response = await axios.get(
          `${API_ENDPOINT}api/sells?page=${currentPage}`,
          {
            headers,
          }
        );
        setSales(response.data);
        setIsLoading(false); // Desactivar el indicador de carga después de obtener los datos
      } catch (error) {
        console.error("Error fetching sales:", error);
        setIsLoading(false); // Desactivar el indicador de carga en caso de error
      }
    } else {
      // Si hay un término de búsqueda, realizar la búsqueda
      try {
        const response = await axios.get(
          `${API_ENDPOINT}api/sells/search/${value}?page=${currentPage}`,
          { headers }
        );
        setSales(response.data);
        setIsLoading(false); // Desactivar el indicador de carga después de obtener los datos
      } catch (error) {
        console.error("Error searching sales:", error);
        setIsLoading(false); // Desactivar el indicador de carga en caso de error
      }
    }
  };

  useEffect(() => {
    fetchSales();
  }, [currentPage]);

  const navigate = useNavigate();

  const handleRowClick = (saleId) => {
    // Redirigir al usuario a la página de detalles de la venta
    navigate(`/POS/sales/details/${saleId}`);
  };

  return (
    <div className="pt-20 px-5">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full mb-2 flex justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
            <h2>Listado de ventas</h2>
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

          <table className="w-full overflow-auto text-left rounded-md">
            <thead>
              <tr className="bg-violet-700 text-white uppercase text-sm leading-normal">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Cliente</th>
                <th className="py-2 px-4">Dirección</th>
                <th className="py-2 px-4 text-center">Tipo de pago</th>
                <th className="py-2 px-4 text-right">Fecha de actualización</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr
                  onClick={() => handleRowClick(sale._id)}
                  key={sale._id}
                  className="odd:bg-neutral-100 bg-white text-left text-neutral-900"
                >
                  <td className="py-2 px-4">{sale.sale_id}</td>
                  <td className="py-2 px-4">{sale.customer}</td>
                  <td className="py-2 px-4">{sale.shippingAddress}</td>
                  <td
                    className={`py-2 px-4 flex flex-row justify-center items-center text-center font-semibold ${
                      sale.payCondition === "current_account"
                        ? "text-red-600"
                        : sale.payCondition === "cash"
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  >
                    {sale.payCondition === "current_account" ? (
                      <span>Cuenta corriente</span>
                    ) : sale.payCondition === "cash" ? (
                      "Efectivo"
                    ) : (
                      "Tarjeta"
                    )}{" "}
                    {sale.payCondition === "current_account" && (
                      <button
                        className="p-1"
                        type="button"
                        onClick={() => {
                          handlePayOff(sale._id);
                        }}
                      >
                        <TbCashBanknoteOff />
                      </button>
                    )}
                  </td>
                  <td className="py-2 px-4 text-right">
                    {new Date(sale.updatedAt).toLocaleString()}
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
          </div>
        </>
      )}
    </div>
  );
};

export default Sales;
