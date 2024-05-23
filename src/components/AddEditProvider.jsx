import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../utils/config";

const AddEditProvider = ({
  fetchProvider,
  icon,
  providerToUpdate,
  providerId,
}) => {
  const [providerName, setProviderName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [cuitCuil, setCuitCuil] = useState("");
  const [vatCondition, setVatCondition] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [pendingBalance, setPendingBalance] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [providerState, setProviderState] = useState("active");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (providerToUpdate) {
      setProviderName(providerToUpdate.provider_name);
      setEmail(providerToUpdate.email);
      setPhone(providerToUpdate.phone);
      setZipCode(providerToUpdate.zip_code);
      setAddress(providerToUpdate.address);
      setCuitCuil(providerToUpdate.cuit_cuil);
      setVatCondition(providerToUpdate.vat_condition);
      setCreditLimit(providerToUpdate.credit_limit);
      setPendingBalance(providerToUpdate.pending_balance);
      setAdmissionDate(providerToUpdate.admission_date);
      setNotes(providerToUpdate.notes);
      setProviderState(providerToUpdate.provider_state);
    }
  }, [providerToUpdate]);

  const token = localStorage.getItem("token");

  const resetStates = () => {
    setProviderName("");
    setEmail("");
    setPhone("");
    setZipCode("");
    setAddress("");
    setCuitCuil("");
    setVatCondition("");
    setCreditLimit("");
    setPendingBalance("");
    setAdmissionDate("");
    setNotes("");
    setProviderState("active");
  };

  const company = localStorage.getItem("company");
  const headers = {
    "x-access-token": token,
  };

  const handleAddEditForm = async (event) => {
    event.preventDefault();
    try {
      const data = {
        provider_name: providerName,
        email: email,
        phone: phone,
        zip_code: zipCode,
        address:address,
        cuit_cuil: cuitCuil,
        vat_condition: vatCondition,
        credit_limit: creditLimit,
        pending_balance: pendingBalance,
        admission_date: admissionDate,
        notes: notes,
        provider_state: providerState,
      };

      if (providerToUpdate) {
        await axios.put(`${API_ENDPOINT}api/providers/${company}/${providerId}`, data, {
          headers: headers,
        });
      } else {
        await axios.post(`${API_ENDPOINT}api/providers/${company}/`, data, {
          headers: headers,
        });
      }
      fetchProvider();
      resetStates();
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
              {providerToUpdate ? <span>Editar</span> : <span>Añadir</span>}{" "}
              proveedor
            </h2>
            <div className="grid grid-cols-6 px-7 gap-1">
              <div className="col-span-3">
                <input
                  type="text"
                  className="w-full  border-b-2 outline-none focus-visible:border-b-violet-500 borderb-b-neutral-500 rounded-md py-2 px-3"
                  placeholder="Nombre"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
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
              <div className="col-span-3">
                <input
                  type="text"
                  className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Direccion"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  value={providerState}
                  onChange={(e) => setProviderState(e.target.value)}
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

export default AddEditProvider;
