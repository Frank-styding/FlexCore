import { runScript as runCode } from "@/lib/runScript/runScript";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILog {
  message: string;
  data?: any;
}

interface ScriptState {
  sqlCode: string;
  jsCode: string;
  context: Record<string, any>;
  logs: ILog[];
  result: any;
  onlyJs: boolean;
}

const initialState: ScriptState = {
  sqlCode: "",
  jsCode: "",
  logs: [],
  result: null,
  context: {},
  onlyJs: false,
};

export const executeScript = createAsyncThunk(
  "scriptEditor/execute",
  async (_, { getState }) => {
    // Obtenemos el estado actual para sacar el código y el contexto
    // Nota: Deberás ajustar 'any' al tipo de tu RootState si lo tienes definido
    const state = (getState() as any).scriptEditor as ScriptState;

    // Ejecutamos la función asíncrona fuera del reducer
    const response = await runCode(state.jsCode, state.sqlCode, state.context);

    return response; // Lo que retornes aquí va al payload de 'fulfilled'
  }
);

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
    setContext: (state, action: PayloadAction<any>) => {
      state.context = action.payload;
    },
    clearConsole: (state) => {
      state.logs = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(executeScript.fulfilled, (state, action) => {
      const { logs: executionLogs, result } = action.payload;

      const newLogs = executionLogs.map((l: any) => ({ step: "JS", ...l }));
      state.logs.push(...newLogs);

      if (result !== undefined) {
        state.result = result;
        state.logs.push({ message: "Result:", data: result });
      }
    });

    builder.addCase(executeScript.rejected, (state, action) => {
      state.logs.push({
        message: "Error ejecutando script",
        data: action.error,
      });
    });
  },
});

export const { setJsCode, setSqlCode, clearConsole } = ScriptEditor.actions;

export default ScriptEditor.reducer;
