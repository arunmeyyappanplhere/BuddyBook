import React from "react";
import ContactCard from "./Components/ContactCard";
import ContactProfile from "./pages/ContactProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./Components/Dashboard";
import Home from "./pages/Home";
import SearchContactCard from "./Components/SearchContactCard";
import StatsCard from "./Components/StatsCard";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router";
const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/contact-profile/:id" element={<ContactProfile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
