import { useMutation } from '@tanstack/react-query';
import { createContent } from '../api/contentsApi';

interface CreateContentParams {
  file: File | null;
  text: string;
}

export function useCreateContent() {
  return useMutation({
    mutationFn: ({ file, text }: CreateContentParams) => createContent(file, text),
  });
}
