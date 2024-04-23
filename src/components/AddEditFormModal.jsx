import React, { useState, useEffect } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { API_ENDPOINT } from "../utils/config";
import axios from "axios";

const AddEditFormModal = ({ fetchProducts, icon, productToUpdate, productId }) => {
  const [productName, setProductName] = useState("");
  const [productProvider, setProductProvider] = useState("");
  const [providerProductId, setProviderProductId] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [gain, setGain] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minQty, setMinQty] = useState("");
  const [maxQty, setMaxQty] = useState("");
  const [status, setStatus] = useState("active");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (productToUpdate) {
      setProductName(productToUpdate.product_name);
      setProductProvider(productToUpdate.product_provider);
      setProviderProductId(productToUpdate.provider_product_id);
      setDescription(productToUpdate.description);
      setCategory(productToUpdate.category);
      setBrand(productToUpdate.brand);
      setPurchasePrice(productToUpdate.purchase_price);
      setCurrentPrice(productToUpdate.current_price);
      setGain(productToUpdate.sale_price);
      setUnit(productToUpdate.unit_measurement);
      setQuantity(productToUpdate.stock);
      setMinQty(productToUpdate.min_stock);
      setMaxQty(productToUpdate.max_stock);
      setStatus(productToUpdate.product_state);
    }
  }, [productToUpdate]);

  const token = localStorage.getItem("token");

  const resetStates = () => {
    setProductName("");
    setProviderProductId("");
    setDescription("");
    setCategory("");
    setBrand("");
    setPurchasePrice("");
    setCurrentPrice("");
    setGain("");
    setUnit("");
    setQuantity("");
    setMinQty("");
    setMaxQty("");
    setStatus("active");
  };

  const headers = {
    "x-access-token": `${token}`,
  };

  const handleAddEditForm = async (event) => {
    event.preventDefault();
    try {
      const data = {
        product_name: productName,
        product_provider: productProvider,
        provider_product_id: providerProductId,
        description: description,
        category: category,
        brand: brand,
        purchase_price: purchasePrice,
        current_price: currentPrice,
        sale_price: gain,
        unit_measurement: unit,
        stock: quantity,
        min_stock: minQty,
        max_stock: maxQty,
        product_state: status,
      };
      console.log(data.product_name + ": " + token);
      if (productToUpdate) {
        await axios
          .put(`${API_ENDPOINT}api/products/${productId}`, data, { headers: headers })
          .then(() => {
            fetchProducts();
            resetStates();
          });
      } else {
        await axios
          .post(`${API_ENDPOINT}api/products`, data, { headers: headers })
          .then(() => {
            fetchProducts();
            resetStates();
          });
      }
      setShowModal(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <div>
      <div>
        <button
                type="button"
          onClick={toggleModal}
          className="p-1 hover:bg-slate-200 rounded-full m-1"
        >
          {icon}
        </button>
      </div>
      {showModal && (
        <div className="absolute text-base text-neutral-200 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white">
          <form
            onSubmit={handleAddEditForm}
            className="bg-white  rounded shadow-xl shadow-black"
          >
            <h2 className="text-xl border-l-violet-800 text-violet-900 py-2 my-3 border-l-4 font-semibold w-full px-10">
              Añadir producto
            </h2>
            <div className="grid grid-cols-6 px-7 gap-1">
              <div className="col-span-3">
                <input
                  type="text"
                  className="w-full  border-b-2 outline-none focus-visible:border-b-violet-500 borderb-b-neutral-500 rounded-md py-2 px-3"
                  placeholder="Nombre"
                  name="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Proveedor"
                  name="text"
                  value={productProvider}
                  onChange={(e) => setProductProvider(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-1">
                <input
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="id prov."
                  name="text"
                  value={providerProductId}
                  onChange={(e) => setProviderProductId(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-6">
                <input
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Descripcion"
                  name="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Categoria"
                  name="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Marca"
                  name="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Costo de compra"
                  name="text"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Costo actual"
                  name="number"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Ganancia (%)"
                  min={0}
                  max={100}
                  name="text"
                  value={gain}
                  onChange={(e) => setGain(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Unidad de medida"
                  name="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Cantidad"
                  name="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Min. cant."
                  name="text"
                  value={minQty}
                  onChange={(e) => setMinQty(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Max. cant."
                  name="text"
                  value={maxQty}
                  onChange={(e) => setMaxQty(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <select
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Estado"
                  name="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="flex flex-row px-10 mt-4 pb-4">
              <input
                type="submit"
                className="w-2/3 border-2 transition-all duration-300 ease-in-out hover:shadow-md text-violet-700 font-semibold text-xl border-violet-700 rounded-md py-2 px-3 hover:bg-violet-500 hover:text-white "
                value="Guardar"
              />
              <button
                onClick={() => toggleModal()}
                className="w-1/3 ml-2 border-2 transition-all duration-300 ease-in-out hover:shadow-md text-violet-900 font-semibold text-xl border-violet-900 rounded-md py-2 px-3 hover:bg-violet-900 hover:text-white "
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddEditFormModal;
