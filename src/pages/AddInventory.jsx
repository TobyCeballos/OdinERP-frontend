import React, { useEffect, useRef, useState } from "react";
import ProductTable from "../components/ProductTable";
import { FaMinus, FaTrashAlt } from "react-icons/fa";
import { API_ENDPOINT } from "../utils/config";
import axios from "axios";
const AddInventory = () => {
  const [cashRegister, setCashRegister] = useState("");
  const [providers, setProviders] = useState([]);
  const [description, setDescription] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [warranty, setWarranty] = useState("");
  const [receiptType, setReceiptType] = useState("ticket");
  const [payCondition, setPayCondition] = useState("cash");
  const [vatCondition, setVatCondition] = useState("final_consumer");
  const [discount, setDiscount] = useState("");
  const [deposit, setDeposit] = useState("");
  const [userData, setUserData] = useState([]);
  const [notification, setNotification] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [addProvider, setAddProvider] = useState(false);
  const [productId, setProductId] = useState("");
  const [providerId, setProviderId] = useState(null);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [productNameSearch, setProductNameSearch] = useState("");
  const [providerCodeSearch, setProviderCodeSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(0);
  const productNameRef = useRef(null);
  const providerCodeRef = useRef(null);

  const handleProductNameSearch = async (event) => {
    const { value } = event.target;
    setProductNameSearch(value);
    if (value.trim() === "") {
      setShowProductSearch(false);
    } else {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}api/products/search/${value}`,
          { headers }
        );
        if (response.data.length <= 0) {
          console.log("Producto no encontrado");
          setProducts([]); // Limpiar los resultados anteriores
        } else {
          setProducts(response.data);
          setShowProductSearch(true);
        }
      } catch (error) {
        console.error("Error al buscar productos:", error);
      }
    }
  }; // Función para agregar un producto al carrito de compras
  const addToCart = () => {
    // Verificar que se haya seleccionado un producto
    if (productNameSearch.trim() === "") {
      showNotification("Debe seleccionar un producto.");
      return;
    }

    // Verificar que la cantidad sea un número válido
    const quantityValue = parseFloat(quantity);
    if (isNaN(quantityValue) || quantityValue <= 0) {
      showNotification("La cantidad debe ser un número mayor que cero.");
      return;
    }

    // Verificar que el precio de compra sea un número válido

    if (isNaN(purchasePrice) || purchasePrice <= 0) {
      showNotification(
        "El precio de compra debe ser un número mayor que cero."
      );
      return;
    }

    // Crear un objeto para el producto a agregar al carrito
    const productToAdd = {
      objectId: productId,
      product_name: productNameSearch,
      provider_product_id: providerCodeSearch,
      quantity: quantityValue,
      purchasePrice: purchasePrice,
    };

    // Agregar el producto al carrito
    setCart((prevCart) => [...prevCart, productToAdd]);

    // Limpiar los campos de búsqueda y detalles del producto
    setProductNameSearch("");
    setProviderCodeSearch("");
    setQuantity("");
    setPurchasePrice("");
    setShowProductSearch(false);
  };

  const handleProviderCodeSearch = async (event) => {
    const { value } = event.target;
    setProviderCodeSearch(value);
    if (value.trim() === "") {
      setShowProductSearch(false);
    } else {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}api/products/search/${value}`,
          { headers }
        );
        if (response.data.length <= 0) {
          console.log("Producto no encontrado");
          setProducts([]); // Limpiar los resultados anteriores
        } else {
          setProducts(response.data);
          setShowProductSearch(true);
        }
      } catch (error) {
        console.error(
          "Error al buscar productos por código de proveedor:",
          error
        );
      }
    }
  };

  // Función para mostrar el mensaje de notificación durante 5 segundos
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const [productsCart, setProductsCart] = useState([]);
  const removeFromCart = (productId) => {
    // Eliminar el producto del carrito
    setCart((prevCart) =>
      prevCart.filter((item) => item.objectId !== productId)
    );
  };const handleBuy = async (e) => {
    e.preventDefault();
    const buyData = {
      cashRegister,
      provider: searchValue,
      description,
      zipCode,
      warranty,
      receiptType,
      payCondition,
      vatCondition,
      discount,
      deposit,
      cart,
    };
  
    try {
      if (searchValue.trim() === "") {
        showNotification("Debe seleccionar un proveedor.");
        return;
      }
      
      // Actualizar el stock y el precio de compra de cada producto en el carrito
      cart.forEach(async (item) => {
        const updateStockData = {
          stock: item.quantity, // Restar la cantidad del stock
          purchase_price: item.purchasePrice,
        };
        console.log(item.purchasePrice);
        // Enviar la solicitud POST para actualizar el stock y el precio de compra
        const stockUpdateResponse = await axios.put(
          `${API_ENDPOINT}api/products/${item.objectId}/on-buy`,
          updateStockData,
          { headers: headers }
        );
        console.log("Stock actualizado:", stockUpdateResponse.data);
      });
      
      const response = await axios.post(
        `${API_ENDPOINT}api/purchase`,
        buyData,
        { headers: headers }
      );
  
      // Limpiar el carrito y mostrar la notificación
      setProductsCart([]);
      setCart([]);
      showNotification("Compra realizada exitosamente.");
      handleCancel(); // Otras acciones después de finalizar la compra
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      // Manejar el error según sea necesario
    }
  };
  

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const headers = {
    "x-access-token": `${token}`,
  };
  const searchRef = useRef(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await axios
          .get(`${API_ENDPOINT}api/users/${userId}`, { headers })
          .then((response) => {
            console.log(response.data);
            setUserData(response.data);
            setCashRegister(response.data.user_id);
          })
          .catch((err) => console.error(`Error! ${err}`));
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    updateProductsCart();
    const handleClickOutside = (event) => {
      // Verificar si el clic ocurrió fuera del cuadro de búsqueda
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false); // Ocultar el cuadro de búsqueda
      }
    };

    // Agregar el manejador de eventos al documento
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el manejador de eventos al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cart]); // Se llama a updateProductsCart cada vez que cart se actualiza

  const updateProductsCart = async () => {
    try {
      const updatedProducts = await Promise.all(
        cart.map(async (item) => {
          // Realizar consulta por cada productId en el carrito
          const response = await axios.get(
            `${API_ENDPOINT}api/products/${item.objectId}`,
            {
              headers: headers,
            }
          );
          const productData = response.data;
          // Agregar el atributo quantity al objeto productData
          productData.quantity = item.quantity;
          productData.purchasePrice = item.purchasePrice;
          return productData;
        })
      );
      console.log(updatedProducts);
      setProductsCart(updatedProducts);
    } catch (error) {
      console.error("Error al actualizar los productos del carrito:", error);
    }
  };

  const handleSearch = async (event) => {
    const { value } = event.target;
    setShowSearch(true);
    setSearchValue(value);
    if (value.trim() === "") {
      setShowSearch(false);
    } else {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}api/providers/search/${value}`,
          { headers }
        );
        if (response.data.length <= 0) {
          setAddProvider(true);
          setProviders([]); // Limpiar los resultados anteriores
        } else {
          setAddProvider(false);
          setProviders(response.data);
        }
      } catch (error) {
        console.error("Error searching customers:", error);
      }
    }
  };

  const handleCancel = () => {
    setProductsCart([]);
    setCart([]);
    setCashRegister("");
    setDescription("");
    setZipCode("");
    setWarranty("");
    setReceiptType("ticket");
    setPayCondition("cash");
    setVatCondition("final_consumer");
    setDiscount("");
    setDeposit("");
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

  const createProvider = async (providerName) => {
    try {
      const config = {
        headers: {
          "x-access-token": `${token}`,
        },
      };
      const response = await axios.post(
        `${API_ENDPOINT}api/providers/automaticProvider/${providerName}`,
        {},
        config
      );
      console.log("Proveedor creado:", response.data);
      setShowSearch(false);
      showNotification("Proveedor creado exitosamente.");
    } catch (error) {
      console.error("Error al crear el proveedor:", error);
      showNotification("Error al crear el proveedor. Inténtalo de nuevo.");
    }
  };

  return (
    <form className="pt-20 px-5 flex flex-col text-center">
      <div className="w-full mb-2 flex justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
        <h2>Comprar</h2>
      </div>
      <div className="flex flex-wrap mb-1">
        <div className="p-1 w-1/12">
          <input
            type="text"
            className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
            placeholder="Caja"
            value={cashRegister}
            readOnly={true}
            onChange={(e) => setCashRegister(e.target.value)}
          />
        </div>
        <div className="p-1 w-3/12" ref={searchRef}>
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
                      console.log(provider);
                      setSearchValue(provider.provider_name);
                      setZipCode(provider.zip_code);
                      setVatCondition(provider.vat_condition);
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
            className="w-full  border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
            placeholder="Direccion de entrega(si aplica)"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
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
            placeholder="Tipo de recibo"
            name="text"
            value={receiptType}
            onChange={(e) => setReceiptType(e.target.value)}
            required
          >
            <option value="ticket">Ticket</option>
            <option value="factura">Factura</option>
          </select>
        </div>
        <div className="p-1 w-3/12">
          <select
            type="text"
            className="w-full   border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
            placeholder="Condición de pago"
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
            placeholder="Condición de IVA"
            name="text"
            value={vatCondition}
            onChange={(e) => setVatCondition(e.target.value)}
            required
          >
            <option value="final_consumer">Consumidor final</option>
            <option value="exempt">Exentos</option>
            <option value="monotribute">Monotributista</option>
            <option value="registered_responsible">
              Responsable inscripto
            </option>
          </select>
        </div>
      </div>
      <div className="flex w-full flex-wrap">
        <div className=" bg-white w-full rounded-md p-3 m-1">
          <div className="w-full mb-2 flex justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
            <h2>Busca el producto y carga el detalle</h2>
          </div>
          <div className="flex flex-wrap">
            <div className="w-5/6 p-1">
              <input
                type="text"
                value={productNameSearch}
                onChange={handleProductNameSearch}
                placeholder="Nombre del producto"
                className="w-full capitalize border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                ref={productNameRef}
              />
              {showProductSearch && (
                <div className="absolute rounded-md overflow-hidden mt-1 shadow-md bg-white text-neutral w-8/12">
                  {products.length > 0 ? ( // Renderizar resultados si hay proveedores
                    products.map((product, index) => (
                      <div
                        onClick={() => {
                          setProductId(product._id);
                          setProductNameSearch(product.product_name);
                          setProviderCodeSearch(product.provider_product_id);
                          setPurchasePrice(product.current_price);
                          setShowProductSearch(false);
                        }}
                        className="text-left w-full flex justify-between py-1 px-5 hover:bg-slate-100 capitalize rounded-md"
                        key={index}
                      >
                        {product.product_name}
                        <span className="bg-violet-400 px-4 rounded-full text-white">
                          {product.provider_product_id}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-1 flex flex-col justify-center">
                      <h3 className="p-2">Producto no encontrado</h3>
                      <button
                        onClick={() => {
                          navigate("/POS/stock");
                        }}
                        type="button"
                        className="w-full p-1 font-semibold text-violet-500 border-t border-t-violet-500"
                      >
                        Ir al listado
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="w-1/6 p-1">
              <input
                type="text"
                value={providerCodeSearch}
                onChange={handleProviderCodeSearch}
                placeholder="Cod. prov"
                className="w-full capitalize border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                ref={providerCodeRef}
              />
            </div>
            <div className="w-3/6 p-1">
              <input
                type="number"
                name=""
                id=""
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="cantidad"
                className="w-full capitalize border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
              />
            </div>
            <div className="w-3/6 p-1">
              <input
                type="number"
                name=""
                id=""
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="precio de compra"
                className="w-full capitalize border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
              />
            </div>
          </div>
          <div className="p-1">
            <button
              type="button"
              onClick={() => addToCart()}
              className="w-full border-violet-500 border-2 text-violet-500 font-semibold text-lg rounded-md py-2"
            >
              Añadir a la compra
            </button>
          </div>
        </div>
        <div className="p-1 w-full overflow-auto">
          {productsCart.length > 0 ? ( // Verificar si hay productos en el carrito
            <table className="w-full text-left rounded-md overflow-hidden">
              <thead>
                <tr className="bg-violet-700">
                  <th>-</th>
                  <th className="">Producto</th>
                  <th className="">Cant</th>
                  <th className="">Precio</th>
                  <th className="">Total</th>
                </tr>
              </thead>
              <tbody>
                {productsCart.map((item, i) => (
                  <tr key={i} className={"odd:bg-gray-100 bg-white"}>
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          removeFromCart(item._id);
                        }}
                        className="p-1 text-red-600"
                      >
                        ×
                      </button>
                    </td>
                    <td className="py-2 px-4">{item.product_name}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">
                      {parseFloat(item.purchasePrice).toFixed(2)}
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
        <div className="flex flex-col justify-between w-full">
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
                type="number"
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                placeholder="Seña ($)"
                value={deposit}
                max={parseFloat(totalCartPrice)}
                min={0}
                onChange={(e) => setDeposit(e.target.value)}
              />
            </div>
            <div className="p-1 w-full">
              <input
                type="number"
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                placeholder="Neto"
                value={totalCartPrice}
                readOnly
              />
            </div>
            <div className="p-1 w-full">
              <input
                type="text"
                className="w-full border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
                placeholder="Total"
                value={
                  "$" +
                  parseFloat(
                    totalCartPrice * (1 - discount / 100) - deposit
                  ).toFixed(2)
                }
              />
            </div>
          </div>

          <div className="p-1 w-full flex">
            <button
              onClick={(e) => handleBuy(e)}
              className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-full w-full"
            >
              Finalizar
            </button>
            <button
              type="button"
              onClick={() => {
                handleCancel();
              }}
              className="text-center p-3 bg-violet-800 hover:bg-violet-900 ml-1 rounded-full"
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>
      {notification && (
        <div className="bg-violet-500 text-white py-2 px-4 rounded-full absolute bottom-4 right-1/2 translate-x-1/2">
          {notification}
        </div>
      )}
    </form>
  );
};

export default AddInventory;
