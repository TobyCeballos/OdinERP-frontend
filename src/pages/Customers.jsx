import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../utils/config";
import { TbCashBanknoteOff } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  const handlePayOff = async (sellId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "x-access-token": token,
      };

      const response = await axios.put(
        `${API_ENDPOINT}api/sells/payoff/${sellId}`,
        {},
        { headers }
      ).then((res) => {
        fetchCustomers()
      });

      console.log(response.data); // Mensaje de confirmación de éxito
      // Aquí puedes realizar cualquier acción adicional después de saldar la venta
    } catch (error) {
      console.error("Error al saldar la venta:", error);
      // Aquí puedes manejar el error de acuerdo a tus necesidades
    }
  };
        const token = localStorage.getItem("token");
        const headers = {
          "x-access-token": token,
        };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}api/customers`, {
          headers,
        });
        setCustomers(response.data);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      }
    };

  useEffect(() => {
    fetchCustomers();
  }, []);
  const navigate= useNavigate()
  const handleRowClick = (productId) => {
    // Redirigir al usuario a la página de detalles del producto
    navigate(`/POS/customers/details/${productId}`);
  };
  return (
    <div className="pt-20 px-5">
      <div className="w-full mb-2 flex justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
        <h2>Listado de clientes</h2>
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
              onClick={() => handleRowClick(customer._id)}
              key={customer._id}
              className="odd:bg-neutral-100 bg-white text-left text-neutral-900"
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
                {customer.customer_state === "active" ? (
                  "Activo"
                ) : (
                  "Inactivo"
                )}
              </td>
              <td className="py-2 px-4 text-right">
                {customer.admission_date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
