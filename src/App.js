import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ManagePages from "./pages/ManagePages";
import EditSubPage from "./pages/EditSubPage";
import AdminNavbar from "./components/AdminNavbar";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <Router>
      <AdminNavbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/manage-pages"
          element={
            <PrivateRoute>
              <ManagePages />
            </PrivateRoute>
          }
        />
        <Route
  path="/admin/edit-subpage/:pageId/:subIndex"
  element={
    <PrivateRoute>
      <EditSubPage />
    </PrivateRoute>
  }
/>


      </Routes>
    </Router>
  );
}

export default App;
