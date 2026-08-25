import { Video } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnalyzingIcon from '@/pages/dashboard/components/AnalyzingIcon';
import PageLayout from '@/shared/components/PageLayout';
import { useGetAnalysis } from '@/features/dashboard/model/useGetAnalysis';

export default function AnalyzingPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const contentId = state?.contentId as string | undefined;
  const content = state?.content;

  const { data: analysis } = useGetAnalysis(contentId);

  const progress = analysis?.progress_percent ?? 0;

  useEffect(() => {
    if (analysis?.status === 'COMPLETED') {
      navigate('/dashboard/result', { state: { contentId, content, analysis }, replace: true });
    }
    if (analysis?.status === 'FAILED') {
      navigate('/dashboard', { replace: true });
    }
  }, [analysis, contentId, navigate]);

  return (
    <PageLayout className="items-center py-30">
      <AnalyzingIcon className="mb-10" />

      <h1 className="mb-2 text-2xl font-bold text-gray-900">검수 중이에요</h1>
      <p className="mb-10 text-sm text-gray-500">영상 속 장면과 음성을 살펴보고 있어요.</p>

      {/* Progress */}
      <div className="mb-5 w-full max-w-2xl">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">콘텐츠 분석</span>
          <span className="text-sm font-semibold text-violet-600">{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-[#7047E8] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* File card */}
      <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
            <Video className="h-5 w-5 text-violet-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{analysis?.current_step ?? '분석 준비 중'}</p>
            <p className="text-xs text-gray-400">{analysis?.status ?? 'QUEUED'}</p>
          </div>
          <span className="text-sm text-gray-400">예상 소요 시간 약 1분</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className="mt-4 w-full max-w-2xl text-left text-sm text-gray-500 hover:text-gray-600"
      >
        ← 대시보드로 돌아가기
      </button>
    </PageLayout>
  );
}
