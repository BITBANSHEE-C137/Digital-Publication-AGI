import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useSections() {
  return useQuery({
    queryKey: [api.sections.list.path],
    queryFn: async () => {
      const res = await fetch(api.sections.list.path);
      if (!res.ok) throw new Error("Failed to fetch sections");
      return api.sections.list.responses[200].parse(await res.json());
    },
  });
}

export function useSection(slug: string) {
  return useQuery({
    queryKey: [api.sections.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.sections.get.path, { slug });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch section");
      return api.sections.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}
