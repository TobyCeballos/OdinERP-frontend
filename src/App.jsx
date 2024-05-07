import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./middlewares/ProtectedRoute";
import Login from "./pages/LogIn.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Stock from "./pages/Stock.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import SaleDetail from "./components/SaleDetail.jsx";
import Sell from "./pages/Sell.jsx";
import Sales from "./pages/Sales.jsx";
import AddInventory from "./pages/AddInventory.jsx";
import Customers from "./pages/Customers.jsx";
import Providers from "./pages/Providers.jsx";
import CustomerDetail from "./components/CustomerDetail.jsx";
import ProviderDetail from "./components/ProviderDetail.jsx";
import CRM from "./pages/CRM.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

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
        <Route path="/POS/sell" element={<ProtectedRoute component={Sell} />} />
        <Route path="/POS/sales" element={<ProtectedRoute component={Sales} />} />
        
        <Route path="/POS/customers" element={<ProtectedRoute component={Customers} />} />
        <Route path="/POS/providers" element={<ProtectedRoute component={Providers} />} />
        <Route path="/POS/add-inventory" element={<ProtectedRoute component={AddInventory} />} />

        <Route
          path="/POS/stock/details/:productId"
          element={<ProtectedRoute component={ProductDetail} />}
        ></Route>
        <Route
          path="/POS/customers/details/:customerId"
          element={<ProtectedRoute component={CustomerDetail} />}
        ></Route>
        <Route
          path="/POS/provider/details/:providerId"
          element={<ProtectedRoute component={ProviderDetail} />}
        ></Route>
        <Route
          path="/POS/sales/details/:saleId"
          element={<ProtectedRoute component={SaleDetail} />}
          ></Route>
          <Route
            path="/profile/:userId"
            element={<ProtectedRoute component={ProfilePage} />}
            ></Route>
          <Route
            path="/CRM"
            element={<ProtectedRoute component={CRM} />}
          />
      </Routes>
    </Router>
  );
}

export default App;
