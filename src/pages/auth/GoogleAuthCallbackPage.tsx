import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

export default function GoogleAuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token') ?? params.get('token');

    if (token) {
      localStorage.setItem('token', token);

      const payload = parseJwtPayload(token);
      if (payload) {
        const name = (payload.name ?? payload.nickname ?? payload.email ?? '') as string;
        localStorage.setItem('user', JSON.stringify({ name }));
      }

      const isOnboarded = localStorage.getItem('onboarding_complete');
      navigate(isOnboarded ? '/dashboard' : '/onboarding', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#7047E8]" />
        <p className="text-sm text-gray-500">로그인 처리 중...</p>
      </div>
    </div>
  );
}
