interface ScanLineProps {
  variant?: 'full' | 'card';
  duration?: number;
}

const presets = {
  full: {
    defaultDuration: 10,
    glow: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.02) 20%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.12) 55%, rgba(255,255,255,0.02) 80%, transparent 100%)',
    line: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.4) 10%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.4) 90%, transparent 100%)',
  },
  card: {
    defaultDuration: 8,
    glow: 'linear-gradient(to bottom, transparent 0%, rgba(112,71,232,0.03) 20%, rgba(112,71,232,0.10) 45%, rgba(112,71,232,0.10) 55%, rgba(112,71,232,0.03) 80%, transparent 100%)',
    line: 'linear-gradient(to right, transparent 0%, rgba(112,71,232,0.2) 10%, rgba(112,71,232,0.5) 50%, rgba(112,71,232,0.2) 90%, transparent 100%)',
  },
} as const;

export default function ScanLine({ variant = 'full', duration }: ScanLineProps) {
  const { defaultDuration, glow, line } = presets[variant];

  return (
    <div className="scan-wrapper">
      <div
        className="scan-beam"
        style={{ animationDuration: `${duration ?? defaultDuration}s` }}
      >
        <div className="scan-glow" style={{ background: glow }} />
        <div className="scan-line" style={{ background: line }} />
      </div>
    </div>
  );
}
