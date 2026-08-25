import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

const TOTAL_ROWS = 3;
const ROW_DURATION = 900;

interface AnalyzingIconProps {
  className?: string;
}

export default function AnalyzingIcon({ className }: AnalyzingIconProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % (TOTAL_ROWS + 1));
    }, ROW_DURATION);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-48 overflow-hidden rounded-2xl bg-white shadow-lg ${className ?? ''}`}>
      <div className="h-1.5 bg-[#7047E8]" />
      <div className="space-y-2 p-4">
        {Array.from({ length: TOTAL_ROWS }, (_, i) => {
          const isChecked = i < phase - 1;
          const isActive = phase > 0 && i === phase - 1;
          const showCheck = isChecked || isActive;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-500 ${
                isActive ? 'bg-violet-50' : ''
              }`}
            >
              <div
                className={`h-2 flex-1 rounded-full transition-colors duration-500 ${
                  isActive ? 'bg-violet-200' : 'bg-gray-200'
                }`}
              />
              {showCheck ? (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7047E8] transition-all duration-300">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </div>
              ) : (
                <div className="h-6 w-6 shrink-0 rounded-full bg-gray-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
