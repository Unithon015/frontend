export default function FeatherStreaks() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
      <svg
        viewBox="0 0 1440 600"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* 메인 줄기용 glow */}
          <filter id="fs-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* 강한 glow — 주 줄기 */}
          <filter id="fs-glow-strong" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* 배경 ambient 광원 */}
          <filter id="fs-ambient">
            <feGaussianBlur stdDeviation="55" />
          </filter>

          {/* 줄기 fade 그라데이션 — 양 끝을 투명하게 */}
          <linearGradient id="sg-main" gradientUnits="userSpaceOnUse" x1="1370" y1="-130" x2="890" y2="580">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="20%" stopColor="white" stopOpacity="0.75" />
            <stop offset="75%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sg-2" gradientUnits="userSpaceOnUse" x1="1440" y1="-60" x2="1000" y2="600">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="25%" stopColor="white" stopOpacity="0.55" />
            <stop offset="80%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sg-3" gradientUnits="userSpaceOnUse" x1="1300" y1="-170" x2="810" y2="580">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="25%" stopColor="white" stopOpacity="0.55" />
            <stop offset="80%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient 광원 — 우측 상단 */}
        <ellipse
          cx="1280"
          cy="50"
          rx="340"
          ry="230"
          fill="rgba(255,255,255,0.32)"
          filter="url(#fs-ambient)"
        />
        {/* Ambient 광원 — 우측 중단 */}
        <ellipse
          cx="1380"
          cy="320"
          rx="200"
          ry="160"
          fill="rgba(220,200,255,0.22)"
          filter="url(#fs-ambient)"
        />

        {/* ── 메인 줄기 묶음 (우측) ── */}
        <g filter="url(#fs-glow-strong)">
          {/* 핵심 줄기 */}
          <path
            d="M 1370 -130 C 1260 50 1120 260 890 580"
            stroke="url(#sg-main)"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        <g filter="url(#fs-glow)">
          {/* 인접 줄기 */}
          <path
            d="M 1440 -60 C 1330 130 1200 330 1000 600"
            stroke="url(#sg-2)"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 1300 -170 C 1200 20 1060 230 810 580"
            stroke="url(#sg-3)"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />

          {/* 외곽 퍼짐 줄기 */}
          <path
            d="M 1440 30 C 1400 195 1330 435 1200 625"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 1230 -210 C 1145 -18 1015 195 750 582"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
          />

          {/* 잔 줄기 */}
          <path
            d="M 1440 105 C 1432 278 1405 515 1365 635"
            stroke="rgba(255,255,255,0.17)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 1160 -238 C 1085 -38 958 172 698 580"
            stroke="rgba(255,255,255,0.17)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 1440 168 C 1440 355 1432 585 1420 645"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="0.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 1090 -262 C 1025 -50 895 162 655 580"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="0.6"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* ── 좌측 미러 줄기 (대칭, 더 옅게) ── */}
        <g filter="url(#fs-glow)" opacity="0.45">
          <path
            d="M 70 -130 C 180 50 320 260 550 580"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M -20 -60 C 110 130 240 330 440 600"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.0"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 140 -170 C 240 20 380 230 630 580"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="0.9"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
