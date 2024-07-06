import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom';

function StaffPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser  ? <Outlet /> : <Navigate to='/studentsignin' />;
}

export default StaffPrivateRoute