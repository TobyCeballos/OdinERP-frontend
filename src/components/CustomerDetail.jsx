import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_ENDPOINT } from "../utils/config";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import EditCustomer from "./EditCustomer";

const CustomerDetail = () => {
  const [customer, setCustomer] = useState(null);
  const [productsCart, setProductsCart] = useState([]);
  const { customerId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "x-access-token": `${token}`,
    },
  };
  const getCustomer = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}api/customers/${customerId}`,
        config
      );
      console.log(response.data);
      setCustomer(response.data);
  
      // Obtener los detalles de los productos en el carrito de la cuenta actual del cliente
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
      console.error("Error al obtener los detalles del cliente:", error);
    }
  };
  

  const deleteCustomer = async () => {
    try {
      const response = await axios.delete(
        `${API_ENDPOINT}api/customers/${customerId}`,
        config
      );
      navigate("/POS/customers");
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  useEffect(() => {
    getCustomer();
  }, []);

  return (
    <div className="pt-20 px-5">
      <div className="w-full flex justify-between text-2xl border-b border-b-violet-500 pl-2 pb-2">
        <div className="flex">
          <button onClick={() => navigate("/POS/customers")}>
            <IoArrowBackCircleOutline className="text-violet-500" />
          </button>
          <h2 className=" ml-2">Detalle del cliente - #{customer?.customer_id}</h2>
        </div>
        <div>
          <div className="flex">
            <button>
              <FaTrashAlt
                onClick={deleteCustomer}
                className="text-red-300 mr-4 hover:text-red-500"
              />
            </button>
            <EditCustomer
              icon={<FaEdit />}
              getCustomer={getCustomer}
              customerToUpdate={customer}
            />
          </div>
        </div>
      </div>
      <div className="p-1 w-full overflow-auto">
        {productsCart.length > 0 ? (
          <table className="w-full text-left rounded-md overflow-hidden">
            <thead>
              <tr className="bg-violet-700 text-white">
                <th className="py-2 px-4">Producto</th>
                <th className="py-2 px-4">Precio</th>
              </tr>
            </thead>
            <tbody>
              {productsCart.map((item, i) => (
                <tr key={i} className={"odd:bg-gray-100 bg-white"}>
                  <td className="py-2 px-4">{item.product_name}</td>
                  <td className="py-2 px-4">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center bg-white p-2 rounded-md text-violet-600 border-violet-600 border-2 font-semibold">
            No hay productos en el carrito.
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;
