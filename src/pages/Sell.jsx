import React, { useEffect, useRef, useState } from "react";
import ProductTable from "../components/ProductTable";
import { FaMinus, FaTrashAlt } from "react-icons/fa";
import { API_ENDPOINT } from "../utils/config";
import axios from "axios";
const Sell = () => {
  const [cashRegister, setCashRegister] = useState("");
  const [customers, setCustomers] = useState([]);
  const [description, setDescription] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [warranty, setWarranty] = useState("");
  const [receiptType, setReceiptType] = useState("ticket");
  const [payCondition, setPayCondition] = useState("cash");
  const [vatCondition, setVatCondition] = useState("final_consumer");
  const [discount, setDiscount] = useState("");
  const [deposit, setDeposit] = useState("");
  const [userData, setUserData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [addCustomer, setAddCustomer] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Función para mostrar el mensaje de notificación durante 5 segundos
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const [cart, setCart] = useState([]);
  const [productsCart, setProductsCart] = useState([]);
  const removeFromCart = (productId) => {
    // Eliminar el producto del carrito
    setCart((prevCart) =>
      prevCart.filter((item) => item.objectId !== productId)
    );
  };
  const handleSell = async ({ e, customerId }) => {
    e.preventDefault();
    const sellData = {
      cashRegister,
      customer: searchValue,
      description,
      shippingAddress,
      warranty,
      receiptType,
      payCondition,
      vatCondition,
      discount,
      deposit,
      cart,
    };
    try {
      if (vatCondition == "current_account") {
        if (searchValue.trim() === "") {
          showNotification(
            "Para cuenta corriente, debe seleccionar un cliente."
          );
          return;
        }
      }
      if (cart.length === 0) {
        showNotification("Debe seleccionar al menos un producto.");
        return;
      }
      const response = await axios.post(
        `${API_ENDPOINT}api/sells/${company}/`,
        sellData,
        {
          headers: headers,
        }
      );
      showNotification("Venta creada exitosamente.");

      cart.forEach(async (item) => {
        const updateStockData = {
          stock: item.quantity, // Restar la cantidad del stock
        };
        // Enviar la solicitud POST para actualizar el stock y el precio de compra
        const stockUpdateResponse = await axios
          .put(
            `${API_ENDPOINT}api/products/${company}/${item.objectId}/on-sell`,
            updateStockData,
            { headers: headers }
          )
          .then((response) => {
            showNotification("Hubo variaciones en el stock");
          });
      });
      if (payCondition === "current_account") {
        // Si la condición de pago es 'current_account', hacer la petición para añadir los productos al carrito de cuenta corriente del cliente
        const addToCurrentAccountData = {
          customerId: customerId, // Supongo que tienes el cliente seleccionado almacenado en alguna variable 'customer'
          cart: cart,
        };
        const addToCurrentAccountResponse = await axios.post(
          `${API_ENDPOINT}api/customers/${company}/${customerId}/addToCurrentAccountCart`,
          addToCurrentAccountData,
          {
            headers: headers,
          }
        );
        // Aquí puedes realizar cualquier acción adicional después de agregar los productos al carrito de cuenta corriente
      }

      handleCancel();
      // Aquí puedes realizar cualquier acción adicional después de crear la venta
    } catch (error) {
      console.error("Error al crear la venta:", error);
      // Aquí puedes manejar el error de acuerdo a tus necesidades
    }
  };

  const company = localStorage.getItem("company");
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
            `${API_ENDPOINT}api/products/${company}/${item.objectId}`,
            {
              headers: headers,
            }
          );
          const productData = response.data;
          // Agregar el atributo quantity al objeto productData
          productData.quantity = item.quantity;
          return productData;
        })
      );
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
          `${API_ENDPOINT}api/customers/${company}/search/${value}`,
          { headers }
        );
        if (response.data.length <= 0) {
          setAddCustomer(true);
          setCustomers([]); // Limpiar los resultados anteriores
        } else {
          setAddCustomer(false);
          setCustomers(response.data);
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
    setSearchValue("");
    setDescription("");
    setShippingAddress("");
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

  const createCustomer = async (customerName) => {
    try {
      const config = {
        headers: {
          "x-access-token": `${token}`,
        },
      };
      const response = await axios.post(
        `${API_ENDPOINT}api/customers/${company}/automaticCustomer/${customerName}`,
        {},
        config
      );
      setShowSearch(false);
      showNotification("Cliente creado exitosamente.");
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      showNotification("Error al crear el cliente. Inténtalo de nuevo.");
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
            readOnly={true}
            onChange={(e) => setCashRegister(e.target.value)}
          />
        </div>
        <div className="p-1 w-3/12" ref={searchRef}>
          <input
            type="text"
            className="w-full capitalize border-b-2 outline-none border-b-neutral-500 focus-visible:border-b-violet-500 rounded-md py-2 px-3"
            placeholder="Cliente"
            value={searchValue}
            onChange={handleSearch}
          />
          {showSearch && (
            <div className="absolute rounded-md overflow-hidden mt-1 shadow-md bg-white text-neutral w-3/12">
              {customers.length > 0 ? ( // Renderizar resultados si hay clientes
                customers.map((customer, index) => (
                  <div
                    onClick={() => {
                      setSearchValue(customer.customer_name);
                      setShippingAddress(customer.shipping_address);
                      setVatCondition(customer.vat_condition);
                      setCustomerId(customer._id);
                    }}
                    className="text-left py-1 px-5 hover:bg-slate-100 capitalize rounded-md"
                    key={index}
                  >
                    {customer.customer_name}
                  </div>
                ))
              ) : (
                <div className="p-1 flex flex-col justify-center">
                  <h3 className="p-2">
                    ¿Desea crear el cliente{" "}
                    <span className="text-violet-500 font-semibold capitalize">
                      {searchValue}
                    </span>
                    ?
                  </h3>
                  <button
                    onClick={() => {
                      createCustomer(searchValue);
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
            <option value="factura">Factura</option>
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
            <option value="check">Cheque</option>
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
              sortOtions={false}
              pagination={true}
              addOptions={false}
              headerOptions={true}
              footerOptions={true}
              selectable={true}
              showNotification={showNotification}
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
          </div>

          <div className="p-1 w-full flex">
            <button
              onClick={(e) => handleSell({ e, customerId })}
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

export default Sell;
