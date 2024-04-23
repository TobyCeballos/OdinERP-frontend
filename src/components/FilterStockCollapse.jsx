import { useState } from "react";
import { IoOptionsOutline } from "react-icons/io5";

const FilterStockCollapse = ({
  toggleColumnVisibility,
  tableHead,
  hiddenColumns,
  hideAllColumns,
  showAllColumns,
}) => {
  const [show, setShow] = useState(false);

  const toggleShow = () => {
    setShow(!show);
  };

  // Define los nombres de los encabezados que quieres omitir
  const omittedHeaders = ["_id"];

  return (
    <div className="relative">
      <button className="mr-5" onClick={toggleShow}>
        <IoOptionsOutline />
      </button>
      {show && (
        <div className="absolute bg-white text-sm w-80 right-2 flex flex-wrap mt-2 p-3 gap-1 rounded-lg">
          {tableHead.map((header, index) => (
            // Verifica si el encabezado actual no está en la lista de encabezados omitidos
            !omittedHeaders.includes(header) && (
              <label
                key={index}
                className="flex items-center whitespace-nowrap px-2 py-1 bg-violet-500 rounded-full"
              >
                <input
                  className="col-span-1 text-left flex flex-row mr-1 bg-white text-white"
                  type="checkbox"
                  checked={!hiddenColumns.includes(index)}
                  onChange={() => toggleColumnVisibility(index)}
                />
                {header}
              </label>
            )
          ))}
          <div className="w-full flex justify-evenly">
            <a onClick={hideAllColumns} className=" text-violet-400">
              Remover todo
            </a>
            <a onClick={showAllColumns} className=" text-violet-800">
              Mostrar todo
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterStockCollapse;
