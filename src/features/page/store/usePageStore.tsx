import { create } from "zustand";
import { systemSupabase } from "@/lib/supabase/client";
import { Page } from "../types/page.types";
import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { IconName } from "@/components/ui/dynamic-icon";

interface PageState {
  pages: Record<string, Page & { isLoaded?: boolean }>;
  status: "idle" | "loading" | "succeeded" | "failed";
  fetchPages: (dashboardId: string) => Promise<void>;
  fetchPageContent: (pageId: string) => Promise<void>;
  updatePageLocal: (pageId: string, updates: Partial<Page>) => void;
  savePageRemote: (pageId: string, js: string, sql: string) => Promise<void>;
  updatePageSettings: (pageId: string, updates: Partial<Page>) => Promise<void>;
  addPageRemote: (data: {
    dashboardId?: string;
    name: string;
    icon: IconName;
    userId?: string;
  }) => Promise<void>;
  deletePageRemote: (id: string) => Promise<void>;
}

const DatabaseToStore = (item) => {
  return {
    icon: item.icon,
    id: item.id,
    name: item.name,
    dashboardId: item.dashbaord_id,
    sqlScript: item.sql_script,
    jsScript: item.js_script,
    isPublic: item.is_public,
  };
};

export const useStore = create<PageState>((set, get) => ({
  pages: {},
  status: "idle",

  fetchPages: async (dashboardId) => {
    const { data, error } = await systemSupabase
      .from("pages")
      .select("*")
      .eq("dashboard_id", dashboardId);
    if (error) throw error;

    const pages: Record<string, Page & { isLoaded?: boolean }> = {};

    data.forEach((item) => {
      const page = DatabaseToStore(item);
      pages[page.id] = { ...page, isLoaded: true };
    });

    set({ pages });
  },
  fetchPageContent: async (pageId) => {
    if (get().pages[pageId]?.jsScript) return;

    set({ status: "loading" });
    const { data, error } = await systemSupabase
      .from("pages")
      .select("*")
      .eq("id", pageId)
      .single();

    const page = DatabaseToStore(data);

    if (!error && data) {
      set((state) => ({
        pages: {
          ...state.pages,
          [pageId]: { ...state.pages[pageId], ...page, isLoaded: true },
        },
        status: "succeeded",
      }));
    } else {
      set({ status: "failed" });
    }
  },
  updatePageLocal: (pageId, updates) => {
    set((state) => ({
      pages: {
        ...state.pages,
        [pageId]: { ...state.pages[pageId], ...updates },
      },
    }));
  },
  savePageRemote: async (pageId, jsScript, sqlScript) => {
    get().updatePageLocal(pageId, { jsScript, sqlScript });

    await systemSupabase
      .from("pages")
      .update({ js_script: jsScript, sql_script: sqlScript })
      .eq("id", pageId);
  },
  updatePageSettings: async (pageId, updates) => {
    set((state) => ({
      pages: {
        ...state.pages,
        [pageId]: { ...state.pages[pageId], ...updates },
      },
    }));
    const { error } = await systemSupabase
      .from("pages")
      .update(updates)
      .eq("id", pageId);

    if (error) {
      console.error("Error updating page:", error);
      throw error;
    }
  },
  addPageRemote: async ({ dashboardId, name, icon, userId }) => {
    const { data, error } = await systemSupabase
      .from("pages")
      .insert({
        dashboard_id: dashboardId,
        user_id: userId,
        name,
        icon,
        js_script: "",
        sql_script: "",
      })
      .select()
      .single();

    if (error) throw error;

    set((state) => {
      const pages = { ...state.pages, [data.id]: DatabaseToStore(data) };
      return { ...state, pages };
    });
  },
  deletePageRemote: async (id) => {
    const { error } = await systemSupabase.from("pages").delete().eq("id", id);
    if (error) throw error;
    set((state) => {
      const pages = { ...state.pages };
      delete pages[id];
      return { ...state, pages };
    });
  },
}));

export const usePageStore = (id?: string) => {
  const params = useParams();
  const pageId = id || (params?.pageId as string);
  const pagesMap = useStore((s) => s.pages);
  const status = useStore((s) => s.status);
  const fetchPagesAction = useStore((s) => s.fetchPages);
  const fetchPageContentAction = useStore((s) => s.fetchPageContent);
  const updatePageLocalAction = useStore((s) => s.updatePageLocal);
  const savePageRemoteAction = useStore((s) => s.savePageRemote);
  const updatePageSettingsAction = useStore((s) => s.updatePageSettings);
  const addPageAction = useStore((s) => s.addPageRemote);
  const deletePageAction = useStore((s) => s.deletePageRemote);

  const pages = useMemo(() => Object.values(pagesMap), [pagesMap]);
  const currentPage = useMemo(
    () => (pageId ? pagesMap[pageId] : undefined),
    [pagesMap, pageId]
  );

  const requirePageId = useCallback(() => {
    if (!pageId) {
      console.error("Operación fallida: No hay una página seleccionada.");
      return false;
    }
    return true;
  }, [pageId]);

  return {
    status,
    isLoading: status === "loading" || status === "idle",
    pages,
    page: currentPage,
    fetchPages: async (dashboardId: string) => {
      await fetchPagesAction(dashboardId);
    },
    fetchContent: async () => {
      if (requirePageId()) {
        await fetchPageContentAction(pageId);
      }
    },
    updateLocal: (updates: Partial<Page>) => {
      if (requirePageId()) {
        updatePageLocalAction(pageId, updates);
      }
    },
    saveCode: async (js: string, sql: string) => {
      if (requirePageId()) {
        await savePageRemoteAction(pageId, js, sql);
      }
    },
    updateSettings: async (updates: Partial<Page>) => {
      if (requirePageId()) {
        await updatePageSettingsAction(pageId, updates);
      }
    },
    renamePage: async (pageId: string, name: string) => {
      await updatePageSettingsAction(pageId, { name });
    },
    addPage: addPageAction,
    deletePage: deletePageAction,
  };
};
