import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import Login from "./components/auth/Login";
// import PrivateRoute from "./components/auth/PrivateRoute";
import Home from "./components/Home";
import Navbar from "./components/layout/Navbar";  
import Footer from "./components/layout/Footer";  

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Navbar /> 

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route element={<PrivateRoute />}></Route> */}
          </Routes>
        </main>

        <Footer /> 
      </div>
    </Router>
  );
}

export default App;
