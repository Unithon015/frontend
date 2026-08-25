import { Outlet } from 'react-router-dom';
import Navbar from '@/shared/components/Navbar';

export default function RootLayout() {
  return (
    <div className="font-pretendard min-h-screen bg-white">
      <Navbar />
      <Outlet />
    </div>
  );
}
