import { QueryClient } from '@tanstack/react-query';

/** Shared query client. The calendar screens set their own refetchInterval
 *  (see CALENDAR_REFETCH_INTERVAL) for the once-a-minute auto-reload. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});
