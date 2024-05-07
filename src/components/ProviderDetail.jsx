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

  const config = {
    headers: {
      "x-access-token": `${token}`,
    },
  };

  const getProvider = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}api/providers/${providerId}`,
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
      await axios.delete(`${API_ENDPOINT}api/providers/${providerId}`, config);
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
      {/* Renderizar el componente Loader mientras se está cargando */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full flex justify-between items-center text-2xl border-b border-b-violet-500 pl-2 pb-2">
            <div className="flex">
              <button onClick={() => navigate("/POS/providers")}>
                <IoArrowBackCircleOutline className="text-violet-500" />
              </button>
              <h2 className=" ml-2">
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
          <div className="p-1 w-full flex flex-wrap overflow-auto">
            <div className="w-1/3 p-1">
              <h3 className="text-lg font-semibold mb-1">Detalles del proveedor:</h3>
              <table className="w-full rounded-md overflow-hidden capitalize">
                <tbody>
                  <TableRow title="Nombre" value={provider?.provider_name} />
                  <TableRow title="Email" value={provider?.email} />
                  <TableRow title="Teléfono" value={provider?.phone} />
                  <TableRow title="Código postal" value={provider?.zip_code} />
                  <TableRow
                    title="Dirección"
                    value={provider?.address}
                  />
                  <TableRow title="CUIT/CUIL" value={provider?.cuit_cuil} />
                  <TableRow
                    title="Condición de IVA"
                    value={
                      provider?.vat_condition === "final_consumer"
                        ? "Consumidor final"
                        : provider?.vat_condition === "exempt"
                        ? "Excento"
                        : provider?.vat_condition === "monotribute"
                        ? "Monotributo"
                        : "Registered"
                    }
                  />
                  <TableRow
                    title="Mi límite de crédito"
                    value={provider?.credit_limit}
                  />
                  <TableRow
                    title="Fecha de admisión"
                    value={provider?.admission_date}
                  />
                  <TableRow title="Notas" value={provider?.notes} />
                  <TableRow title="Estado" value={
                      provider?.provider_state === "active"
                        ? "Activo"
                        : "inactivo"} />
                </tbody>
              </table>
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
