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
import RecentContacts from "./pages/RecentContacts";
import Settings from "./pages/Settings";
import ProtectedRoute from "./Components/ProtectedRoute";
import ScrollToTop from "./Components/ScrollToTop";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  const [openAddContactModal, setOpenAddContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  // Bumped whenever a contact is created/updated so pages holding contact
  // data (Home dashboard, Contacts, Favorites, Recent) re-fetch and
  // re-render without a full page reload.
  const [contactRefreshKey, setContactRefreshKey] = useState(0);

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setOpenAddContactModal(true);
  };

  const handleContactSaved = () => {
    setContactRefreshKey((key) => key + 1);
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Home
                      openAddContactModal={openAddContactModal}
                      setOpenAddContactModal={setOpenAddContactModal}
                      onEditContact={handleEditContact}
                      refreshKey={contactRefreshKey}
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
                      onEditContact={handleEditContact}
                      refreshKey={contactRefreshKey}
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
                      onEditContact={handleEditContact}
                      refreshKey={contactRefreshKey}
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
                      onEditContact={handleEditContact}
                      refreshKey={contactRefreshKey}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact-profile/:id"
                element={
                  <ProtectedRoute>
                    <ContactProfile
                      openAddContactModal={openAddContactModal}
                      setOpenAddContactModal={setOpenAddContactModal}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/help"
                element={
                  <Help
                    openAddContactModal={openAddContactModal}
                    setOpenAddContactModal={setOpenAddContactModal}
                  />
                }
              />
              <Route
                path="/recent"
                element={
                  <ProtectedRoute>
                    <RecentContacts
                      openAddContactModal={openAddContactModal}
                      setOpenAddContactModal={setOpenAddContactModal}
                      onEditContact={handleEditContact}
                      refreshKey={contactRefreshKey}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings
                      openAddContactModal={openAddContactModal}
                      setOpenAddContactModal={setOpenAddContactModal}
                    />
                  </ProtectedRoute>
                }
              />
              {/* Catch-all: any unknown URL shows the themed 404 page */}
              <Route path="*" element={<NotFound />} />
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
              editingContact={editingContact}
              setEditingContact={setEditingContact}
              onContactSaved={handleContactSaved}
            />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;