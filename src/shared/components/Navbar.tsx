import { Link } from 'react-router-dom';
import bbikFullLogo from '@/shared/assets/bbik-full-logo.svg';

interface NavbarProps {
  isLoggedIn?: boolean;
}

export default function Navbar({ isLoggedIn = false }: NavbarProps) {
  const user = JSON.parse(localStorage.getItem('user') ?? '{}') as { email?: string };
  const initial = (user.email?.[0] ?? '').toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex h-18 max-w-screen-2xl items-center justify-between px-10">
        <Link to="/">
          <img src={bbikFullLogo} alt="삐빅" className="h-9" />
        </Link>
        {isLoggedIn ? (
          <div className="flex items-center gap-7">
            <Link to="/dashboard" className="text-sm text-violet-600 hover:text-violet-800">
              작업 목록
            </Link>
            <Link to="/settings" className="text-sm text-gray-500 hover:text-gray-900">
              설정
            </Link>
            <div className="flex size-9 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
              {initial}
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="rounded-xl border border-gray-300 px-6 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
