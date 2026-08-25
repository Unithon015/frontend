import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { Plus, Upload } from 'lucide-react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FeatherStreaks from '@/shared/components/FeatherStreaks';
import GrainOverlay from '@/shared/components/GrainOverlay';
import ScanLine from '@/shared/components/ScanLine';

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const tags = ['정치', '인종', '혐오 표현', '비속어', '문제적 밈'];

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

interface Props {
  isLoggedIn: boolean;
}

export default function HeroScrollSection({ isLoggedIn }: Props) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── 왼쪽 패널: 처음엔 뷰포트 중앙(25vw - 65px), 스크롤하면 왼쪽 컬럼 위치로 이동
  const leftXFrac = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const leftX = useMotionTemplate`calc((25vw - 65px) * ${leftXFrac})`;

  // ── 오른쪽: 원 그래프 (15→32%)
  const ringY = useTransform(scrollYProgress, [0.15, 0.32], [70, 0]);
  const ringOpacity = useTransform(scrollYProgress, [0.15, 0.32], [0, 1]);
  const ringDashoffset = useTransform(
    scrollYProgress,
    [0.2, 0.56],
    [CIRCUMFERENCE, CIRCUMFERENCE * (1 - 0.73)],
  );
  const ringCount = useTransform(scrollYProgress, [0.2, 0.56], [0, 73]);
  const ringRounded = useTransform(ringCount, Math.round);

  // ── 오른쪽: 민감 요소 아이템 (38→87%)
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

  return (
    // 스크롤 공간 확보용 외부 컨테이너
    <div ref={containerRef} style={{ height: '460vh' }}>
      {/* viewport에 고정되는 sticky 컨테이너 */}
      <div className="hero-gradient sticky top-0 h-screen overflow-hidden">
        {/* 배경 레이어 */}
        <GrainOverlay />
        <FeatherStreaks />
        <ScanLine variant="full" />

        {/* 콘텐츠 레이어 */}
        <div className="relative flex h-full items-center gap-5 px-35" style={{ zIndex: 1 }}>

          {/* ── 왼쪽: 히어로 콘텐츠 ── */}
          <motion.div style={{ x: leftX }} className="flex min-w-0 flex-1 flex-col">
            {/* 뱃지 */}
            <p className="mb-5 flex items-center gap-2 text-sm text-[#633DD4]">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#633DD4] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#633DD4]" />
              </span>
              AI 모니터링 서비스
            </p>

            {/* 헤드라인 */}
            <h1 className="mb-1 text-5xl font-bold leading-tight tracking-tight text-gray-900">
              콘텐츠만 업로드하세요.
            </h1>
            <h1 className="mb-6 bg-gradient-to-r from-[#E84A73] via-[#7A45E3] to-[#4069F2] bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent">
              모니터링은 저희가 할게요.
            </h1>

            {/* 서브타이틀 */}
            <p className="mb-4 max-w-sm text-sm leading-relaxed text-gray-500">
              영상, 이미지, 글을 한 번에 올리면 사람들의 반응을 모니터링해
              민감한 요소들을 정리합니다.
            </p>

            {/* 태그 칩 */}
            <div className="mb-6 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-violet-400 px-3 py-1 text-xs font-medium text-violet-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 업로드 카드 */}
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-white/70 p-3 backdrop-blur-sm">
              <ScanLine variant="card" />
              <div className="dashed-border-xl mb-3 flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                  <Upload className="h-4 w-4 text-violet-500" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">검수할 콘텐츠를 올려주세요</p>
                  <p className="text-xs text-gray-400">파일을 끌어다 놓거나 직접 선택할 수 있어요</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100">
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="rounded-lg bg-white/70 px-2 py-1 text-xs text-gray-500">MP4</span>
                  <span className="rounded-lg bg-white/70 px-2 py-1 text-xs text-gray-500">JPG · PNG</span>
                </div>
                <button
                  onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}
                  className="rounded-xl bg-[#7047E8] px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700"
                >
                  분석 시작하기
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              사진 평균 검수 시간 <span className="font-semibold text-[#7047E8]">3초</span>
            </p>
          </motion.div>

          {/* ── 오른쪽: 결과 패널 ── */}
          <div className="flex flex-1 flex-col gap-3">

            {/* 원 그래프 */}
            <motion.div
              style={{ y: ringY, opacity: ringOpacity }}
              className="flex items-center gap-5 rounded-2xl border border-gray-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm"
            >
              <div className="relative shrink-0">
                <svg width="110" height="110" className="-rotate-90">
                  <circle cx="55" cy="55" r={RADIUS} fill="none" stroke="#f3f4f6" strokeWidth="10" />
                  <motion.circle
                    cx="55"
                    cy="55"
                    r={RADIUS}
                    fill="none"
                    stroke="#7047E8"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    style={{ strokeDashoffset: ringDashoffset }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-0.5">
                    <motion.span className="text-xl font-bold text-gray-900">{ringRounded}</motion.span>
                    <span className="text-xs text-gray-400">점</span>
                  </div>
                  <span className="text-xs text-gray-400">안전도</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-bold text-gray-900">전체 콘텐츠 민감도</p>
                <p className="text-xs leading-relaxed text-gray-500">
                  AI가 콘텐츠 전체를 분석해
                  <br />
                  종합 안전도 점수를 산출합니다.
                  <br />
                  최종 판단은 사람이 직접 내립니다.
                </p>
              </div>
            </motion.div>

            {/* 민감 요소 아이템 */}
            {sensitiveItems.map((item, idx) => (
              <motion.div
                key={item.num}
                style={{ y: itemMotion[idx].y, opacity: itemMotion[idx].opacity }}
                className="flex items-start gap-3 rounded-2xl border border-gray-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${item.numBg}`}
                >
                  {item.num}
                </div>
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <p className="text-xs font-semibold text-gray-900">{item.title}</p>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
