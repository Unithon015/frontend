import { MoreVertical } from 'lucide-react';
import { useRef, useState } from 'react';

interface SensitiveItemProps {
  index: number;
  tag: string;
  tagColor?: string;
  title: string;
  description: string;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
  isModified?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onToggleModified?: () => void;
}

export default function SensitiveItem({
  index,
  tag,
  tagColor = 'bg-violet-100 text-violet-700',
  title,
  description,
  startTime,
  endTime,
  isActive = false,
  isModified = false,
  onClick,
  onDelete,
  onToggleModified,
}: SensitiveItemProps) {
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function openMenu(e: React.MouseEvent) {
    e.stopPropagation();
    if (menuPos) {
      setMenuPos(null);
      return;
    }
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
  }

  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-colors ${
        isActive ? 'border-violet-500 bg-violet-50' : 'border-gray-100 bg-white hover:bg-gray-50'
      }`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
          isActive ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {index}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tagColor}`}>{tag}</span>
          <p className="text-sm font-bold text-gray-900">{title}</p>
          {startTime && endTime && (
            <span className="text-xs font-semibold text-red-500">{startTime} ~ {endTime}</span>
          )}
        </div>
        <p className="text-xs leading-relaxed text-gray-500">{description}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isModified && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
            수정 완료
          </span>
        )}

        <button
          ref={buttonRef}
          onClick={openMenu}
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {menuPos && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={(e) => { e.stopPropagation(); setMenuPos(null); }}
            />
            <div
              className="fixed z-20 min-w-[130px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg"
              style={{ top: menuPos.top, right: menuPos.right }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); onToggleModified?.(); setMenuPos(null); }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                {isModified ? '수정 미완료' : '수정 완료'}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete?.(); setMenuPos(null); }}
                className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
              >
                삭제하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
