import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterStockCollapse from "./FilterStockCollapse";
import axios from "axios";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { SiMicrosoftexcel } from "react-icons/si";
import AddEditFormModal from "./AddEditFormModal";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import Loader from "./Loader";
import { API_ENDPOINT } from "../utils/config";
import UploadExcel from "./UploadExcel";

const tableHead = [
  "_id",
  "ID",
  "Nombre",
  "Proveedor",
  "id. prov",
  "Descripción",
  "Categoría",
  "Marca",
  "Costo de compra",
  "Costo actual",
  "Precio",
  "Unidad",
  "Cantidad",
  "Min. qty",
  "Max. qty",
  "Estado",
  "F. de carga",
  "F. Modif",
];

function TableHead({ selectable, hiddenColumns }) {
  return (
    <thead className="bg-violet-700 text-white">
      <tr>
        {selectable && (
          <>
            <th>+</th>
            <th>cant</th>
          </>
        )}
        {tableHead.map(
          (head, colIndex) =>
            !hiddenColumns.includes(colIndex) && (
              <th className="whitespace-nowrap p-1 text-left" key={colIndex}>
                {head}
              </th>
            )
        )}
      </tr>
    </thead>
  );
}

function TableBody({
  selectable,
  products,
  hiddenColumns,
  handleRowClick,
  addToCart,
  showNotification,
}) {
  const renderCellContent = (key, product) => {
    switch (key) {
      case "_id":
        return product._id;
      case "product_id":
        return product.product_id;
      case "product_name":
        return product.product_name;
      case "product_provider":
        return product.product_provider;
      case "provider_product_id":
        return product.provider_product_id;
      case "description":
        return product.description;
      case "category":
        return product.category;
      case "brand":
        return product.brand;
      case "purchase_price":
        return "$" + product.purchase_price;
      case "current_price":
        return "$" + parseFloat(product.current_price).toFixed(2);
      case "sale_price":
        return (
          "$" +
          parseFloat(
            product.current_price * (1 + product.sale_price / 100)
          ).toFixed(2)
        );
      case "unit_measurement":
        return product.unit_measurement;
      case "stock":
        if (product.stock <= product.min_stock) {
          return <span className="text-red-500">{product.stock}</span>;
        } else {
          return <span>{product.stock}</span>;
        }
      case "min_stock":
        return product.min_stock;
      case "max_stock":
        return product.max_stock;
      case "product_state":
        if (product.product_state === "active") {
          return (
            <span className="bg-green-500 px-5 text-white rounded-full">
              Activo
            </span>
          );
        } else {
          return (
            <span className="bg-red-500 px-5 text-white rounded-full">
              Inactivo
            </span>
          );
        }
      case "createdAt":
        return new Date(product.createdAt).toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      case "updatedAt":
        return new Date(product.updatedAt).toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      default:
        return null;
    }
  };
  const [quantities, setQuantities] = useState({}); // Estado para almacenar las cantidades de cada producto

  // Manejar el cambio de cantidad para un producto específico
  const handleQuantityChange = (productId, quantity) => {
    setQuantities({ ...quantities, [productId]: quantity });
  };
  return (
    <>
      {products.length > 0 ? (
        <tbody>
          {products.map((product, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-orange-100 font-semibold odd:bg-gray-100 text-neutral-700"
            >
              {selectable && (
                <>
                  <td className="text-center">
                    {product.stock >= 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product._id, quantities[product._id] || 1);
                        }}
                        className="text-violet-500 flex justify-center ml-1"
                      >
                        <FaPlus />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product._id, quantities[product._id] || 1);
                          showNotification(
                            "Producto por debajo del stock minimo"
                          );
                        }}
                      >
                        <span className="text-red-500 flex justify-center ml-1">
                          <IoWarningOutline />
                        </span>
                      </button>
                    )}
                  </td>
                  <td>
                    <input
                      min={1}
                      placeholder="1"
                      value={quantities[product._id]}
                      onChange={(e) =>
                        handleQuantityChange(product._id, e.target.value)
                      }
                      className="w-16 text-white text-center rounded-full"
                      type="number"
                    />
                  </td>
                </>
              )}

              {Object.keys(product).map(
                (key, colIndex) =>
                  !hiddenColumns.includes(colIndex) && (
                    <td
                      onDoubleClick={() => handleRowClick(product._id)}
                      className="whitespace-nowrap p-1"
                      key={colIndex}
                    >
                      {renderCellContent(key, product)}
                    </td>
                  )
              )}
            </tr>
          ))}
        </tbody>
      ) : (
        <tbody>
          <tr>
            <td
              colSpan={tableHead.length - hiddenColumns.length}
              className="text-center py-3 font-semibold text-xl"
            >
              No se encontraron productos :(
            </td>
          </tr>
        </tbody>
      )}
    </>
  );
}

function reorderProductData(productData) {
  const orderedProductData = {};

  // Define el orden deseado de las columnas
  const desiredColumnOrder = [
    "_id",
    "product_id",
    "product_name",
    "product_provider",
    "provider_product_id",
    "description",
    "category",
    "brand",
    "purchase_price",
    "current_price",
    "sale_price",
    "unit_measurement",
    "stock",
    "min_stock",
    "max_stock",
    "product_state",
    "createdAt",
    "updatedAt",
  ];
  desiredColumnOrder.forEach((key) => {
    orderedProductData[key] = productData[key];
  });

  return orderedProductData;
}
const ProductTable = ({
  name,
  filter,
  search,
  sortOtions,
  pagination,
  addOptions,
  headerOptions,
  footerOptions,
  height,
  selectable,
  cart,
  setCart,
  updateProductsCart,
  showNotification,
}) => {
  const [hiddenColumns, setHiddenColumns] = useState([
    0, 3, 4, 6, 8, 9, 13, 14,
  ]);
  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const company = localStorage.getItem("company");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const config = {
    headers: {
      "x-access-token": `${token}`,
    },
  };

  const addToCart = (productId, quantityToAdd = 1) => {
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(
      (item) => item.objectId === productId
    );

    if (existingProductIndex !== -1) {
      // Si el producto ya está en el carrito, sumar la cantidad especificada
      const updatedCart = [...cart];
      const currentQuantity = updatedCart[existingProductIndex].quantity;
      updatedCart[existingProductIndex].quantity =
        currentQuantity + parseInt(quantityToAdd);
      setCart(updatedCart);
      updateProductsCart();
    } else {
      // Si el producto no está en el carrito, agregarlo con la cantidad especificada
      setCart([
        ...cart,
        { objectId: productId, quantity: parseInt(quantityToAdd) },
      ]);
    }
  };

  const handleRowClick = (productId) => {
    navigate(`/POS/stock/details/${productId}`);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (searchValue.trim() === "") {
        const response = await axios.get(
          `${API_ENDPOINT}api/products/${company}?page=${currentPage}`,
          config
        );

        const reorderedProducts =
          response.data.products.map(reorderProductData);
        setProducts(reorderedProducts);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } else {
        const response = await axios.get(
          `${API_ENDPOINT}api/products/${company}/search/${searchValue}?page=${currentPage}`,
          config
        );

        const reorderedProducts =
          response.data.results.map(reorderProductData);
        setProducts(reorderedProducts);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);
  const handleSearch = async (event) => {
    const { value } = event.target;
    setCurrentPage(1); // Reset currentPage when performing a new search
    setSearchValue(value);
    if (value.trim() === "") {
      fetchProducts();
    } else {
      // Use the updated value here
      try {
        const response = await axios.get(
          `${API_ENDPOINT}api/products/${company}/search/${value}?page=${currentPage}`,
          config
        );
        console.log(response.data);
        const reorderedProducts = response.data.results.map(reorderProductData);
        setProducts(reorderedProducts);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    }
  };

  const toggleColumnVisibility = (index) => {
    if (hiddenColumns.includes(index)) {
      setHiddenColumns(hiddenColumns.filter((col) => col !== index));
    } else {
      setHiddenColumns([...hiddenColumns, index]);
    }
  };

  const hideAllColumns = () => {
    setHiddenColumns([...Array(tableHead.length).keys()]);
  };

  const showAllColumns = () => {
    setHiddenColumns([0]);
  };

  const someColumnsVisible =
    hiddenColumns.length >= 1 && hiddenColumns.length === tableHead.length;

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(parseInt(currentPage) + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(parseInt(currentPage) - 1);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-74px)] mt-[70px]">
      {headerOptions && (
        <div className="w-full flex justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
          <h2>{name}</h2>
          <div className="flex">
            {search && (
              <div className="flex items-center relative mr-3 w-80">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchValue}
                  onChange={handleSearch}
                  className="text-base py-1 w-full px-5 shadow-md rounded-full bg-white"
                />
                <FaSearch className="absolute right-3 text-base" />
              </div>
            )}
            {filter && (
              <button>
                <FilterStockCollapse
                  toggleColumnVisibility={toggleColumnVisibility}
                  tableHead={tableHead}
                  hiddenColumns={hiddenColumns}
                  hideAllColumns={hideAllColumns}
                  showAllColumns={showAllColumns}
                />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto bg-neutral-800 mt-3 rounded-xl">
        <table className="bg-white w-full h-full">
          <TableHead selectable={selectable} hiddenColumns={hiddenColumns} />
          {loading ? (
            <tbody>
              <tr>
                <td
                  colSpan={tableHead.length}
                  className="h-full w-full flex justify-center items-center"
                >
                  <Loader modified={true} />
                </td>
              </tr>
            </tbody>
          ) : (
            <TableBody
              addToCart={addToCart}
              selectable={selectable}
              products={products}
              hiddenColumns={hiddenColumns}
              handleRowClick={handleRowClick}
              showNotification={showNotification}
            />
          )}
        </table>
        {someColumnsVisible && (
          <div className="bg-white text-violet-700 text-center text-xl p-4 font-semibold rounded-xl">
            Por favor, selecciona una columna para mostrar. ;)
          </div>
        )}
      </div>
      {footerOptions && (
        <div className="bg-white flex justify-between w-full p-2 rounded-xl mt-2">
          {sortOtions && (
            <select
              className="rounded-full px-2 py-1 bg-white border-slate-200 border overflow-hidden outline-none"
              name=""
              id=""
            >
              <option value="id">ID</option>
              <option value="id">Nombre</option>
              <option value="id">Marca</option>
              <option value="id">F. Modif</option>
            </select>
          )}
          {pagination && (
            <div className="flex justify-center items-center">
              <button
                type="button"
                onClick={prevPage}
                className="p-1 hover:bg-slate-200 rounded-full m-1"
              >
                <IoIosArrowBack />
              </button>
              <input
                type="number"
                className="w-16 text-center bg-white rounded-full"
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
              />
              <span>de {totalPages} páginas</span>
              <button
                type="button"
                onClick={nextPage}
                className="p-1 hover:bg-slate-200 rounded-full m-1"
              >
                <IoIosArrowForward />
              </button>
            </div>
          )}
          {addOptions && (
            <div className="flex justify-center items-center">
              <AddEditFormModal
                fetchProducts={fetchProducts}
                icon={<MdOutlinePlaylistAdd />}
              />
              <UploadExcel fetchProducts={fetchProducts} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTable;
