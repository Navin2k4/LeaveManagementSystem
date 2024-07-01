import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SuperAdmin from "./pages/SuperAdmin";
import PageNotFound from "./pages/PageNotFound";
import Mentor from "./pages/Mentor";

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/superadmin' element={<SuperAdmin />} />
        <Route path='/mentor' element={<Mentor/>} />
        {/* Page Not Found Component */}
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}
