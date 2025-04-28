import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import Login from "./components/auth/Login";
// import PrivateRoute from "./components/auth/PrivateRoute";
import Home from "./components/Home";

function App() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Router>
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/login" element={<Login />} /> */}
              {/* <Route element={<PrivateRoute />}></Route> */}
            </Routes>
          </main>
        </Router>
      </div>
    </>
  );
}

export default App;
