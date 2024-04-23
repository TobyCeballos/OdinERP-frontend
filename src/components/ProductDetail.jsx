import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_ENDPOINT } from "../utils/config";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { VscDebugBreakpointData } from "react-icons/vsc";
import Loader from "./Loader";
import AddEditFormModal from "./AddEditFormModal";

const ProductDetail = () => {
  // Estado para almacenar la información del producto
  const [product, setProduct] = useState(null);
  const { productId } = useParams();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "x-access-token": `${token}`,
    },
  };
  // Función para obtener los detalles del producto usando Axios
  const getProduct = async () => {
    try {
      // Realizar la consulta a la API usando Axios
      const response = await axios
        .get(`${API_ENDPOINT}api/products/${productId}`, config)
        .then((response) => {
          console.log(response.data);
          setProduct(response.data);
        });

      // Establecer los detalles del producto en el estado
    } catch (error) {
      console.error("Error al obtener los detalles del producto:", error);
    }
  };

  // Llamar a la función getProduct cuando el componente se monta
  useEffect(() => {
    getProduct();
  }, []);

  const deleteProduct = async () => {
    try {
      await axios.delete(`${API_ENDPOINT}api/products/${productId}`, config);
      // Redireccionar a la página de inicio después de eliminar el producto
      navigate("/POS/stock");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };
  // Si el producto ha sido cargado, mostrar sus detalles
  return (
    <div className="px-5 pt-20">
      <div className="w-full flex justify-between text-2xl border-b border-b-violet-500 pl-2 pb-2">
        <div className="flex">
          <button onClick={() => navigate("/POS/stock")}>
            <IoArrowBackCircleOutline className="text-violet-500" />
          </button>
          <h2 className=" ml-2">
            Detalle del producto - #{product?.product_id}
          </h2>
        </div>
      </div>
      {product ? (
        <div className="m-3 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <h2 className="text-3xl flex justify-between uppercase border-l-violet-800 text-violet-900 py-2 my-3 border-l-4 font-semibold w-full px-10">
            <div className="flex items-center">{product.product_name}</div>
            <span className="text-base text-neutral-600 flex items-center capitalize">
              <VscDebugBreakpointData
                className={
                  product.product_state === "active"
                    ? "text-green-400"
                    : "text-neutral-600"
                }
              />
              {product.product_state}
            </span>
            <div className="flex">
              <button>
                <FaTrashAlt
                  onClick={deleteProduct}
                  className="text-red-300 mr-4 hover:text-red-500"
                />
              </button>
              <AddEditFormModal
                icon={<FaEdit />}
                fetchProducts={getProduct}
                productToUpdate={product}
                productId={productId}
              />
            </div>
          </h2>
          <p className="mt-2 px-10 text-gray-500">{product.description}</p>
          <div className="mt-4 p-8">
            <p className="font-bold">Proveedor: {product.product_provider}</p>
            <p className="font-bold">
              ID del proveedor: {product.provider_product_id}
            </p>
            <p className="font-bold">Marca: {product.brand}</p>
            <p className="font-bold">
              Unidad de Medida: {product.unit_measurement}
            </p>
            <p className="font-bold">Fecha de carga: {product.upload_date}</p>
            <p className="font-bold">
              Fecha de modificacion: {product.modification_date}
            </p>
            <div className="w-full flex justify-between">
              <div className="w-1/3">
                <p className="py-1 px-5 rounded-sm border-b border-b-violet-500 font-bold w-full flex justify-between text-neutral-800">
                  <span>Stock: </span>
                  <span className={product.stock - product.min_stock <= 2 ? "text-red-500" : "text-neutral-800"}> {product.stock}</span>
                </p>
                <p className="py-1 px-5 rounded-sm  border-b border-b-violet-500 font-bold w-full flex justify-between text-neutral-800">
                  <span>Stock Mínimo:</span>
                  <span>{product.min_stock}</span>
                </p>
                <p className="py-1 px-5 rounded-sm  border-b border-b-violet-500 font-bold w-full flex justify-between text-neutral-800">
                  <span>Stock Máximo:</span>
                  <span>{product.max_stock}</span>
                </p>
              </div>
              <div className="w-1/3">
                <p className="py-1 px-5 rounded-sm border-b border-b-violet-500 font-bold w-full flex justify-between text-neutral-800">
                  <span>Precio de venta: </span>
                  <span>
                    $
                    {parseFloat(
                      product.current_price * (1 + product.sale_price / 100)
                    ).toFixed(2)}
                  </span>
                </p>
                <p className="py-1 px-5 rounded-sm  border-b border-b-violet-500 font-bold w-full flex justify-between text-neutral-800">
                  <span>Precio de compra: </span>
                  <span>${parseFloat(product.purchase_price).toFixed(2)}</span>
                </p>
                <p className="py-1 px-5 rounded-sm  border-b border-b-violet-500 font-bold w-full flex justify-between text-neutral-800">
                  <span>Precio actual: </span>
                  <span>${parseFloat(product.current_price).toFixed(2)}</span>
                </p>
                <p className="py-1 px-5 rounded-sm  border-b border-b-violet-500 font-bold w-full flex justify-between text-neutral-800">
                  <span>Ganancia($) </span>
                  <span>${parseFloat(product.current_price * (product.sale_price / 100)).toFixed(2)}</span>
                </p>
                <p className="py-1 px-5 rounded-sm  border-b border-b-violet-500 font-bold w-full flex justify-between text-neutral-800">
                  <span>Ganancia(%) </span>
                  <span>{parseFloat(product.sale_price).toFixed(2)}%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default ProductDetail;
