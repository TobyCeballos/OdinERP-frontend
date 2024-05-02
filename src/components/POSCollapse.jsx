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
            Vender✓
          </Link>
        </li>
        <li>
          <Link
            to={"/POS/add-inventory"}
            onClick={toggleShowPos}
            className={linkStyles}>
            Comprar
          </Link>
        </li>
      </ul>
      <div className="w-px bg-violet-300 mx-3"></div>
      <ul className="flex flex-col w-1/2 pl-5 py-3">
        <h3 className="text-violet-800 font-bold text-lg">Ver listados</h3>
        <li>
          <Link to={"/POS/sales"} 
            onClick={toggleShowPos} className={linkStyles} href="">
            Ventas✓
          </Link>
        </li>
        <li>
          <Link
            to={"/POS/customers"}
            onClick={toggleShowPos}
            className={linkStyles}>
            Clientes✓
          </Link>
        </li>
        <li>
          <Link
            to={"/POS/providers"}
            onClick={toggleShowPos}
            className={linkStyles}>
            Proveedores
          </Link>
        </li>
        <li>
          <Link
            to={"/POS/stock"}
            onClick={toggleShowPos}
            className={linkStyles}
          >
            Stock✓
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default POSCollapse;
