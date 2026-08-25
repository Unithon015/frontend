import { Link } from 'react-router-dom';

const features = [
  {
    title: '원본 콘텐츠 분석',
    desc: '영상·텍스트 콘텐츠를 업로드하면 전체 내용을 자동으로 분석해 논란 가능성이 있는 구간을 빠르게 식별합니다.',
  },
  {
    title: '위험 위치 식별',
    desc: '타임라인과 자막을 동기화해 위험 구간의 정확한 위치를 시각적으로 표시합니다. 낮음·보통·높음 단계와 아이콘·텍스트 라벨로 의미를 명확히 전달합니다.',
  },
  {
    title: '판단 근거 제공',
    desc: '단순 판정이 아닌 참고용 신호로서 위험도 산출 근거를 단계적으로 제시해 최종 결정을 지원합니다.',
  },
  {
    title: '수정안 연결',
    desc: '위험 구간별 실행 가능한 수정 제안을 바로 확인하고 편집 작업 공간으로 이어지는 흐름을 제공합니다.',
  },
];

const steps = [
  {
    step: '1단계',
    title: '콘텐츠 업로드 및 분석 요청',
    desc: '영상 또는 텍스트 콘텐츠를 업로드하면 자동 분석이 시작됩니다.',
  },
  {
    step: '2단계',
    title: '위험 구간 및 근거 확인',
    desc: '전체 요약, 위험 위치, 판단 근거를 우선순위에 따라 분리해 확인합니다. 위험도는 참고용 신호이며 최종 판단은 검수자가 직접 수행합니다.',
  },
  {
    step: '3단계',
    title: '수정 및 재분석',
    desc: '제안된 수정안을 바탕으로 편집 후 재분석을 요청해 변경 효과를 검증합니다.',
  },
  {
    step: '4단계',
    title: '검수 승인 및 결정 이력 저장',
    desc: '조직 환경에서는 역할별 편집·검수·최종 승인 권한과 결정 이력을 명확히 기록합니다.',
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      {/* Hero */}
      <section className="mb-20 text-center">
        <p className="mb-3 text-sm text-gray-500">나락각 측정기</p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
          게시 전, 논란 가능성을 미리 확인하세요
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-base text-gray-500">
          콘텐츠 업로드 한 번으로 위험 구간 탐지, 판단 근거 제공, 수정안 연결까지 — 크리에이터와
          검수팀을 위한 신뢰 기반 생산성 도구입니다.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
          >
            로그인하기
          </Link>
          <Link
            to="/dashboard"
            className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            홈 대시보드로 시작하기
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">핵심 기능</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border border-gray-200 p-5">
              <h3 className="mb-2 text-sm font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-gray-900">검수 워크플로우</h2>
        <div className="flex flex-col gap-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="flex items-start gap-5 rounded-lg border border-gray-200 px-6 py-5"
            >
              <span className="shrink-0 text-sm font-semibold text-gray-400">{s.step}</span>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
