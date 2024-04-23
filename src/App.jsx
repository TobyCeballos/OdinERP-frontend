import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./middlewares/ProtectedRoute";
import Login from "./pages/LogIn.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Stock from "./pages/Stock.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import Sell from "./pages/Sell.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route exact path="/" element={<ProtectedRoute component={Home} />} />
        <Route
          path="/POS/stock"
          element={<ProtectedRoute component={Stock} />}
        />
        <Route
          path="/POS/sell"
          element={<ProtectedRoute component={Sell} />}
        />

        <Route
          path="/POS/stock/details/:productId"
          element={<ProtectedRoute component={ProductDetail} />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
