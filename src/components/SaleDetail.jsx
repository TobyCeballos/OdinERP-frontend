import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_ENDPOINT } from "../utils/config";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import EditSale from "./EditSale";

const SaleDetail = () => {
  const [sale, setSale] = useState(null);
  const [productsCart, setProductsCart] = useState([]);
  const { saleId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "x-access-token": `${token}`,
    },
  };

  // Función para obtener los detalles de la venta usando Axios
  const getSale = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}api/sells/${saleId}`,
        config
      );
      console.log(response.data);
      setSale(response.data);
      // Obtener los detalles de los productos en el carrito
      const productsDetails = await Promise.all(
        response.data.cart.map(async (item) => {
          const productResponse = await axios.get(
            `${API_ENDPOINT}api/products/${item.objectId}`,
            config
          );
          return { ...productResponse.data, quantity: item.quantity };
        })
      );
      setProductsCart(productsDetails);
    } catch (error) {
      console.error("Error al obtener los detalles de la venta:", error);
    }
  };

  const deleteSale = async (sale_id) => {
    const response = await axios
      .delete(`${API_ENDPOINT}api/sells/${saleId}`, config)
      .then(() => {
        navigate("/POS/stock");
      });
  };

  // Llamar a la función getSale cuando el componente se monta
  useEffect(() => {
    getSale();
  }, []);
  const totalCartPrice = productsCart
    .reduce((total, item) => {
      // Multiplicar el precio total del producto por la cantidad
      const totalPriceForItem = parseFloat(
        item.current_price * (1 + item.sale_price / 100)
      );
      // Sumar al total
      return total + totalPriceForItem * item.quantity;
    }, 0)
    .toFixed(2);

  return (
    <div className="pt-20 px-5">
      <div className="w-full flex justify-between text-2xl border-b border-b-violet-500 pl-2 pb-2">
        <div className="flex">
          <button onClick={() => navigate("/POS/sales")}>
            <IoArrowBackCircleOutline className="text-violet-500" />
          </button>
          <h2 className=" ml-2">Detalle de la venta - #{sale?.sale_id}</h2>
        </div>
        <div>
            <div className="flex">
              <button>
                <FaTrashAlt
                  onClick={deleteSale}
                  className="text-red-300 mr-4 hover:text-red-500"
                />
              </button>
              <EditSale
                icon={<FaEdit />}
                getSale={getSale}
                saleToUpdate={sale}
                saleId={sale?._id}
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
            No hay productos en el carrito.
          </p>
        )}
      </div>
      <div>
        <div className="flex justify-end px-5 mt-4">
          <div className="flex flex-col items-end">
            <div className="flex">
              <span className="font-semibold">Descuento:</span>
              <span className="ml-2">{sale?.discount}%</span>
            </div>
            <div className="flex">
              <span className="font-semibold">Depósito:</span>
              <span className="ml-2">${sale?.deposit}</span>
            </div>
            <div className="flex">
              <span className="font-semibold">Subtotal:</span>
              <span className="ml-2">${totalCartPrice}</span>
            </div>
            <div className="flex">
              <span className="font-semibold">Total:</span>
              <span className="ml-2">
                $
                {parseFloat(
                  totalCartPrice * (1 - sale?.discount / 100) - sale?.deposit
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetail;
