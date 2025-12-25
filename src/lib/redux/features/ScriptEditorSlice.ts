import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILog {
  message: string;
  data?: any;
}

interface ScriptState {
  sqlCode: string;
  jsCode: string;
  logs: ILog[];
  onlyJs: boolean;
}

const initialState: ScriptState = {
  sqlCode: "",
  jsCode: "",
  logs: [],
  onlyJs: false,
};

export const ScriptEditor = createSlice({
  name: "scriptEditor",
  initialState,
  reducers: {
    setJsCode: (state, action: PayloadAction<string>) => {
      state.jsCode = action.payload;
    },
    setSqlCode: (state, action: PayloadAction<string>) => {
      state.sqlCode = action.payload;
    },
    clearConsole: (state) => {
      state.logs = [];
    },
    addExecutionLogs: (
      state,
      action: PayloadAction<{ logs: ILog[]; result?: any }>
    ) => {
      const { logs, result } = action.payload;
      // 1. Logs internos del script
      const newLogs = logs.map((l: any) => ({ step: "JS", ...l }));
      state.logs.push(...newLogs);

      // 2. Log del return final (Sanitizado)
      if (result !== undefined) {
        state.logs.push({
          message: "Script finalizado. Return:",
          data: result, // Asumimos que ya viene sanitizado desde el componente
        });
      }
    },
  },
});

export const { setJsCode, setSqlCode, clearConsole, addExecutionLogs } =
  ScriptEditor.actions;
export default ScriptEditor.reducer;
