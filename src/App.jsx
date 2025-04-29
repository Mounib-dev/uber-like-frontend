import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/Home";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PlaceOrderForm from "./components/orders/PlaceOrder";

import RestaurantList from "./components/restaurants/RestaurantsList";
import RestaurantMenu from "./components/restaurants/RestaurantMenu";
import Panier from "./components/orders/Panier";

import PrivateRoute from "./components/auth/Private";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [panier, setPanier] = useState([]); 

  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <AuthProvider>
          <Navbar panier={panier} /> 

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<PrivateRoute />}>
                <Route path="/order" element={<PlaceOrderForm />} />
                <Route path="/restaurant/:id" element={<RestaurantMenu setPanier={setPanier} />} />
                <Route path="/panier" element={<Panier panier={panier} />} />
                <Route path="/restaurants" element={<RestaurantList />} />
              </Route>
            </Routes>
          </main>

          <Footer />
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
