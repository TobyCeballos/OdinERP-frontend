import React, { useState } from "react";

const EditSale = ({ icon, saleToUpdate }) => {
  const [formData, setFormData] = useState(saleToUpdate);

  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}
        className="text-violet-400"
      >
        {icon}
      </button>
      {show && (
        <form
          className='absolute w-1/2 rounded-md bg-white text-base text-neutral-700 left-1/2 py-5 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white"'
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl border-l-violet-800 text-violet-900 py-2 my-3 border-l-4 font-semibold w-full px-10">
            Editar venta
          </h2>
          <div className="flex flex-wrap w-full text-white px-4 py-4">
            <div className="w-1/6 p-1">
              <label className="text-neutral-700" htmlFor="cashRegister">
                Caja:
              </label>
              <input
                type="text"
                id="cashRegister"
                name="cashRegister"
                value={formData?.cashRegister}
                onChange={handleChange}
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
              />
            </div>
            <div className="w-4/6 p-1">
              <label className="text-neutral-700" htmlFor="customer">
                Cliente:
              </label>
              <input
                type="text"
                id="customer"
                name="customer"
                value={formData?.customer}
                onChange={handleChange}
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
              />
            </div>
            <div className="w-1/6 p-1">
              <label className="text-neutral-700" htmlFor="warranty">
                Garantía:
              </label>
              <input
                type="text"
                id="warranty"
                name="warranty"
                value={formData?.warranty}
                onChange={handleChange}
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
              />
            </div>
            <div className="w-full p-1">
              <label className="text-neutral-700" htmlFor="description">
                Descripción:
              </label>
              <input
                id="description"
                name="description"
                type="text"
                value={formData?.description}
                onChange={handleChange}
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
              />
            </div>
            <div className="w-2/6 p-1">
              <label className="text-neutral-700" htmlFor="receiptType">
                Tipo de recibo:
              </label>
              <select
                id="receiptType"
                name="receiptType"
                value={formData?.receiptType}
                onChange={handleChange}
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
              >
                <option value="factura">Factura</option>
                <option value="ticket">Ticket</option>
              </select>
            </div>
            <div className="w-2/6 p-1">
              <label className="text-neutral-700" htmlFor="payCondition">
                Condición de pago:
              </label>
              <select
                id="payCondition"
                name="payCondition"
                value={formData?.payCondition}
                onChange={handleChange}
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
              >
                <option value="cash">Efectivo</option>
                <option value="current_account">Cuenta corriente</option>
                <option value="card">Tarjeta</option>
              </select>
            </div>
            <div className="w-2/6 p-1">
              <label className="text-neutral-700" htmlFor="vatCondition">
                Condición de IVA:
              </label>
              <select
                id="vatCondition"
                name="vatCondition"
                value={formData?.vatCondition}
                onChange={handleChange}
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
              >
                <option value="registered_responsible">
                  Responsable inscripto
                </option>
                <option value="final_consumer">Consumidor final</option>
                <option value="exempt">Exento</option>
                <option value="monotribute">Monotributista</option>
              </select>
            </div>
            <div className="w-2/6 p-1">
              <label className="text-neutral-700" htmlFor="discount">
                Descuento:
              </label>

              <input
                type="number"
                id="discount"
                name="discount"
                value={formData?.discount}
                onChange={handleChange}
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
              />
            </div>
            <div className="w-2/6 p-1">
              <label className="text-neutral-700" htmlFor="deposit">
                Depósito:
              </label>
              <input
                type="number"
                id="deposit"
                name="deposit"
                value={formData?.deposit}
                onChange={handleChange}
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
              />
            </div>
            <div className="w-2/6 p-1">
              <label className="text-neutral-700" htmlFor="shippingAddress">
                Direc.
              </label>
              <input
                type="text"
                id="shipping_address"
                name="shipping_address"
                value={formData?.shippingAddress}
                onChange={handleChange}
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
              />
            </div>
          </div>
          <div className="px-4 flex">
            <button
              type="submit"
              className="w-2/3 m-1 border-2 transition-all duration-300 ease-in-out hover:shadow-md text-violet-700 font-semibold text-xl border-violet-700 rounded-md py-2 hover:bg-violet-500 hover:text-white"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={() => setShow(false)}
              className="w-1/3 m-1 border-2 transition-all duration-300 ease-in-out hover:shadow-md text-violet-700 font-semibold text-xl border-violet-700 rounded-md py-2 hover:bg-violet-500 hover:text-white"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditSale;
