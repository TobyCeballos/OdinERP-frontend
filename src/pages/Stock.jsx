import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import ProductTable from "../components/ProductTable";

function Stock() {
  return (
    <div className="px-5 flex flex-col">
      <ProductTable
        name={"Stock"}
        filter={true}
        search={true}
        sortOtions={true}
        pagination={true}
        addOptions={true}
        headerOptions={true}
        footerOptions={true}
      />
    </div>
  );
}

export default Stock;
