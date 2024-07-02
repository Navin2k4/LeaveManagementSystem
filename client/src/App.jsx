import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import SuperAdmin from "./pages/SuperAdmin";
import PageNotFound from "./pages/PageNotFound";
import Mentor from "./pages/Mentor";
import DashBoard from "./pages/StudentDashBoard/DashBoard";
import HomePage from "./pages/HomePage/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/superadmin' element={<SuperAdmin />} />
        <Route path='/mentor' element={<Mentor/>} />
        <Route path='/studentdashboard' element={<DashBoard />} />
        {/* Page Not Found Component */}
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
