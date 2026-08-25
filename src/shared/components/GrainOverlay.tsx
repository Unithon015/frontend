export default function GrainOverlay() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.08,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <filter id="grain-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          {/* 그레이스케일로 변환 */}
          <feColorMatrix type="saturate" values="0" />
          {/* feTurbulence 알파 채널도 노이즈라서 불투명하게 고정 */}
          <feComponentTransfer>
            <feFuncA type="linear" slope="0" intercept="1" />
          </feComponentTransfer>
        </filter>
        {/* 200×200 타일 단위로 렌더링 후 SVG가 반복 처리 */}
        <pattern
          id="grain-tile"
          x="0"
          y="0"
          width="200"
          height="200"
          patternUnits="userSpaceOnUse"
        >
          <rect width="200" height="200" filter="url(#grain-noise)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grain-tile)" />
    </svg>
  );
}
