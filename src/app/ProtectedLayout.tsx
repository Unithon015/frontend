import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '@/shared/components/Navbar';

export default function ProtectedLayout() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar isLoggedIn />
      <Outlet />
    </div>
  );
}
