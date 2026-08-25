import { Outlet } from 'react-router-dom';
import Navbar from '@/shared/components/Navbar';

export default function RootLayout() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="font-pretendard flex min-h-screen flex-col bg-white">
      <Navbar isLoggedIn={isLoggedIn} />
      <Outlet />
    </div>
  );
}
