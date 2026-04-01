import { useQuery } from "@tanstack/react-query";

export interface Section {
  id: number;
  slug: string;
  title: string;
  content: string;
  order: number;
  published: boolean;
}

const SECTIONS_URL = '/sections.json';

export function useSections() {
  return useQuery<Section[]>({
    queryKey: [SECTIONS_URL],
    queryFn: async () => {
      const res = await fetch(SECTIONS_URL);
      if (!res.ok) throw new Error("Failed to fetch sections");
      return res.json();
    },
    staleTime: Infinity,
  });
}

export function useSection(slug: string) {
  return useQuery<Section | null>({
    queryKey: [SECTIONS_URL, slug],
    queryFn: async () => {
      const res = await fetch(SECTIONS_URL);
      if (!res.ok) throw new Error("Failed to fetch sections");
      const sections: Section[] = await res.json();
      return sections.find(s => s.slug === slug) ?? null;
    },
    enabled: !!slug,
    staleTime: Infinity,
  });
}
