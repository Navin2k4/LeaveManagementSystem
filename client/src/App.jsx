import { BrowserRouter, Route, Routes } from "react-router-dom";
import SuperAdmin from "./pages/SuperAdmin";
import PageNotFound from "./pages/PageNotFound";
import StaffDashBoard from "./pages/StaffDashBoard";
import HomePage from "./pages/HomePage";
import Navbar from "./components/NavBar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import StaffSignUp from "./components/StaffSignUp"
import PrivateRoute from "./components/PrivateRoute";
import StaffPrivateRoute from "./components/StaffPrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import LeaveRequestForm from "./components/LeaveRequestForm";
import DashBoard from "./pages/DashBoard";
import StaffSignIn from "./components/StaffSignIn";
import Hoddashboard from "./pages/HodDashBoard";
import HodPrivateRoute from "./components/HodPrivateRoute";
import WardDetails from "./pages/WardDetails";
import VerifyOtp from "./components/VerifyOTP";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        {/* Pages that are Generally Availabe to Everyone */}
        <Route path='/' element={<HomePage />} />
        <Route path='/studentsignin' element={<SignIn />} />
        <Route path='/studentsignup' element={<SignUp />} />
        <Route path='/staffsignin' element={<StaffSignIn/>} />
        <Route path='/staffsignup' element={<StaffSignUp/>} />
        <Route path="/wardDetails" element={<WardDetails />} />
        {/* Pages that are only availabe to the users Signed in  */}
        <Route element={<PrivateRoute />} >
          <Route path='/studentdashboard' element={<DashBoard />} />
          <Route path='/profile' element={<ProfilePage/>} />
          <Route path='/leaverequest' element={<LeaveRequestForm />} />
          </Route>

        <Route element={<HodPrivateRoute />}>
          <Route path='/hoddash' element={<Hoddashboard/>}/>
        </Route>
        <Route element={<StaffPrivateRoute />}>
          <Route path='/staffdashboard' element={<StaffDashBoard/>} />
        </Route>
        <Route path='/superadmin' element={<SuperAdmin />} />

        {/* Catch All other undefined Routes*/}
        <Route path='*' element={<PageNotFound />} />
        <Route path='/verify-otp' element={<VerifyOtp />}></Route>
      </Routes>

    </BrowserRouter>
  );
}
