import React from "react";
import { Link } from "react-router-dom";

const POSCollapse = ({ linkStyles, toggleShowPos }) => {
  return (
    <div className="bg-white flex absolute z-50 inset-x-0 left-1/2 transform -translate-x-1/2 rounded-lg mt-2 p-3">
      <ul className="flex flex-col pl-5 py-3 w-1/2">
        <h3 className="text-violet-800 font-bold text-lg">Hacer</h3>
        <li>
          <Link
            to={"/POS/sell"}
            onClick={toggleShowPos}
            className={linkStyles}>
            Vender
          </Link>
        </li>
        <li>
          <a className={linkStyles} href="">
            Facturar
          </a>
        </li>
        <li>
          <a className={linkStyles} href="">
            Añadir clientes
          </a>
        </li>
        <li>
          <a className={linkStyles} href="">
            Añadir proveedores
          </a>
        </li>
        <li>
          <a className={linkStyles} href="">
            Comprar
          </a>
        </li>
      </ul>
      <div className="w-px bg-violet-300 mx-3"></div>
      <ul className="flex flex-col w-1/2 pl-5 py-3">
        <h3 className="text-violet-800 font-bold text-lg">Ver listados</h3>
        <li>
          <a className={linkStyles} href="">
            Facturas
          </a>
        </li>
        <li>
          <a className={linkStyles} href="">
            Ventas
          </a>
        </li>
        <li>
          <a className={linkStyles} href="">
            Clientes
          </a>
        </li>
        <li>
          <a className={linkStyles} href="">
            Provedores
          </a>
        </li>
        <li>
          <Link
            to={"/POS/stock"}
            onClick={toggleShowPos}
            className={linkStyles}
          >
            Stock
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default POSCollapse;
