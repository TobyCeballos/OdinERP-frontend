import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_ENDPOINT } from "../utils/config";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import AddEditProvider from "../components/AddEditProvider";
import { VscDebugBreakpointData } from "react-icons/vsc";
import Loader from "../components/Loader"; // Importar el componente Loader

const ProviderDetail = () => {
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga
  const { providerId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const company = localStorage.getItem("company");

  const config = {
    headers: {
      "x-access-token": `${token}`,
    },
  };

  const getProvider = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}api/providers/${company}/${providerId}`,
        config
      );
      setProvider(response.data);
      setIsLoading(false); // Desactivar el indicador de carga después de obtener los datos
    } catch (error) {
      console.error("Error al obtener los detalles del cliente:", error);
      setIsLoading(false); // Desactivar el indicador de carga en caso de error
    }
  };

  const deleteProvider = async () => {
    try {
      await axios.delete(`${API_ENDPOINT}api/providers/${company}/${company}/${providerId}`, config);
      setIsLoading(false); // Desactivar el indicador de carga después de completar la operación
      navigate("/POS/customers");
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      setIsLoading(false); // Desactivar el indicador de carga en caso de error
    }
  };

  useEffect(() => {
    getProvider();
  }, []);

  return (
    <div className="pt-20 px-5">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full flex justify-between items-center text-2xl border-b border-b-violet-500 pl-2 pb-2">
            <div className="flex">
              <button onClick={() => navigate("/POS/providers")}>
                <IoArrowBackCircleOutline className="text-violet-500" />
              </button>
              <h2 className="ml-2">
                Detalle del proveedor - #{provider?.provider_id}
              </h2>
            </div>
            <div className="text-lg">
              {provider?.provider_state === "active" ? (
                <span className="flex flex-row items-center">
                  <VscDebugBreakpointData className="text-green-400" /> Activo
                </span>
              ) : (
                <span className="flex flex-row items-center">
                  <VscDebugBreakpointData className="text-red-400" /> Inactivo
                </span>
              )}
            </div>
            <div>
              <div className="flex">
                <button>
                  <FaTrashAlt
                    onClick={deleteProvider}
                    className="text-red-300 mr-4 hover:text-red-500"
                  />
                </button>
                <AddEditProvider
                  icon={<FaEdit />}
                  fetchProvider={getProvider}
                  providerToUpdate={provider}
                  providerId={providerId}
                />
              </div>
            </div>
          </div>
          <div className="p-1 w-full">
            {/* Información general del proveedor */}
            <div className="my-3 bg-white p-5 rounded-xl">
              <h3 className="w-full flex justify-between  text-neutral-700 items-center text-xl border-b border-b-violet-500 pl-2 pb-2">
                Información general del proveedor:
              </h3>
              <p>
                <span className="font-semibold">Nombre:</span>{" "}
                {provider?.provider_name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {provider?.email}
              </p>
              <p>
                <span className="font-semibold">Teléfono:</span>{" "}
                {provider?.phone}
              </p>
              <p>
                <span className="font-semibold">Dirección:</span>{" "}
                {provider?.address}, {provider?.zip_code}
              </p>
            </div>
            {/* Detalles fiscales */}
            <div className="mb-3 bg-white p-5 rounded-xl">
              <h3 className="w-full flex justify-between items-center text-xl border-b text-neutral-700 border-b-violet-500 pl-2 pb-2">
                Detalles fiscales:
              </h3>
              <p>
                <span className="font-semibold">CUIT/CUIL:</span>{" "}
                {provider?.cuit_cuil}
              </p>
              <p>
                <span className="font-semibold">Condición de IVA:</span>{" "}
                {provider?.vat_condition === "final_consumer"
                  ? "Consumidor final"
                  : provider?.vat_condition === "exempt"
                  ? "Exento"
                  : provider?.vat_condition === "monotribute"
                  ? "Monotributo"
                  : "Registered"}
              </p>
              <p>
                <span className="font-semibold">Límite de crédito:</span>{" "}
                {provider?.credit_limit}
              </p>
            </div>
            {/* Información adicional */}
            <div className="mb-3 bg-white p-5 rounded-xl">
              <h3 className="w-full flex justify-between  text-neutral-700 items-center text-xl border-b border-b-violet-500 pl-2 pb-2">
                Información adicional:
              </h3>
              <div className="p-3">
              <p>
                <span className="font-semibold">Fecha de admisión:</span>{" "}
                {provider?.admission_date}
              </p>
              <p>
                <span className="font-semibold">Notas:</span> {provider?.notes}
              </p>
              <p>
                <span className="font-semibold">Estado:</span>{" "}
                {provider?.provider_state === "active" ? "Activo" : "Inactivo"}
              </p></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
const TableRow = ({ title, value }) => {
  return (
    <tr>
      <td className="font-semibold border border-violet-500 px-3">{title}</td>
      <td className="bg-white border-b border-b-violet-500 px-3 text-neutral-500">
        {value}
      </td>
    </tr>
  );
};

export default ProviderDetail;
