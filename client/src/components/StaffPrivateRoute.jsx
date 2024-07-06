import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom';

function StaffPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.userType === "Staff" ? <Outlet /> : <Navigate to='/studentsignin' />;
}

export default StaffPrivateRoute