import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    id: 0,
    label: '주로 어떤 콘텐츠를 올리나요?',
    max: 2,
    chips: [
      '뷰티·패션',
      '건강·운동',
      '다이어트',
      '음식',
      '육아',
      '게임',
      '금융·투자',
      '일상',
      '엔터·팬덤',
      '교육·정보',
      '여행',
    ],
  },
  {
    id: 1,
    label: '어떤 분들이 많이 시청하나요?',
    max: 2,
    chips: [
      '10대',
      '20~30대',
      '40대 이상',
      '남성',
      '여성',
      '운동·다이어트 관심층',
      '부모·육아층',
      '게임 팬덤',
      '아이돌 관심층',
      '투자 관심층',
      '일반 대중',
    ],
  },
  {
    id: 2,
    label: '계정은 어떤 목적으로 운영하나요?',
    max: 2,
    chips: ['정보 제공', '제품·서비스 홍보', '후기·리뷰', '팬 커뮤니티', '일상 공유', '유머·풍자'],
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[][]>([[], [], []]);

  const answeredCount = selected.filter((s) => s.length > 0).length;

  function toggleChip(qIdx: number, chip: string) {
    setSelected((prev) => {
      const next = prev.map((s) => [...s]);
      const cur = next[qIdx];
      if (cur.includes(chip)) {
        next[qIdx] = cur.filter((c) => c !== chip);
      } else if (cur.length < questions[qIdx].max) {
        next[qIdx] = [...cur, chip];
      }
      return next;
    });
  }

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="hidden w-1/2 flex-col justify-center bg-[#f0eeff] p-16 lg:flex">
        <div>
          <p className="mb-5 flex items-center gap-2 text-sm font-medium text-[#633DD4]">
            <span className="relative flex size-2 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#633DD4] opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#633DD4]" />
            </span>
            처음 한 번만 설정해요
          </p>
          <h1 className="mb-5 text-[38px] leading-tight font-bold tracking-tight text-gray-900">
            내 컨텐츠를 보는 사람을
            <br />
            더 잘 이해할수록
            <br />
            검수도 정확해져요.
          </h1>
          <p className="max-w-sm text-[14px] leading-relaxed text-gray-500">
            계정의 콘텐츠와 시청자의 맥락을 알려주시면,
            <br />
            민감하게 확인할 부분을 더 정확히 찾아드려요.
          </p>
        </div>

        {/* Decorative Cards */}
        <div className="relative h-80 items-center">
          <img
            src="/logo-picture.svg"
            alt=""
            className="h-85 w-full object-contain object-left-bottom"
          />

          {/* Result card */}
          <div className="absolute right-8 bottom-0 left-4 mx-25 rounded-2xl bg-white p-5 shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[15px] font-bold text-gray-900">검수 결과가 정리됐어요</span>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                확인 필요 3건
              </span>
            </div>
            <div className="space-y-2">
              <div className="bar-expand-1 h-3 w-full rounded-full bg-gray-100" />
              <div className="bar-expand-2 h-3 w-4/5 rounded-full bg-gray-100" />
              <div className="bar-expand-3 h-3 w-3/5 rounded-full bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col bg-white lg:w-1/2">
        {/* Scrollable area */}
        <div className="flex flex-1 flex-col overflow-y-auto px-8 pt-10">
          <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <h2 className="mb-1 text-[22px] font-bold text-gray-900">내 계정의 주 시청자 설정</h2>
            <p className="mb-5 text-sm text-gray-400">
              3가지만 알려주세요. 이후 검수에 자동으로 반영돼요.
            </p>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{answeredCount}/3 설정</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#7047E8] transition-all duration-300"
                  style={{ width: `${(answeredCount / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-7 pb-6">
              {questions.map((q, qIdx) => (
                <div key={q.id}>
                  <p className="mb-2 text-sm font-semibold text-gray-800">
                    {qIdx + 1}. {q.label}
                  </p>
                  <p className="mb-3 text-xs text-gray-400">최대 {q.max}개 선택</p>
                  <div className="flex flex-wrap gap-2">
                    {q.chips.map((chip) => {
                      const isSelected = selected[qIdx].includes(chip);
                      const isDisabled = !isSelected && selected[qIdx].length >= q.max;
                      return (
                        <button
                          key={chip}
                          onClick={() => toggleChip(qIdx, chip)}
                          disabled={isDisabled}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-[#7047E8] bg-[#7047E8] text-white'
                              : isDisabled
                                ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-[#7047E8] hover:text-[#7047E8]'
                          }`}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed bottom button */}
        <div className="px-8 pt-4 pb-8">
          <div className="mx-auto w-full max-w-sm">
            <button
              onClick={() => {
                localStorage.setItem('onboarding_complete', 'true');
                navigate('/dashboard');
              }}
              className="w-full rounded-xl bg-[#7047E8] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
              설정 완료하고 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
