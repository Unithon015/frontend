import { useQuery } from '@tanstack/react-query';
import { getContent } from '../api/contentsApi';

export function useGetContent(contentId: string | undefined) {
  return useQuery({
    queryKey: ['content', contentId],
    queryFn: () => getContent(contentId!),
    enabled: !!contentId,
  });
}
