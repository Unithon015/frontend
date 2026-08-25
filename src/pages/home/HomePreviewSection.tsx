import { motion, useScroll, useTransform } from 'framer-motion';
import { Plus, Upload } from 'lucide-react';
import { useRef } from 'react';

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const sensitiveItems = [
  {
    num: 1,
    tag: '혐오 표현',
    tagColor: 'bg-red-100 text-red-600',
    numBg: 'bg-red-500 text-white',
    title: '특정 집단 비하 표현이 포함되어 있어요',
    desc: '플랫폼 정책에 위배될 가능성이 있으며 즉각적인 검토가 필요합니다.',
  },
  {
    num: 2,
    tag: '정치적 발언',
    tagColor: 'bg-amber-100 text-amber-600',
    numBg: 'bg-amber-400 text-white',
    title: '특정 정당에 유리한 내용이 포함되어 있어요',
    desc: '선거 기간 게시 시 공직선거법 위반 소지가 있습니다.',
  },
  {
    num: 3,
    tag: '비속어',
    tagColor: 'bg-yellow-100 text-yellow-700',
    numBg: 'bg-yellow-400 text-white',
    title: '경미한 비속어가 포함되어 있어요',
    desc: '전체 이용가 채널의 경우 연령 제한 조치가 필요할 수 있습니다.',
  },
];

const FINAL_DASHOFFSET = CIRCUMFERENCE * (1 - 0.73);

function UploadCard() {
  return (
    <div className="w-[360px] shrink-0">
      <p className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
        업로드한 콘텐츠
      </p>
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            <Upload className="size-4 text-violet-500" />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">검수할 콘텐츠를 올려주세요</p>
            <p className="text-xs text-gray-400">파일을 끌어다 놓거나 직접 선택할 수 있어요</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="flex size-8 items-center justify-center rounded-full text-gray-400">
              <Plus className="size-4" />
            </span>
            <span className="rounded-lg bg-white/80 px-2 py-1 text-xs text-gray-400">MP4</span>
            <span className="rounded-lg bg-white/80 px-2 py-1 text-xs text-gray-400">
              JPG · PNG
            </span>
          </div>
          <span className="rounded-xl bg-[#7047E8] px-4 py-2 text-xs font-semibold text-white">
            분석 시작하기
          </span>
        </div>
      </div>
    </div>
  );
}

function ResultPanel() {
  return (
    <div className="flex w-[100px] shrink-0 flex-col gap-3">
      <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative shrink-0">
          <svg width="80" height="80" className="-rotate-90">
            <circle cx="40" cy="40" r="30" fill="none" stroke="#f3f4f6" strokeWidth="8" />
            <circle
              cx="40"
              cy="40"
              r="30"
              fill="none"
              stroke="#7047E8"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 30}
              strokeDashoffset={2 * Math.PI * 30 * (1 - 0.73)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-bold text-gray-900">73</span>
            <span className="text-[10px] text-gray-400">안전도</span>
          </div>
        </div>
        <div>
          <p className="mb-0.5 text-xs font-bold text-gray-900">전체 콘텐츠 민감도</p>
          <p className="text-[11px] leading-relaxed text-gray-500">
            AI가 분석해 종합 안전도를 산출합니다.
          </p>
        </div>
      </div>
      {sensitiveItems.map((item) => (
        <div
          key={item.num}
          className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
        >
          <div
            className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${item.numBg}`}
          >
            {item.num}
          </div>
          <div>
            <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${item.tagColor}`}>
                {item.tag}
              </span>
              <p className="text-[11px] font-semibold text-gray-900">{item.title}</p>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-400">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePreviewSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const leftX = useTransform(scrollYProgress, [0, 0.2], [40, 0]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const ringY = useTransform(scrollYProgress, [0.15, 0.32], [70, 0]);
  const ringOpacity = useTransform(scrollYProgress, [0.15, 0.32], [0, 1]);
  const ringDashoffset = useTransform(
    scrollYProgress,
    [0.2, 0.56],
    [CIRCUMFERENCE, FINAL_DASHOFFSET],
  );
  const ringCount = useTransform(scrollYProgress, [0.2, 0.56], [0, 73]);
  const ringRounded = useTransform(ringCount, Math.round);

  const item1Y = useTransform(scrollYProgress, [0.38, 0.53], [70, 0]);
  const item1Opacity = useTransform(scrollYProgress, [0.38, 0.53], [0, 1]);
  const item2Y = useTransform(scrollYProgress, [0.55, 0.7], [70, 0]);
  const item2Opacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const item3Y = useTransform(scrollYProgress, [0.72, 0.87], [70, 0]);
  const item3Opacity = useTransform(scrollYProgress, [0.72, 0.87], [0, 1]);

  const itemMotion = [
    { y: item1Y, opacity: item1Opacity },
    { y: item2Y, opacity: item2Opacity },
    { y: item3Y, opacity: item3Opacity },
  ];

  const innerClass = 'mx-auto w-fit flex h-full items-center justify-center gap-8';

  return (
    <div>
      {/* 스크롤 애니메이션 구간 */}
      <div ref={containerRef} style={{ height: '380vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden bg-white">
          <div className={innerClass}>
            {/* 왼쪽: 업로드 카드 */}
            <motion.div style={{ x: leftX, opacity: leftOpacity }} className="w-[360px] shrink-0">
              <p className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                업로드한 콘텐츠
              </p>
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                    <Upload className="size-4 text-violet-500" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      검수할 콘텐츠를 올려주세요
                    </p>
                    <p className="text-xs text-gray-400">
                      파일을 끌어다 놓거나 직접 선택할 수 있어요
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="flex size-8 items-center justify-center rounded-full text-gray-400">
                      <Plus className="size-4" />
                    </span>
                    <span className="rounded-lg bg-white/80 px-2 py-1 text-xs text-gray-400">
                      MP4
                    </span>
                    <span className="rounded-lg bg-white/80 px-2 py-1 text-xs text-gray-400">
                      JPG · PNG
                    </span>
                  </div>
                  <span className="rounded-xl bg-[#7047E8] px-4 py-2 text-xs font-semibold text-white">
                    분석 시작하기
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 오른쪽: 결과 패널 */}
            <div className="flex w-[240px] shrink-0 flex-col gap-3">
              <motion.div
                style={{ y: ringY, opacity: ringOpacity }}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="relative shrink-0">
                  <svg width="80" height="80" className="-rotate-90">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="30"
                      fill="none"
                      stroke="#7047E8"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 30}
                      style={{ strokeDashoffset: ringDashoffset }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex items-baseline gap-0.5">
                      <motion.span className="text-base font-bold text-gray-900">
                        {ringRounded}
                      </motion.span>
                      <span className="text-[10px] text-gray-400">점</span>
                    </div>
                    <span className="text-[10px] text-gray-400">안전도</span>
                  </div>
                </div>
                <div>
                  <p className="mb-0.5 text-xs font-bold text-gray-900">전체 콘텐츠 민감도</p>
                  <p className="text-[11px] leading-relaxed text-gray-500">
                    AI가 분석해 종합 안전도를 산출합니다.
                  </p>
                </div>
              </motion.div>

              {sensitiveItems.map((item, idx) => (
                <motion.div
                  key={item.num}
                  style={{ y: itemMotion[idx].y, opacity: itemMotion[idx].opacity }}
                  className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
                >
                  <div
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${item.numBg}`}
                  >
                    {item.num}
                  </div>
                  <div>
                    <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${item.tagColor}`}
                      >
                        {item.tag}
                      </span>
                      <p className="text-[11px] font-semibold text-gray-900">{item.title}</p>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* sticky 끝난 후 동일한 최종 상태를 static으로 유지 */}
      <div className="bg-white">
        <div className={innerClass.replace('h-full', 'py-24')}>
          <UploadCard />
          <ResultPanel />
        </div>
      </div>
    </div>
  );
}
