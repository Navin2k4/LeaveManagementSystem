import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import SuperAdmin from "./pages/SuperAdmin";
import PageNotFound from "./pages/PageNotFound";
import StaffDashBoard from "./pages/StaffDashBoard";
import HomePage from "./pages/HomePage";
import Navbar from "./components/general/NavBar";
// import SignUp from "./components/auth/SignUp";
// import StaffSignUp from "./components/auth/StaffSignUp";
import PrivateRoute from "./components/auth/PrivateRoute";
import StaffPrivateRoute from "./components/auth/StaffPrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import LeaveRequestForm from "./components/systems/leave/LeaveRequestForm";
import DashBoard from "./pages/DashBoard";
import Hoddashboard from "./pages/HodDashBoard";
import HodPrivateRoute from "./components/auth/HodPrivateRoute";
import WardDetails from "./pages/WardDetails";
import VerifyOtp from "./components/general/VerifyOTP";
import SignIn from "./components/auth/SignIn";
import Footer from "./components/general/Footer";
import MailTiming from "./components/systems/MailTiming";
import About from "./pages/About";

// TODO:OTP IS WORKING BUT WE CAN CANCEL CERIFICATION AND STILL SIGN IT TO ENSURE THAT ONLY AFTER VERIFICATION THE STUDENT ATA IS SAVED IN THE DB COLLECTION  ( Actually no need to worry however going to remove signup idk ) ❌

const AppWrapper = () => {
  const location = useLocation();
  const showFooter = [
    "/",
    "/studentsignup",
    "/staffsignup",
    "/signin",
    "/wardDetails",
    "*",
    "/verify-otp",
  ].includes(location.pathname);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path='/studentsignup' element={<SignUp />} /> */}
        {/* <Route path='/staffsignup' element={<StaffSignUp />} /> */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/wardDetails" element={<WardDetails />} />
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/know-about-us" element={<About />} />
        <Route path="/hidden/changeMailTiming" element={<MailTiming />} />
        <Route element={<PrivateRoute />}>
          <Route path="/studentdashboard" element={<DashBoard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaverequest" element={<LeaveRequestForm />} />
        </Route>
        <Route element={<HodPrivateRoute />}>
          <Route path="/hoddash" element={<Hoddashboard />} />
        </Route>
        <Route element={<StaffPrivateRoute />}>
          <Route path="/staffdashboard" element={<StaffDashBoard />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
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
