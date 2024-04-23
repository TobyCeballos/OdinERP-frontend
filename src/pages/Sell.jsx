import React, { useState } from "react";
import ProductTable from "../components/ProductTable";
import { FaTrashAlt } from "react-icons/fa";
import { API_ENDPOINT } from "../utils/config";
import axios from "axios";
const Sell = () => {
  const [cashRegister, setCashRegister] = useState("");
  const [customer, setCustomer] = useState("");
  const [description, setDescription] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [warranty, setWarranty] = useState("");
  const [receiptType, setReceiptType] = useState("ticket");
  const [payCondition, setPayCondition] = useState("cash");
  const [vatCondition, setVatCondition] = useState("final_consumer");
  const [discount, setDiscount] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [net, setNet] = useState("");
  const [cart, setCart] = useState([]);
  const [productsCart, setProductsCart] = useState([]);

  const handleSell = (e) => {
    e.preventDefault();
    console.log({
      cashRegister,
      customer,
      description,
      shippingAddress,
      warranty,
      receiptType,
      payCondition,
      vatCondition,
      discount,
      deposit,
      net,
      cart,
    });
  };

  const token = localStorage.getItem('token')
  const headers = {
    "x-access-token": `${token}`,
  };


  const updateProductsCart = async () => {
    try {
      const updatedProducts = [];
      for (const item of cart) {
        // Realizar consulta por cada productId en el carrito
        const response = await axios
          .get(`${API_ENDPOINT}api/products/${item.objectId}`, {headers: headers})
          .then((response) => {
            const productData = response.data;
            updatedProducts.push(productData);
          });
      }
      setProductsCart(updatedProducts);
      console.log(productsCart);
    } catch (error) {
      console.error("Error al actualizar los productos del carrito:", error);
    }
  };
  return (
    <form className="pt-20 px-5 flex flex-col text-center">
      <div className="w-full mb-2 flex justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
        <h2>Vender</h2>
      </div>
      <div className="flex flex-wrap mb-1">
        <div className="p-1 w-1/12">
          <input
            type="text"
            className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
            placeholder="Caja"
            value={cashRegister}
            onChange={(e) => setCashRegister(e.target.value)}
          />
        </div>
        <div className="p-1 w-3/12">
          <input
            type="text"
            className="w-full  border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
            placeholder="Cliente"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
        </div>
        <div className="p-1 w-5/12">
          <input
            type="text"
            className="w-full   border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
            placeholder="Descripcion"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="p-1 w-3/12">
          <input
            type="text"
            className=" w-full  border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
            placeholder="Direccion de entrega(si aplica)"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />
        </div>
        <div className="p-1 w-3/12">
          <input
            type="text"
            className="w-full  border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
            placeholder="Garantia"
            value={warranty}
            onChange={(e) => setWarranty(e.target.value)}
          />
        </div>
        <div className="p-1 w-3/12">
          <select
            type="text"
            className="w-full  border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
            placeholder="Estado"
            name="text"
            value={receiptType}
            onChange={(e) => setReceiptType(e.target.value)}
            required
          >
            <option value="ticket">Ticket</option>
            <option value="inactive">Factura</option>
          </select>
        </div>
        <div className="p-1 w-3/12">
          <select
            type="text"
            className="w-full   border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
            placeholder="Estado"
            name="text"
            value={payCondition}
            onChange={(e) => setPayCondition(e.target.value)}
            required
          >
            <option value="cash">Efectivo</option>
            <option value="current_account">Cuenta corriente</option>
            <option value="card">Tarjeta</option>
          </select>
        </div>
        <div className="p-1 w-3/12">
          <select
            type="text"
            className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
            placeholder="Estado"
            name="text"
            value={vatCondition}
            onChange={(e) => setVatCondition(e.target.value)}
            required
          >
            <option value="final_consumer">Consumidor final</option>
            <option value="exempt">exentos</option>
            <option value="monotribute">Monotributista</option>
            <option value="registered_responsible">
              Responsable inscripto
            </option>
          </select>
        </div>
      </div>
      <div className="flex w-full">
        <div className="h-[70vh] bg-white w-2/3 rounded-md p-3 m-1">
          <div className="">
            <ProductTable
              name={"Lista de productos"}
              filter={true}
              search={true}
              sortOtions={true}
              pagination={true}
              addOptions={true}
              headerOptions={true}
              footerOptions={false}
              selectable={true}
              height={"h-full"}
              cart={cart}
              setCart={setCart}
              updateProductsCart={updateProductsCart}
            />
          </div>
        </div>
        <div className="flex flex-col justify-between w-1/3">
          <div>
            <div className="p-1 w-full">
              <input
                type="number"
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                placeholder="Descuento (%)"
                value={discount}
                onChange={(e) => {
                  const re = /^[+]?([0-9]+)?(\.[0-9]*)?$/;
                  if (!re.exec(e.target.value)) return;
                  setDiscount(e.target.value);
                }}
                max={100}
                min={0}
              />
            </div>
            <div className="p-1 w-full">
              <input
                type="text"
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                placeholder="Seña ($)"
              />
            </div>
            <div className="p-1 w-full">
              <input
                type="text"
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                placeholder="Neto"
              />
            </div>
            <div className="p-1 w-full">
              <input
                type="text"
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                placeholder="Total"
              />
            </div>
          </div>
          <div className="p-1 w-full flex">
            <button
              onClick={(e) => handleSell(e)}
              className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-full w-full"
            >
              Finalizar
            </button>
            <button className="text-center p-3 bg-violet-800 hover:bg-violet-900 ml-1 rounded-full">
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Sell;
