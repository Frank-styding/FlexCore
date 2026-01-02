import { create } from "zustand";

export interface LogEntry {
  message: string;
  data?: any;
  step?: string;
}

interface EditorState {
  sqlCode: string;
  jsCode: string;
  logs: LogEntry[];
  isEditing: boolean;

  setJsCode: (code: string) => void;
  setSqlCode: (code: string) => void;
  clearConsole: () => void;
  setIsEditing: (value: boolean) => void;
  addExecutionLogs: (logs: LogEntry[], result?: any) => void;
  resetEditor: () => void;
}

const initialState = {
  sqlCode: "",
  jsCode: "",
  logs: [] as LogEntry[],
  isEditing: false,
};

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,

  setJsCode: (code) => set({ jsCode: code }),

  setSqlCode: (code) => set({ sqlCode: code }),

  clearConsole: () => set({ logs: [] }),

  setIsEditing: (value) => set({ isEditing: value }),

  addExecutionLogs: (logs, result) =>
    set((state) => {
      const newLogs = logs.map((l) => ({ step: "JS", ...l }));
      const updatedLogs = [...state.logs, ...newLogs];

      if (result !== undefined) {
        updatedLogs.push({
          message: "Script finalizado. Return:",
          data: result,
        });
      }

      return { logs: updatedLogs };
    }),

  resetEditor: () => set(initialState),
}));
