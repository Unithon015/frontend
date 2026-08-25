import { useQuery } from '@tanstack/react-query';
import { getMyContents } from '../api/contentsApi';

export function useGetMyContents(limit?: number) {
  return useQuery({
    queryKey: ['myContents', limit],
    queryFn: () => getMyContents(limit),
  });
}
