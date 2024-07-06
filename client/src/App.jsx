import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SuperAdmin from "./pages/SuperAdmin";
import PageNotFound from "./pages/PageNotFound";
import StaffDashBoard from "./pages/StaffDashBoard";
import HomePage from "./pages/HomePage/HomePage";
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
        <Route path='*' element={<PageNotFound />} />
        {/* Pages that are only availabe to the users Signed in  */}
        <Route element={<PrivateRoute />} >
          <Route path='/studentdashboard' element={<DashBoard />} />
          <Route path='/profile' element={<ProfilePage/>} />
          <Route path='/leaverequest' element={<LeaveRequestForm />} />
        </Route>

        <Route element={<StaffPrivateRoute />}>
          <Route path='/staffdashboard' element={<StaffDashBoard/>} />
        </Route>
        <Route path='/superadmin' element={<SuperAdmin />} />
      </Routes>

      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />} >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />} >
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes> */}
   
    </BrowserRouter>
  );
}
