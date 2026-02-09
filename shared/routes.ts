import { z } from 'zod';
import { insertSectionSchema, sections } from './schema';

export const errorSchemas = {
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  sections: {
    list: {
      method: 'GET' as const,
      path: '/api/sections' as const,
      responses: {
        200: z.array(z.custom<typeof sections.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/sections/:slug' as const,
      responses: {
        200: z.custom<typeof sections.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
