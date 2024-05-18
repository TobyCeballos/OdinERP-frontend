import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_ENDPOINT } from "../utils/config";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import AddEditCustomer from "../components/AddEditCustomers";
import { VscDebugBreakpointData } from "react-icons/vsc";

import Loader from "./Loader";

const CustomerDetail = () => {
  const [customer, setCustomer] = useState(null);
  const [productsCart, setProductsCart] = useState([]);
  const { customerId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const company = localStorage.getItem("company");

  const config = {
    headers: {
      "x-access-token": `${token}`,
    },
  };
  const getCustomer = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}api/customers/${company}/${customerId}`,
        config
      );
      setLoading(false);
      setCustomer(response.data);

      if (response.data.current_account_cart.length >= 1) {
        const productsDetails = await Promise.all(
          response.data.current_account_cart.map(async (item) => {
            const productResponse = await axios.get(
              `${API_ENDPOINT}api/products/${company}/${item.objectId}`,
              config
            );
            setLoading(false);
            return { ...productResponse.data, quantity: item.quantity };
          })
        );
        setProductsCart(productsDetails);
      }
    } catch (error) {
      console.error("Error al obtener los detalles del cliente:", error);
    }
  };

  const deleteCustomer = async () => {
    try {
      setLoading(true);
      const response = await axios
        .delete(`${API_ENDPOINT}api/customers/${company}/${customerId}`, config)
        .then((response) => {
          setLoading(false);
        });
      navigate("/POS/customers");
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  const totalCartPrice = productsCart
    .reduce((total, item) => {
      // Multiplicar el precio total del producto por la cantidad
      const totalPriceForItem = parseFloat(
        item.current_price * (1 + item.sale_price / 100)
      );
      // Sumar al total
      return total + totalPriceForItem * item.quantity;
    }, 0)
    .toFixed(2); // Redondear el total a 2 decimales

  useEffect(() => {
    getCustomer();
  }, []);

  return (
    <div className="pt-20 px-5">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full flex justify-between items-center text-2xl border-b border-b-violet-500 pl-2 pb-2">
            <div className="flex">
              <button onClick={() => navigate("/POS/customers")}>
                <IoArrowBackCircleOutline className="text-violet-500" />
              </button>
              <h2 className=" ml-2">
                Detalle del cliente - #{customer?.customer_id}
              </h2>
            </div>
            <div className="text-lg">
              {customer?.customer_state == "active" ? (
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
                    onClick={deleteCustomer}
                    className="text-red-300 mr-4 hover:text-red-500"
                  />
                </button>
                <AddEditCustomer
                  icon={<FaEdit />}
                  fetchCustomers={getCustomer}
                  customerToUpdate={customer}
                  customerId={customerId}
                />
              </div>
            </div>
          </div>
          <div className="p-1 w-full flex flex-wrap overflow-auto">
            <div className="w-1/3 mt-3 pr-2">
              <div className="w-full overflow-hidden">
                <div className="mb-2 rounded-xl bg-white py-3 px-6">
                  <h3 className="text-lg font-semibold mb-2  border-b border-b-violet-500 pl-2 pb-1">
                    Información personal
                  </h3>
                  <p className="capitalize">
                    <span className="font-semibold">Nombre:</span>{" "}
                    {customer?.customer_name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {customer?.email}
                  </p>
                  <p>
                    <span className="font-semibold">Teléfono:</span>{" "}
                    {customer?.phone}
                  </p>
                  <p>
                    <span className="font-semibold">Código postal:</span>{" "}
                    {customer?.zip_code}
                  </p>
                  <p>
                    <span className="font-semibold">Dirección de envío:</span>{" "}
                    {customer?.shipping_address}
                  </p>
                </div>
                <div className="mb-2 rounded-xl bg-white py-3 px-6">
                  <h3 className="text-lg font-semibold mb-2 border-b border-b-violet-500 pl-2 pb-1">
                    Información fiscal
                  </h3>
                  <p>
                    <span className="font-semibold">CUIT/CUIL:</span>{" "}
                    {customer?.cuit_cuil}
                  </p>
                  <p>
                    <span className="font-semibold">Condición de IVA:</span>{" "}
                    {customer?.vat_condition === "final_consumer"
                      ? "Consumidor final"
                      : customer?.vat_condition === "exempt"
                      ? "Excento"
                      : customer?.vat_condition === "monotribute"
                      ? "Monotributo"
                      : "Registered"}
                  </p>
                  <p>
                    <span className="font-semibold">Límite de crédito:</span>{" "}
                    {customer?.credit_limit}
                  </p>
                </div>
                <div className="mb-2 rounded-xl bg-white py-3 px-6">
                  <h3 className="text-lg font-semibold mb-2 border-b border-b-violet-500 pl-2 pb-1">
                    Otra información
                  </h3>
                  <p>
                    <span className="font-semibold">Fecha de admisión:</span>{" "}
                    {customer?.admission_date}
                  </p>
                  <p>
                    <span className="font-semibold">Notas:</span>{" "}
                    {customer?.notes}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-2/3 p-1">
              <h3 className="text-lg font-semibold mb-1">Listado de deuda</h3>
              {productsCart.length > 0 ? (
                <table className=" text-left rounded-md overflow-hidden">
                  <thead>
                    <tr className="bg-violet-700 text-white">
                      <th className="py-2 px-4">Producto</th>
                      <th className="py-2 px-4">Cantidad</th>
                      <th className="py-2 px-4">Precio</th>
                      <th className="py-2 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsCart.map((item, i) => (
                      <tr key={i} className={"odd:bg-gray-100 bg-white"}>
                        <td className="py-2 px-4">{item.product_name}</td>
                        <td className="py-2 px-4">{item.quantity}</td>
                        <td className="py-2 px-4">
                          {parseFloat(
                            item.current_price * (1 + item.sale_price / 100)
                          ).toFixed(2)}
                        </td>
                        <td className="py-2 px-4">
                          {parseFloat(
                            item.current_price *
                              (1 + item.sale_price / 100) *
                              item.quantity
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center bg-white p-2 rounded-md text-violet-600 border-violet-600 border-2 font-semibold">
                  No hay productos en la deuda.
                </p>
              )}
              <span>Deuda total: {totalCartPrice}</span>
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
      <td className="font-semibold bg-white px-3">{title}</td>
      <td className="bg-white  px-3 text-neutral-500">{value}</td>
    </tr>
  );
};

export default CustomerDetail;
