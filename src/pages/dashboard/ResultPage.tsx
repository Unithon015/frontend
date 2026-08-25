import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import PageLayout from '@/shared/components/PageLayout';
import SensitiveItem from '@/pages/dashboard/components/SensitiveItem';
import type { Analysis, Content, Finding } from '@/features/dashboard/api/contentsApi';
import { useGetContent } from '@/features/dashboard/model/useGetContent';
import { useGetAnalysis } from '@/features/dashboard/model/useGetAnalysis';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PRIORITY_CONFIG = {
  HIGH:   { fill: 1,      stroke: '#ef4444', text: 'text-red-500',    label: 'HIGH'   },
  MEDIUM: { fill: 2 / 3,  stroke: '#f59e0b', text: 'text-amber-500',  label: 'MEDIUM' },
  LOW:    { fill: 1 / 3,  stroke: '#eab308', text: 'text-yellow-500', label: 'LOW'    },
} as const;

interface AnalysisContent {
  imageUrl?: string;
  text?: string;
  videoUrl?: string;
  videoDuration?: string;
}

interface BaseSensitiveItem {
  id: number;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
}

interface ImageSensitiveItem extends BaseSensitiveItem {
  type: 'image';
  bbox: { top: string; left: string; width: string; height: string };
}

interface TextSensitiveItem extends BaseSensitiveItem {
  type: 'text';
  keywords: string[];
}

interface BothSensitiveItem extends BaseSensitiveItem {
  type: 'both';
  bbox: { top: string; left: string; width: string; height: string };
  keywords: string[];
}

interface VideoSensitiveItem extends BaseSensitiveItem {
  type: 'video';
  startTime: string;
  endTime: string;
}

type SensitiveItemData = ImageSensitiveItem | TextSensitiveItem | BothSensitiveItem | VideoSensitiveItem;

function hasBbox(item: SensitiveItemData): item is ImageSensitiveItem | BothSensitiveItem {
  return item.type === 'image' || item.type === 'both';
}

function hasKeywords(item: SensitiveItemData): item is TextSensitiveItem | BothSensitiveItem {
  return item.type === 'text' || item.type === 'both';
}

function hasTimestamp(item: SensitiveItemData): item is VideoSensitiveItem {
  return item.type === 'video';
}

function parseSeconds(ts: string): number {
  const [min, sec] = ts.split(':').map(Number);
  return min * 60 + sec;
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function buildContent(content: Content): AnalysisContent {
  const result: AnalysisContent = {};
  for (const asset of content.assets) {
    const url = `${BASE_URL}${asset.download_url}`;
    if (asset.content_type === 'IMAGE') result.imageUrl = url;
    if (asset.content_type === 'VIDEO') result.videoUrl = url;
  }
  if (content.caption_text) result.text = content.caption_text;
  return result;
}

const PRIORITY_COLOR: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  LOW: 'bg-gray-100 text-gray-600',
};

function findingToItem(finding: Finding, idx: number): SensitiveItemData {
  const base = {
    id: idx + 1,
    tag: finding.signal_type,
    tagColor: PRIORITY_COLOR[finding.priority] ?? 'bg-violet-100 text-violet-700',
    title: finding.excerpt,
    description: finding.reason,
  };

  const type = finding.type[0]?.toLowerCase();

  if (type === 'video' && finding.start_ms !== null) {
    return {
      ...base,
      type: 'video',
      startTime: formatTime((finding.start_ms ?? 0) / 1000),
      endTime: formatTime((finding.end_ms ?? finding.start_ms ?? 0) / 1000),
    };
  }

  return { ...base, type: 'text', keywords: [finding.excerpt] };
}

function highlightText(
  text: string,
  allKeywords: string[],
  activeKeywords: string[] = [],
  modifiedKeywords: string[] = [],
) {
  if (!allKeywords.length) return <>{text}</>;
  const escaped = allKeywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) => {
        const isMatch = allKeywords.some((k) => k.toLowerCase() === part.toLowerCase());
        if (!isMatch) return part;
        const isModified = modifiedKeywords.some((k) => k.toLowerCase() === part.toLowerCase());
        const isActive = activeKeywords.some((k) => k.toLowerCase() === part.toLowerCase());
        const bgClass = isModified ? 'bg-green-100' : 'bg-red-100';
        const textClass = isActive ? (isModified ? 'text-green-600' : 'text-red-600') : 'text-gray-900';
        return (
          <span key={i} className={`rounded px-0.5 ${bgClass} ${textClass}`}>
            {part}
          </span>
        );
      })}
    </>
  );
}

export default function ResultPage() {
  const { state } = useLocation();
  const contentId = state?.contentId as string | undefined;
  const stateContent = state?.content as Content | undefined;
  const stateAnalysis = state?.analysis as Analysis | undefined;

  const { data: fetchedContent, isLoading: isContentLoading } = useGetContent(
    stateContent ? undefined : contentId,
  );
  const { data: fetchedAnalysis, isLoading: isAnalysisLoading } = useGetAnalysis(
    stateAnalysis ? undefined : contentId,
  );

  const content = stateContent ?? fetchedContent;
  const analysis = stateAnalysis ?? fetchedAnalysis;

  const isLoading = isContentLoading || isAnalysisLoading;

  const analysisContent = content ? buildContent(content) : {};
  const initialItems: SensitiveItemData[] = (analysis?.findings ?? []).map(findingToItem);

  const priorities = analysis?.findings.map((f) => f.priority) ?? [];
  const overallPriority = priorities.includes('HIGH')
    ? 'HIGH'
    : priorities.includes('MEDIUM')
      ? 'MEDIUM'
      : priorities.includes('LOW')
        ? 'LOW'
        : null;

  const isTextOnly = !!analysis && !analysis.type.includes('image') && !analysis.type.includes('video');
  const [userLayout, setLayout] = useState<'vertical' | 'horizontal' | null>(null);
  const layout = userLayout ?? (isTextOnly ? 'vertical' : 'horizontal');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [items, setItems] = useState<SensitiveItemData[]>(initialItems);
  const [modifiedIds, setModifiedIds] = useState<Set<number>>(new Set());
  const isHorizontal = layout === 'horizontal';

  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const totalSecs = analysisContent.videoDuration ? parseSeconds(analysisContent.videoDuration) : 0;

  function seekTo(secs: number) {
    if (!videoRef.current) return;
    videoRef.current.currentTime = secs;
    videoRef.current.play();
  }

  function togglePlay() {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
  }

  function handleTimelineClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!totalSecs) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seekTo(pct * totalSecs);
  }

  function handleDelete(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function handleToggleModified(id: number) {
    setModifiedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleItemClick(id: number) {
    setSelectedId((prev) => (prev === id ? null : id));
    const clicked = items.find((i) => i.id === id);
    if (clicked && hasTimestamp(clicked)) seekTo(parseSeconds(clicked.startTime));
  }

  const sortedItems = [
    ...items.filter((item) => !modifiedIds.has(item.id)),
    ...items.filter((item) => modifiedIds.has(item.id)),
  ];

  const selectedItem = items.find((item) => item.id === selectedId) ?? null;
  const activeImageItem = selectedItem && hasBbox(selectedItem) ? selectedItem : null;
  const activeTextItem = selectedItem && hasKeywords(selectedItem) ? selectedItem : null;
  const videoItems = items.filter(hasTimestamp);

  const allTextKeywords = items.filter(hasKeywords).flatMap((item) => item.keywords);
  const modifiedTextKeywords = items
    .filter((item) => modifiedIds.has(item.id))
    .filter(hasKeywords)
    .flatMap((item) => item.keywords);

  const pageTitle = analysisContent.videoDuration && analysisContent.text
    ? '영상·글 검수 결과'
    : analysisContent.videoDuration
      ? '영상 검수 결과'
      : analysisContent.imageUrl && analysisContent.text
        ? '사진·글 검수 결과'
        : analysisContent.imageUrl
          ? '사진 검수 결과'
          : '글 검수 결과';

  const contentPanel = (
    <div className={isHorizontal ? 'flex-1 overflow-y-auto max-h-[calc(100vh-15rem)] pr-2 [&::-webkit-scrollbar]:hidden' : ''}>
      {analysisContent.videoUrl && (
        <div className="mb-4 rounded-2xl bg-gray-100 p-5 shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="relative overflow-hidden rounded-2xl bg-black" style={{ width: 220, aspectRatio: '9/16' }}>
              <video
                ref={videoRef}
                src={analysisContent.videoUrl}
                className="h-full w-full object-contain"
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/20"
              >
                {!isPlaying && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40">
                    <Play className="h-5 w-5 text-white" fill="white" />
                  </div>
                )}
              </button>
              {analysisContent.videoDuration && (
                <div className="absolute bottom-3 right-3 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white/80">
                  {formatTime(currentTime)} / {analysisContent.videoDuration}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white px-5 py-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">영상 타임라인</span>
              <span className="text-xs text-gray-400">문제가 있는 장면은 빨간색으로 표시돼요</span>
            </div>
            <div className="relative mb-3 cursor-pointer py-1.5" onClick={handleTimelineClick}>
              <div className="relative h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="pointer-events-none absolute left-0 top-0 h-full bg-violet-500"
                  style={{ width: `${Math.min(totalSecs ? (currentTime / totalSecs) * 100 : 0, 100)}%` }}
                />
                {videoItems.map((item) => {
                  const isModified = modifiedIds.has(item.id);
                  const startPct = (parseSeconds(item.startTime) / totalSecs) * 100;
                  const endPct = (parseSeconds(item.endTime) / totalSecs) * 100;
                  return (
                    <div
                      key={item.id}
                      onClick={(e) => { e.stopPropagation(); handleItemClick(item.id); }}
                      className={`absolute top-0 h-full cursor-pointer transition-colors ${
                        isModified
                          ? selectedId === item.id ? 'bg-green-600' : 'bg-green-400'
                          : selectedId === item.id ? 'bg-red-600' : 'bg-red-400'
                      }`}
                      style={{ left: `${startPct}%`, width: `${endPct - startPct}%` }}
                    />
                  );
                })}
              </div>
              <div
                className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-violet-500 shadow"
                style={{ left: `${Math.min(totalSecs ? (currentTime / totalSecs) * 100 : 0, 100)}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {videoItems.map((item) => {
                const isModified = modifiedIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      isModified
                        ? selectedId === item.id ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'
                        : selectedId === item.id ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {item.startTime} ~ {item.endTime} 확인
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {analysisContent.imageUrl && (
        <div className="mb-4 flex items-center justify-center overflow-hidden rounded-2xl bg-gray-300 shadow-sm">
          <div className="relative">
            <img src={analysisContent.imageUrl} alt="검수 이미지" className="block max-h-[700px] w-auto rounded-2xl" />
            {activeImageItem && (
              <div className="absolute" style={activeImageItem.bbox}>
                <div className="relative h-full w-full rounded-lg border-2 border-violet-500">
                  <div className="absolute -left-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
                    {items.findIndex((i) => i.id === activeImageItem.id) + 1}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {analysisContent.text && (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="text-xs font-medium text-gray-500">민감한 표현</span>
          </div>
          <p className="text-sm font-bold leading-6 text-gray-900">
            {highlightText(analysisContent.text, allTextKeywords, activeTextItem?.keywords ?? [], modifiedTextKeywords)}
          </p>
        </div>
      )}
    </div>
  );

  const resultPanel = (
    <div className={isHorizontal ? 'flex-1 overflow-y-auto max-h-[calc(100vh-15rem)] pr-2 [&::-webkit-scrollbar]:hidden' : ''}>
      {overallPriority && (() => {
        const cfg = PRIORITY_CONFIG[overallPriority];
        const dashoffset = CIRCUMFERENCE * (1 - cfg.fill);
        return (
          <div className={`flex flex-col items-center ${isHorizontal ? 'mb-8' : 'mb-12'}`}>
            <div className="relative">
              <svg width="120" height="120" className="-rotate-90">
                <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#f3f4f6" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r={RADIUS}
                  fill="none"
                  stroke={cfg.stroke}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashoffset}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-bold ${cfg.text}`}>{cfg.label}</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">전체 콘텐츠 민감도</p>
          </div>
        );
      })()}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">민감한 부분</h2>
        <span className="text-sm text-gray-400">{items.length}개의 항목</span>
      </div>
      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {sortedItems.map((item) => (
            <motion.div key={item.id} layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <SensitiveItem
                index={initialItems.findIndex((orig) => orig.id === item.id) + 1}
                tag={item.tag}
                tagColor={item.tagColor}
                title={item.title}
                description={item.description}
                startTime={hasTimestamp(item) ? item.startTime : undefined}
                endTime={hasTimestamp(item) ? item.endTime : undefined}
                isActive={selectedId === item.id}
                isModified={modifiedIds.has(item.id)}
                onClick={() => handleItemClick(item.id)}
                onToggleModified={() => handleToggleModified(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">민감한 요소가 발견되지 않았어요.</p>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <PageLayout>
        <p className="py-20 text-center text-sm text-gray-400">결과를 불러오는 중...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout paddingX={isHorizontal ? '' : 'px-40'}>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500">표시된 영역과 민감 요소를 확인해보세요.</p>
        </div>
        <div className="flex gap-0.5 rounded-lg border border-gray-200 p-1 text-sm">
          <button
            onClick={() => setLayout('horizontal')}
            className={`rounded px-3 py-1 transition-colors ${layout === 'horizontal' ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            가로 보기
          </button>
          <button
            onClick={() => setLayout('vertical')}
            className={`rounded px-3 py-1 transition-colors ${layout === 'vertical' ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            세로 보기
          </button>
        </div>
      </div>

      {isHorizontal ? (
        <div className="flex items-start gap-8">
          {contentPanel}
          {resultPanel}
        </div>
      ) : (
        <>
          {contentPanel}
          <div className="mb-12" />
          {resultPanel}
        </>
      )}
    </PageLayout>
  );
}
