import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader"
import Calendar from "../components/Calendar";

const Home = () => {
  const [dollarData, setDollarData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDollarData = async () => {
    setLoading(true);
    try {
      await axios
        .get("https://api.bluelytics.com.ar/v2/latest")
        .then( (res) => {
          console.log(res.data)
          setDollarData(res.data);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDollarData();
  }, []);
  const formatNumber = (number) => {
    return parseFloat(number).toFixed(2); // Ajusta el número a dos decimales
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-neutral-900 w-full h-screen flex flex-col px-5 pt-20">
          <div className="w-full flex justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
            <h2>Inicio</h2>
          </div>
          <div className="flex w-1/3 m-3 rounded-lg overflow-hidden">
            <table className=" w-full rounded-lg">
              <thead className=" text-neutral-100">
                <tr>
                  <th className="px-4 py-2  bg-violet-700">
                    Tipo de Dólar
                  </th>
                  <th className="px-4 py-2  bg-violet-700">Compra</th>
                  <th className="px-4 py-2  bg-violet-700">Venta</th>
                </tr>
              </thead>
              <tbody className=" text-neutral-600">
                <tr>
                  <td className="px-4 py-2 border bg-white border-gray-400">
                    Dólar Blue
                  </td>
                  <td className="px-4 py-2 border bg-white border-gray-400">
                    ${formatNumber(dollarData?.oficial?.value_buy)}
                  </td>
                  <td className="px-4 py-2 border bg-white border-gray-400">
                    ${formatNumber(dollarData?.oficial?.value_sell)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border bg-white border-gray-400">
                    Dólar Oficial
                  </td>
                  <td className="px-4 py-2 border bg-white border-gray-400">
                    ${formatNumber(dollarData?.blue?.value_buy)}
                  </td>
                  <td className="px-4 py-2 border bg-white border-gray-400">
                    ${formatNumber(dollarData?.blue?.value_sell)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <Calendar />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
