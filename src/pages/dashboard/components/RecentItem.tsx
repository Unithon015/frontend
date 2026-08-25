import { ChevronRight } from 'lucide-react';

interface RecentItemProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  meta: string;
  date: string;
  alert: string;
  status: string;
  statusColor: string;
  onClick?: () => void;
}

export default function RecentItem({
  icon,
  iconBg,
  title,
  meta,
  date,
  alert,
  status,
  statusColor,
  onClick,
}: RecentItemProps) {
  return (
    <div onClick={onClick} className="flex cursor-pointer items-center gap-4 px-5 py-4 hover:bg-gray-50">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-[2] min-w-0">
        <p className="mb-1 truncate text-[16px] font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-400">{meta}</p>
      </div>
      <div className="flex-1 text-xs text-gray-400">{date}</div>
      <div className="flex-1 text-sm font-medium text-violet-600">{alert}</div>
      <div className="flex-1">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}>
          {status}
        </span>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-300" />
    </div>
  );
}
