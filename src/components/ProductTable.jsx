import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterStockCollapse from "./FilterStockCollapse";
import axios from "axios";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { SiMicrosoftexcel } from "react-icons/si";
import AddEditFormModal from "./AddEditFormModal";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { FaPlus } from "react-icons/fa";


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
  "F. Modif",
  "F. de carga",
];
function TableHead({ selectable, hiddenColumns }) {
  return (
    <thead className="bg-violet-700 text-white">
      <tr>
        {selectable && <th>+</th>}
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
}) {
  const renderCellContent = (key, product) => {
    switch (key) {
      case "_id": return product._id;
      case "product_id": return product.product_id;
      case "product_name": return product.product_name;
      case "product_provider": return product.product_provider
      case "provider_product_id": return product.provider_product_id
      case "description": return product.description
      case "category": return product.category
      case "brand": return product.brand
      case "purchase_price": return product.purchase_price
      case "current_price": return parseFloat(product.current_price).toFixed(2)
      case "sale_price":
        return parseFloat(
          product.current_price * (1 + product.sale_price / 100)
        ).toFixed(2);
      case "unit_measurement": return product.unit_measurement
      case "stock": return product.stock
      case "min_stock": return product.min_stock
      case "max_stock": return  product.max_stock
      case "product_state": if(product.product_state === "active") {return <span className="bg-green-500 px-5 text-white rounded-full">Activo</span>} else {return <span className="bg-red-500 px-5 text-white rounded-full">Inactivo</span>}
      case "updatedAt": return new Date(product.updatedAt).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      case "createdAt": return new Date(product.createdAt).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      default:
        return null;
    }
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
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product._id);
                    }}
                    className="text-violet-500 flex justify-center ml-1"
                  >
                    <FaPlus />
                  </button>
                </td>
              )}
              {Object.keys(product).map(
                (key, colIndex) =>
                  !hiddenColumns.includes(colIndex) && (
                    <td
                      onClick={() => handleRowClick(product._id)}
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
  updateProductsCart
}) => {
  const [hiddenColumns, setHiddenColumns] = useState([
    0, 3, 4, 6, 8, 9, 13, 14,
  ]);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);


  const addToCart = (productId) => {
      
      // Verificar si el producto ya está en el carrito
      const existingProductIndex = cart.findIndex(item => item.objectId === productId);
  
      if (existingProductIndex !== -1) {
          // Si el producto ya está en el carrito, incrementar la cantidad
          const updatedCart = [...cart];
          updatedCart[existingProductIndex].quantity++;
          setCart(updatedCart);
          updateProductsCart()
      } else {
          // Si el producto no está en el carrito, agregarlo con cantidad 1
          setCart(prevCart => [
              ...prevCart,
              { objectId: productId, quantity: 1 }
          ]);
      }
  };
  
  

  const navigate = useNavigate();
  const handleRowClick = (productId) => {
    // Redirigir al usuario a la página de detalles del producto
    navigate(`/POS/stock/details/${productId}`);
  };
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "x-access-token": `${token}`,
    },
  };

  const fetchProducts = () => {
    axios.get(`${API_ENDPOINT}api/products?page=${currentPage}`, config).then((res) => {
      setProducts(res.data);
      console.log(res.data);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const toggleColumnVisibility = (index) => {
    if (hiddenColumns.includes(index)) {
      setHiddenColumns(hiddenColumns.filter((col) => col !== index));
    } else {
      setHiddenColumns([...hiddenColumns, index]);
    }
  };
  const handleSearch = async (event) => {
    const { value } = event.target;
    setSearchValue(value);
    if (value.trim() === "") {
      // Si el input está vacío, obtener todos los productos
      try {
        const response = await axios.get(`${API_ENDPOINT}api/products`, config);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    } else {
      // Si hay un término de búsqueda, realizar la búsqueda
      try {
        const response = await axios.get(
          `${API_ENDPOINT}api/products/search/${value}`,
          config
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error searching products:", error);
      }
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
  return (
    <div className={height + "flex"}>
      {headerOptions == true && (
        <div className="w-full -z-20 flex justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
          <h2>{name}</h2>
          <div className="flex">
            {search === true && (
              <div className="flex z-0 items-center relative mr-3 w-80">
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
            {filter === true && (
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
      <div
        className={`w-full flex flex-col mt-3 rounded-xl overflow-y-hidden overflow-x-auto bg-neutral-800`}
      >
        <table className="bg-white max-w-full text-left">
          <TableHead selectable={selectable} hiddenColumns={hiddenColumns} />
          <TableBody
            addToCart={addToCart}
            selectable={selectable}
            products={products}
            hiddenColumns={hiddenColumns}
            handleRowClick={handleRowClick}
          />
        </table>
        {someColumnsVisible && (
          <div className="bg-white text-violet-700 text-center text-xl p-4 font-semibold rounded-xl">
            Por favor, selecciona una columna para mostrar. ;)
          </div>
        )}
      </div>
      {footerOptions === true && (
        <div className="bg-white flex justify-between w-full p-2 rounded-xl mt-2">
          {sortOtions === true && (
            <select
              className="rounded-full  px-2 py-1 bg-white border-slate-200 border overflow-hidden outline-none"
              name=""
              id=""
            >
              <option value="id">ID</option>
              <option value="id">Nombre</option>
              <option value="id">Marca</option>
              <option value="id">F. Modif</option>
            </select>
          )}
          {pagination === true && (
            <div className="flex justify-center items-center">
              <button
                type="button"
                onClick={prevPage}
                className="p-1 hover:bg-slate-200 rounded-full m-1"
              >
                <IoIosArrowBack />
              </button>
              <span>{currentPage}</span>
              <button
                type="button"
                onClick={nextPage}
                className="p-1 hover:bg-slate-200 rounded-full m-1"
              >
                <IoIosArrowForward />
              </button>
            </div>
          )}
          {addOptions === true && (
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
