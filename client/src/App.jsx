import { useState } from "react";
import ContactProfile from "./pages/ContactProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router";
import ContactModal from "./Components/ContactModal";
import Contacts from "./pages/Contacts";
import Favorites from "./pages/Favorites";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  const [openAddContactModal, setOpenAddContactModal] = useState(false);

  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/help" element={<Help />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Home
                      openAddContactModal={openAddContactModal}
                      setOpenAddContactModal={setOpenAddContactModal}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home
                      openAddContactModal={openAddContactModal}
                      setOpenAddContactModal={setOpenAddContactModal}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contacts"
                element={
                  <ProtectedRoute>
                    <Contacts
                      openAddContactModal={openAddContactModal}
                      setOpenAddContactModal={setOpenAddContactModal}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites
                      openAddContactModal={openAddContactModal}
                      setOpenAddContactModal={setOpenAddContactModal}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact-profile/:id"
                element={
                  <ProtectedRoute>
                    <ContactProfile />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              pauseOnHover
              theme="light"
            />

            <ContactModal
              openAddContactModal={openAddContactModal}
              setOpenAddContactModal={setOpenAddContactModal}
            />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;