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
      ).then(response =>{
      console.log(response.data);
      setLoading(false);
      setCustomer(response.data);}
)
      // Obtener los detalles de los productos en el carrito de la cuenta actual del cliente
      const productsDetails = await Promise.all(
        response.data.current_account_cart.map(async (item) => {
          
          const productResponse = await axios.get(
            `${API_ENDPOINT}api/products/${item.objectId}`,
            config
          ).then(response => {
            setLoading(false)
          });
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
      setLoading(true);
      const response = await axios.delete(
        `${API_ENDPOINT}api/customers/${customerId}`,
        config
      ).then(response => {
        setLoading(false);
      });
      navigate("/POS/customers");
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  useEffect(() => {
    getCustomer();
  }, []);

  return (
    <div className="pt-20 px-5">{ loading ? <Loader/> : <>
      <div className="w-full flex justify-between items-center text-2xl border-b border-b-violet-500 pl-2 pb-2">
        <div className="flex">
          <button onClick={() => navigate("/POS/customers")}>
            <IoArrowBackCircleOutline className="text-violet-500" />
          </button>
          <h2 className=" ml-2">
            Detalle del cliente - #{customer?.customer_id}
          </h2>
        </div>
        <div className="text-lg">{customer?.customer_state == "active" ? <span className="flex flex-row items-center"><VscDebugBreakpointData className="text-green-400"/> Activo</span> : <span className="flex flex-row items-center"><VscDebugBreakpointData className="text-red-400"/> Inactivo</span>}</div>
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
              fetchCustomersCustomer={getCustomer}
              customerToUpdate={customer}
              customerId={customerId}
            />
          </div>
        </div>
      </div>
      <div className="p-1 w-full flex flex-wrap overflow-auto">
        <div className="w-1/3 p-1">
          <table className="w-full rounded-md overflow-hidden">
            <tbody>
              <TableRow title="Nombre" value={customer?.customer_name} />
              <TableRow title="Email" value={customer?.email} />
              <TableRow title="Teléfono" value={customer?.phone} />
              <TableRow title="Código postal" value={customer?.zip_code} />
              <TableRow
                title="Dirección de envío"
                value={customer?.shipping_address}
              />
              <TableRow title="CUIT/CUIL" value={customer?.cuit_cuil} />
              <TableRow
                title="Condición de IVA"
                value={customer?.vat_condition === "final_consumer" ? "Consumidor final" : (customer?.vat_condition ==="exempt" ? "Excento" : (customer?.vat_condition ==="monotribute" ? "Monotributo" : "Registered"))}
              />
              <TableRow
                title="Límite de crédito"
                value={customer?.credit_limit}
              />
              <TableRow
                title="Fecha de admisión"
                value={customer?.admission_date}
              />
              <TableRow title="Notas" value={customer?.note} />
              <TableRow title="Estado" value={customer?.customer_state} />
            </tbody>
          </table>
        </div>
        <div className="w-2/3 p-1">
          <h3 className="text-lg font-semibold mb-1">Listado de deuda</h3>
          {productsCart.length > 0 ? (
            <table className=" text-left rounded-md overflow-hidden">
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
              No hay productos en la deuda.
            </p>
          )}
        </div>
      </div></>}
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

export default CustomerDetail;
