import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../utils/config";

const AddEditCustomer = ({
  fetchCustomers,
  icon,
  customerToUpdate,
  customerId,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [cuitCuil, setCuitCuil] = useState("");
  const [vatCondition, setVatCondition] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [pendingBalance, setPendingBalance] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [customerState, setCustomerState] = useState("active");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (customerToUpdate) {
      setCustomerName(customerToUpdate.customer_name);
      setEmail(customerToUpdate.email);
      setPhone(customerToUpdate.phone);
      setZipCode(customerToUpdate.zip_code);
      setShippingAddress(customerToUpdate.shipping_address);
      setCuitCuil(customerToUpdate.cuit_cuil);
      setVatCondition(customerToUpdate.vat_condition);
      setCreditLimit(customerToUpdate.credit_limit);
      setPendingBalance(customerToUpdate.pending_balance);
      setAdmissionDate(customerToUpdate.admission_date);
      setNotes(customerToUpdate.notes);
      setCustomerState(customerToUpdate.customer_state);
    }
  }, [customerToUpdate]);

  const token = localStorage.getItem("token");
  const company = localStorage.getItem("company");

  const resetStates = () => {
    setCustomerName("");
    setEmail("");
    setPhone("");
    setZipCode("");
    setShippingAddress("");
    setCuitCuil("");
    setVatCondition("");
    setCreditLimit("");
    setPendingBalance("");
    setAdmissionDate("");
    setNotes("");
    setCustomerState("active");
  };

  const headers = {
    "x-access-token": `${token}`,
  };

  const handleAddEditForm = async (event) => {
    event.preventDefault();
    try {
      const data = {
        customer_name: customerName,
        email: email,
        phone: phone,
        zip_code: zipCode,
        shipping_address: shippingAddress,
        cuit_cuil: cuitCuil,
        vat_condition: vatCondition,
        credit_limit: creditLimit,
        pending_balance: pendingBalance,
        admission_date: admissionDate,
        notes: notes,
        customer_state: customerState,
      };

      if (customerToUpdate) {
        await axios
          .put(`${API_ENDPOINT}api/customers/${company}/${customerId}`, data, {
            headers: headers,
          })
          .then(() => {
            fetchCustomers();
            resetStates();
          });
      } else {
        await axios
          .post(`${API_ENDPOINT}api/customers/${company}/`, data, { headers: headers })
          .then(() => {
            fetchCustomers();
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
          className="p-1 text-violet-500 hover:bg-slate-200 rounded-full m-1"
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
              {customerToUpdate ? <span>Editar</span> : <span>Añadir</span>}{" "}
              cliente
            </h2>
            <div className="grid grid-cols-6 px-7 gap-1">
              <div className="col-span-3">
                <input
                  type="text"
                  className="w-full  border-b-2 outline-none focus-visible:border-b-violet-500 borderb-b-neutral-500 rounded-md py-2 px-3"
                  placeholder="Nombre"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Código postal"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  
                />
              </div>
              <div className="col-span-6">
                <input
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Dirección de envío"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Cuit/Cuil"
                  value={cuitCuil}
                  onChange={(e) => setCuitCuil(e.target.value)}
                  
                />
              </div>
              <div className="col-span-3">
                <select
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Condición de IVA"
                  value={vatCondition}
                  onChange={(e) => setVatCondition(e.target.value)}
                  required
                >
                  <option value="final_consumer">Consumidor final</option>
                  <option value="exempt">Excento</option>
                  <option value="monotribute">Monotributista</option>
                  <option value="registered_responsible">
                    Responsable inscripto
                  </option>
                </select>
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Límite de crédito"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Saldo pendiente"
                  value={pendingBalance}
                  onChange={(e) => setPendingBalance(e.target.value)}
                />
              </div>
              <div className="col-span-6">
                <textarea
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Notas"
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
              <div className="col-span-2">
                <select
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  value={customerState}
                  onChange={(e) => setCustomerState(e.target.value)}
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

export default AddEditCustomer;
