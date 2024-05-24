import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Calendar from "../components/Calendar";
import Clock from "../components/Clock";
import NewsCard from "../components/NewsCard";
import { API_ENDPOINT } from "../utils/config.js";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [news, setNews] = useState([]);
  const [dollarData, setDollarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getDollarData = async () => {
    try {
      const res = await axios.get("https://api.bluelytics.com.ar/v2/latest");
      setDollarData(res.data);
      setLoading(false);
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
      await axios
        .get(`${API_ENDPOINT}api/news`, config)
        .then((res) => {
          setNews(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          if (error.response) {
            if (error.response.status === 401) {
              console.log("redirecting");
              localStorage.clear();
              window.location.href = "/signin";
            } else if (error.response.status === 404) {
              // Navigate to 404 page
              navigate("/404");
            }
          } else {
            console.error("Network error:", error.message);
            // Handle other types of errors here
          }
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
        <div className="relative bg-neutral-900 w-full h-screen flex flex-col px-5 pt-20 overflow-hidden">
          <div className="w-full flex justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
            <h2>Inicio</h2>
          </div>
          <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden">
            <div className="lg:w-1/2 w-full p-3 flex flex-col h-full overflow-hidden">
              <div className="flex- rounded-lg overflow-hidden">
                <table className="w-full rounded-lg">
                  <thead className="text-neutral-100">
                    <tr>
                      <th className="px-4 py-2 bg-slate-700">Tipo de Dólar</th>
                      <th className="px-4 py-2 bg-slate-700">Compra</th>
                      <th className="px-4 py-2 bg-slate-700">Venta</th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-600">
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
              <div className="mt-3 text-xl flex-1 overflow-auto">
                <h2 className="text-white pl-2 bg-neutral-900">
                  Avisos de Actualizaciones
                </h2>
                <div className="overflow-auto">
                  {news.map((item, index) => (
                    <NewsCard
                      key={index}
                      title={item.title}
                      content={item.content}
                      date={item.date}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full flex-1 py-3 lg:w-1/2">
              <Calendar />
              <div className="flex-1 p-1 overflow-auto">
                <Clock />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
