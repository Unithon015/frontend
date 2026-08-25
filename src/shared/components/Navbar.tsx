import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
        <Link to="/" className="shrink-0 text-base font-semibold text-gray-900">
          나락각 측정기
        </Link>

        <div className="flex flex-1 items-center rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5">
          <Search className="mr-2 size-4 shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="검색"
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>

        <nav className="flex shrink-0 items-center gap-5 text-sm text-gray-600">
          <Link to="/help" className="hover:text-gray-900">
            도움말
          </Link>
          <Link to="/pro" className="hover:text-gray-900">
            프로
          </Link>
        </nav>
      </div>
    </header>
  );
}
