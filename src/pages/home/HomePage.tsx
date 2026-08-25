import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroScrollSection from './HeroScrollSection';

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

const features = [
  {
    title: '여러 형식을 한 번에',
    desc: '서로 다른 콘텐츠의 맥락까지 함께 확인합니다.',
  },
  {
    title: '민감한 요소를 한눈에',
    desc: '확인이 필요한 구간과 이유를 우선순위로 정리합니다.',
  },
  {
    title: '최종 판단은 사람에게',
    desc: 'AI가 게시 가능 여부나 법적 판단을 단정하지 않습니다.',
  },
];

const steps = [
  { num: 1, label: '콘텐츠 업로드' },
  { num: 2, label: 'AI 모니터링' },
  { num: 3, label: '근거 기반 검수' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) return;

    localStorage.setItem('token', token);

    const payload = parseJwtPayload(token);
    if (payload) {
      const email = (payload.email ?? '') as string;
      localStorage.setItem('user', JSON.stringify({ email }));
    }

    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return (
    <main>
      <HeroScrollSection isLoggedIn={isLoggedIn} />

      {/* 스텝 */}
      <section className="border-b border-gray-100 bg-white py-7">
        <div className="mx-auto flex max-w-xl items-center justify-center gap-3">
          {steps.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-sm">
                <span className="flex size-5 items-center justify-center rounded-xl bg-violet-200 text-xs font-semibold text-[#7047E8]">
                  {step.num}
                </span>
                <span className="text-gray-700">{step.label}</span>
              </div>
              {idx < steps.length - 1 && <span className="text-gray-300">→</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 특징 */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 sm:grid-cols-3">
          {features.map((f, idx) => (
            <div
              key={f.title}
              className={`px-12 py-14 ${idx < features.length - 1 ? 'border-b border-gray-100 sm:border-r sm:border-b-0' : ''}`}
            >
              <h3 className="mb-3 text-lg font-bold text-gray-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
