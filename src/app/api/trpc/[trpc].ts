import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '@/server/trpc/router';

export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});