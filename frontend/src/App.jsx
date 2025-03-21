import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./styles/global.scss";
import Dashboard from "./admin/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { Toaster } from "react-hot-toast";
import PublishedEditor from './admin/PublishedEditor/PublishedEditor';
import ScheduledFlipbooks from './admin/ScheduledFlipbooks/ScheduledFlipbooks';
import ScrollToTop from "./components/ScrollToTop";
import { useUserStore } from "./stores/useUserStore";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { checkAuth } = useUserStore();
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/admin/admin-dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/published-editor/:flipbookId" 
          element={
            <ProtectedRoute>
              <PublishedEditor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/scheduled-flipbooks" 
          element={
            <ProtectedRoute>
              <ScheduledFlipbooks />
            </ProtectedRoute>
          } 
        />
      </Routes>
      {/* <Footer /> */}
      <Toaster />
    </BrowserRouter>
  );
};

export default App;

////id in flipbook store////////