import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINT } from "../utils/config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);

  // Función para mostrar el mensaje de notificación durante 5 segundos
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };
      const toggleUserState = async() => {
        const token=localStorage.getItem("token")
        const userId = localStorage.getItem("userId")
      };
  const handleSubmit = async (e) => {
    e.preventDefault();
    showNotification("");
    try {
      const response = await axios
        .post(`${API_ENDPOINT}api/auth/signin`, {
          email,
          password,
        })
        .then(async(response) => {
          toggleUserState();
          const userId = response.data.userId;
          const token = response.data.token;
          const company = response.data.company;
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("company", company);
        // Llamar al endpoint toggleUserState
        await axios.get(`${API_ENDPOINT}api/users/state-handler/${userId}`, {
          headers: {
            "x-access-token": token,
          },
        });
        });

      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-neutral-900 w-full h-screen flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white  max-w-[450px] py-4 rounded shadow-xl shadow-black"
        >
          <h2 className="text-3xl border-l-violet-800 text-violet-900 py-2 my-3 border-l-4 font-semibold w-full px-10">
            LOGIN
          </h2>
          <div className="flex flex-col py-3 px-10">
            <input
              type="text"
              className="border-b-2 outline-none focus-visible:borderb-b-violet-500 borderb-b-neutral-500 rounded-md py-2 px-3"
              placeholder="E-mail"
              name="email"
              value={email ?? ""}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="flex flex-col py-3 px-10">
            <input
              type="password"
              className="border-b-2 outline-none border-b-neutral-500 rounded-md py-2 px-3"
              placeholder="Password"
              name="password"
              value={password ?? ""}
              onChange={({ target }) => setPassword(target.value)}
              required
            />
          </div>
          <div className="flex flex-col py-5 px-10">
            <input
              type="submit"
              className="border-2 transition-all duration-300 ease-in-out hover:shadow-md text-violet-800 font-semibold text-xl border-violet-800 rounded-md py-2 px-3 hover:bg-violet-500 hover:text-white "
              value="Let's go!"
            />
          </div>
          <div className="text-center pb-3">
            {" "}
            <span className="text-center w-full px-10">
              Forgot your password or email?{" "}
              <a href="" className="text-violet-500 font-bold">
                Contact us
              </a>
              .
            </span>
          </div>
        </form>
        {notification && (
          <div className="bg-violet-500 text-white py-2 px-4 rounded-full absolute bottom-4 right-1/2 translate-x-1/2">
            {notification}
          </div>
        )}
      </div>
    </>
  );
};
export default Login;
