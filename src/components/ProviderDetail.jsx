import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_ENDPOINT } from "../utils/config";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
//import EditProvider from "./EditProvider";

const ProviderDetail = () => {
  const [provider, setProvider] = useState(null);
  const [productsCart, setProductsCart] = useState([]);
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
      console.log(response.data);
      setProvider(response.data);

      // Obtener los detalles de los productos en el carrito de la cuenta actual del proveedor
      const productsDetails = await Promise.all(
        response.data.current_account_cart.map(async (item) => {
          const productResponse = await axios.get(
            `${API_ENDPOINT}api/products/${item.objectId}`,
            config
          );
          return { ...productResponse.data, quantity: item.quantity };
        })
      );
      setProductsCart(productsDetails);
    } catch (error) {
      console.error("Error al obtener los detalles del proveedor:", error);
    }
  };

  const deleteProvider = async () => {
    try {
      const response = await axios.delete(
        `${API_ENDPOINT}api/providers/${providerId}`,
        config
      );
      navigate("/POS/providers");
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error);
    }
  };

  useEffect(() => {
    getProvider();
  }, []);

  return (
    <div className="pt-20 px-5">
      <div className="w-full flex justify-between text-2xl border-b border-b-violet-500 pl-2 pb-2">
        <div className="flex">
          <button onClick={() => navigate("/POS/providers")}>
            <IoArrowBackCircleOutline className="text-violet-500" />
          </button>
          <h2 className=" ml-2">
            Detalle del proveedor - #{provider?.provider_id}
          </h2>
        </div>
        <div>
          <div className="flex">
            <button>
              <FaTrashAlt
                onClick={deleteProvider}
                className="text-red-300 mr-4 hover:text-red-500"
              />
            </button>
            {/*<EditProvider
              icon={<FaEdit />}
              getProvider={getProvider}
              providerToUpdate={provider}
  />*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
