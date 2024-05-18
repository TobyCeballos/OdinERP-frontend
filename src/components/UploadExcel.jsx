import { SiMicrosoftexcel } from "react-icons/si";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../utils/config";
import io from 'socket.io-client';

const socket = io('http://192.168.0.18:4000');

const UploadExcel = ({ fetchProducts }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [gain, setGain] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [providers, setProviders] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [providerId, setProviderId] = useState(null);
  const [bulkLoad, setBulkLoad] = useState(false);
    const token = localStorage.getItem("token");
    const company = localStorage.getItem("company");
  
    useEffect(() => {
      socket.on('progress', (data) => {
        showNotification("Aguarde unos segundos, una IA está corroborando los datos.")
        console.log(data.progress);
        setProgress(data.progress);
      });
  
      return () => {
        socket.off('progress');
      };
    }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };


  const createProvider = async (providerName) => {
    try {
      const config = {
        headers: {
          "x-access-token": `${token}`,
        },
      };
      const response = await axios.post(
        `${API_ENDPOINT}api/providers/${company}/automaticProvider/${providerName}`,
        {},
        config
      );
      setShowSearch(false);
      showNotification("Proveedor creado exitosamente.");
    } catch (error) {
      console.error("Error al crear el proveedor:", error);
      showNotification("Error al crear el proveedor. Inténtalo de nuevo.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showNotification("No se ha seleccionado ningún archivo");
      return;
    }
    setBulkLoad(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sale_price", gain);
    formData.append("product_provider", searchValue);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-access-token": token,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      },
    };

    try {
      const response = await axios.post(
        `${API_ENDPOINT}api/products/bulk-update/${company}`,
        formData,
        config
      );
      setBulkLoad(false)
      setProgress(0)
      fetchProducts();
      setShowModal(false);
      showNotification(response.data.message);
    } catch (error) {
      showNotification("Error al cargar el archivo");
      console.error("Error al cargar el archivo:", error);
    }
  };
  const handleSearch = async (event) => {
    const headers = {
      "x-access-token": `${token}`,
    };
    const { value } = event.target;
    setShowSearch(true);
    setSearchValue(value);
    if (value.trim() === "") {
      setShowSearch(false);
    } else {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}api/providers/${company}/search/${value}`,
          { headers }
        );
        if (response.data.length <= 0) {
          setProviders([]); // Limpiar los resultados anteriores
        } else {
          setProviders(response.data);
        }
      } catch (error) {
        console.error("Error searching customers:", error);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(!showModal)}
        className="p-1 hover:bg-slate-200 rounded-full m-1"
      >
        <SiMicrosoftexcel/>
      </button>
      {showModal && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm">
          <div className="bg-white w-1/3 rounded-lg shadow-lg ">
            <h2 className="text-xl border-l-violet-800 text-violet-900 py-2 my-4 border-l-4 font-semibold w-full px-10">
              Cargar listado
            </h2>
            <div className="px-5 py-3">
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-violet-900"
                  htmlFor="file_input"
                >
                  Upload file
                </label>
                <input
                  className="block w-full text-sm text-violet-900 border border-violet-300 rounded-lg cursor-pointer focus:outline-violet-500"
                  id="file_input"
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
                <p
                  className="mt-1 text-sm text-violet-500"
                  id="file_input_help"
                >
                  Solo archivos: XLS, XLSX.
                </p>
              </div>
              <div className="py-1">
                <input
                  className="w-full py-2 px-5 rounded-full text-white"
                  placeholder="Ganancia (%)"
                  type="number"
                  max={100}
                  min={0}
                  value={gain}
                  onChange={(e) => setGain(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full capitalize border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                  placeholder="Proveedor"
                  value={searchValue}
                  onChange={handleSearch}
                />
                {showSearch && (
                  <div className="absolute rounded-md overflow-hidden mt-1 shadow-md bg-white text-neutral w-3/12">
                    {providers.length > 0 ? ( // Renderizar resultados si hay proveedores
                      providers.map((provider, index) => (
                        <div
                          onClick={() => {
                            setShowSearch(false)
                            setSearchValue(provider.provider_name);
                            setProviderId(provider._id);
                          }}
                          className="text-left py-1 px-5 hover:bg-slate-100 capitalize rounded-md"
                          key={index}
                        >
                          {provider.provider_name}
                        </div>
                      ))
                    ) : (
                      <div className="p-1 flex flex-col justify-center">
                        <h3 className="p-2">
                          ¿Desea crear el proveedor{" "}
                          <span className="text-violet-500 font-semibold capitalize">
                            {searchValue}
                          </span>
                          ?
                        </h3>
                        <button
                          onClick={() => {
                            createProvider(searchValue);
                          }}
                          type="button"
                          className="w-full p-1 font-semibold text-violet-500 border-t border-t-violet-500"
                        >
                          Crear
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                className="bg-violet-500 w-full rounded-md p-1 mt-5"
                onClick={handleUpload}
              >
                Subir archivo
              </button>
              <button
                className="text-violet-500 w-full rounded-md p-1 mt-1"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>{bulkLoad && (
                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm">
                  Progreso: {progress}%
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {notification && (
        <div className="bg-violet-500 z-50 text-white py-2 px-4 rounded-full absolute bottom-4 right-1/2 translate-x-1/2">
          {notification}
        </div>
      )}
    </>
  );
};

export default UploadExcel;
