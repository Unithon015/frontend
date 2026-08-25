import { useQuery } from '@tanstack/react-query';
import { getAnalysis } from '../api/contentsApi';

export function useGetAnalysis(contentId: string | undefined) {
  return useQuery({
    queryKey: ['analysis', contentId],
    queryFn: () => getAnalysis(contentId!),
    enabled: !!contentId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'COMPLETED' || status === 'FAILED') return false;
      return 1000;
    },
  });
}
