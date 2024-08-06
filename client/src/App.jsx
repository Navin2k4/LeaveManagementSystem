import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import SuperAdmin from "./pages/SuperAdmin";
import PageNotFound from "./pages/PageNotFound";
import StaffDashBoard from "./pages/StaffDashBoard";
import HomePage from "./pages/HomePage";
import Navbar from "./components/NavBar";
import SignUp from "./components/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import StaffPrivateRoute from "./components/StaffPrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import LeaveRequestForm from "./components/LeaveRequestForm";
import DashBoard from "./pages/DashBoard";
import Hoddashboard from "./pages/HodDashBoard";
import HodPrivateRoute from "./components/HodPrivateRoute";
import WardDetails from "./pages/WardDetails";
import VerifyOtp from "./components/VerifyOTP";
import SignIn from "./components/SignIn";
import Footer from "./components/Footer";


const AppWrapper = () => {
  const location = useLocation();
  const showFooter = [
    '/',
    '/studentsignup',
    '/signin',
    '/wardDetails',
    '*',
    '/verify-otp'
  ].includes(location.pathname);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/studentsignup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path="/wardDetails" element={<WardDetails />} />
        <Route element={<PrivateRoute />}>
          <Route path='/studentdashboard' element={<DashBoard />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/leaverequest' element={<LeaveRequestForm />} />
        </Route>
        <Route element={<HodPrivateRoute />}>
          <Route path='/hoddash' element={<Hoddashboard />} />
        </Route>
        <Route element={<StaffPrivateRoute />}>
          <Route path='/staffdashboard' element={<StaffDashBoard />} />
        </Route>
        <Route path='/superadmin' element={<SuperAdmin />} />
        <Route path='*' element={<PageNotFound />} />
        <Route path='/verify-otp' element={<VerifyOtp />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);

export default App;