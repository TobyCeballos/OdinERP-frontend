import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../utils/config";
import { TbCashBanknoteOff } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Providers = () => {
  const [providers, setProviders] = useState([]);

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
        fetchProviders();
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

  const fetchProviders = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}api/providers`, {
        headers,
      });
      setProviders(response.data);
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const navigate = useNavigate();

  const handleRowClick = (providerId) => {
    // Redirigir al usuario a la página de detalles del proveedor
    navigate(`/POS/provider/details/${providerId}`);
  };

  return (
    <div className="pt-20 px-5">
      <div className="w-full mb-2 flex justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
        <h2>Listado de proveedores</h2>
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
              onClick={() => handleRowClick(provider._id)}
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
                {provider.provider_state === "active" ? "Activo" : "Inactivo"}
              </td>
              <td className="py-2 px-4 text-right">{provider.admission_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Providers;
