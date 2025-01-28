import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./styles/global.scss";
import Dashboard from "./admin/Dashboard/Dashboard";
import ArchivedVersions from "./admin/ArchivedVersions/ArchivedVersion";
import Footer from "./components/footer/Footer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { Toaster } from "react-hot-toast";
import ArchiveEditor from "./admin/ArchiveEditor/ArchiveEditor";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/admin-dashboard" element={<Dashboard />} />
        <Route path="/admin/archived-versions" element={<ArchivedVersions />} />
        <Route path="/admin/archive-editor/:archiveId" element={<ArchiveEditor />} />
      </Routes>
      <Footer />
      <Toaster />
    </BrowserRouter>
  );
};

export default App;


////id in flipbook store////////