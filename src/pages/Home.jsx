import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Calendar from "../components/Calendar";
import Clock from "../components/Clock";
import NewsCard from "../components/NewsCard";
import { API_ENDPOINT } from "../utils/config.js";

const Home = () => {
  const [news, setNews] = useState([]);
  const [dollarData, setDollarData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDollarData = async () => {
    try {
      await axios.get("https://api.bluelytics.com.ar/v2/latest").then((res) => {
        console.log(res.data);
        setDollarData(res.data);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const token = localStorage.getItem("token");
  
  const config = {
    headers: {
      "x-access-token": `${token}`,
    },
  };
  const getNews = async () => {
    try {
      await axios.get(`${API_ENDPOINT}api/news`, config).then((res) => {
        console.log(res.data);
        setNews(res.data);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNews();
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
          <div className="w-full flex  justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
            <h2>Inicio</h2>
          </div>
          <div className="flex flex-row w-full">
            <div className="w-1/2 p-3">
              <div className="flex rounded-lg overflow-hidden">
                <table className="w-full rounded-lg">
                  <thead className=" text-neutral-100">
                    <tr>
                      <th className="px-4 py-2  bg-slate-700">Tipo de Dólar</th>
                      <th className="px-4 py-2  bg-slate-700">Compra</th>
                      <th className="px-4 py-2  bg-slate-700">Venta</th>
                    </tr>
                  </thead>
                  <tbody className=" text-neutral-600">
                    <tr>
                      <td className="px-4 py-2 border bg-white border-gray-400">
                        Dólar Oficial
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
                        Dólar Blue
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
              <div className="mt-3 text-xl">
                <h2 className="text-white pl-2">Avisos de Actualizaciones</h2>

                {news.map((item, index) => (
                  <NewsCard
                    key={index} // Asegúrate de proporcionar una key única para cada elemento de la lista
                    title={item.title}
                    content={item.content}
                    date={item.date}
                  />
                ))}
              </div>
            </div>
            <div className="relative w-1/2">
              <div className="p-1">
                <Calendar />
              </div>
              <Clock />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
