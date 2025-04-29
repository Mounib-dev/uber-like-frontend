import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
// import PrivateRoute from "./components/auth/PrivateRoute";
import Home from "./components/Home";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PlaceOrderForm from "./components/orders/PlaceOrder";
import Menu from "./components/restaurants/Menu";
import RestaurantList from "./components/restaurants/RestaurantsList";
import Panier from "./components/orders/Panier";

import PrivateRoute from "./components/auth/Private";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <AuthProvider>
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* <Route element={<PrivateRoute />}></Route> */}
              <Route element={<PrivateRoute />}>
                <Route path="/order" element={<PlaceOrderForm />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/restaurants" element={<RestaurantList />} />
                <Route path="/panier" element={<Panier />} />
              </Route>
            </Routes>
          </main>
        </AuthProvider>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
