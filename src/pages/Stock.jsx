import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import ProductTable from "../components/ProductTable";

function Stock() {
  return (
    <div className="pt-20 px-5 flex flex-col">
      <ProductTable
        name={"Stock"}
        filter={true}
        search={true}
        sortOtions={true}
        pagination={true}
        addOptions={true}
        headerOptions={true}
        footerOptions={true}
        height={"h-[70vh]"}
      />
    </div>
  );
}

export default Stock;
