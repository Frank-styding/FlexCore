import { runScript as runCode } from "@/lib/runScript/runScript";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// Asegúrate de que la ruta sea correcta
import { ComponentsBuilders } from "@/lib/ComponentBuilders/Builders";
import { RootState } from "../store"; // Importa tu tipo RootState para evitar 'any'

export interface ILog {
  message: string;
  data?: any;
}

interface ScriptState {
  sqlCode: string;
  jsCode: string;
  logs: ILog[];
  // result: any;  <-- ELIMINADO: Redux no debe guardar funciones
  onlyJs: boolean;
}

const initialState: ScriptState = {
  sqlCode: "",
  jsCode: "",
  logs: [],
  onlyJs: false,
};

// Función auxiliar para limpiar objetos antes de guardarlos en Redux Logs
/* const sanitizeForRedux = (data: any): any => {
  // 1. Si es función, devolvemos un string (Seguro para Redux)
  if (typeof data === "function") return "[Function]";

  // 2. Si es primitivo o null, lo devolvemos tal cual
  if (data === null || typeof data !== "object") return data;

  // 3. Si es Array, sanitizamos cada elemento
  if (Array.isArray(data)) {
    return data.map(sanitizeForRedux);
  }

  // 4. Si es Objeto, sanitizamos cada propiedad
  const sanitized: any = {};
  for (const key in data) {
    // Evitamos referencias circulares simples o props muy internas si es necesario
    sanitized[key] = sanitizeForRedux(data[key]);
  }
  return sanitized;
}; */
/* export const executeScript = createAsyncThunk(
  "scriptEditor/execute",
  async (_, { getState, dispatch }) => {
    const state = (getState() as RootState).scriptEditor;

    // INYECCIÓN DE DEPENDENCIAS (Runtime)
    // Aquí combinamos los datos de Redux con tus funciones constructoras estáticas
    const executionContext = {
      ...state.context, // Datos (parentId, user_id, etc.)
      ...ComponentsBuilders, // Funciones (Button, Input, UI...)
    };

    try {
      const response = await runCode(
        state.jsCode,
        state.sqlCode,
        executionContext
      );

      // Retornamos la respuesta completa (incluyendo funciones) al componente
      return response;
    } catch (error: any) {
      // Si falla, lanzamos el error para que .rejected lo capture
      throw error;
    }
  }
);
 */
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
  /*  extraReducers: (builder) => {
    // CASO DE ÉXITO
    builder.addCase(executeScript.fulfilled, (state, action) => {
      const { logs: executionLogs, result } = action.payload;
      // 1. Guardamos los logs internos del script (console.log dentro del código)
      const newLogs = executionLogs.map((l: any) => ({ step: "JS", ...l }));
      state.logs.push(...newLogs);

      // 2. NUEVO: Agregamos el log del RETURN, pero sanitizado
      if (result !== undefined) {
        state.logs.push({
          message: "Script finalizado. Return:",
          // Aquí ocurre la magia: Limpiamos las funciones antes de guardar
          data: sanitizeForRedux(result),
        });
      }
    });

    // CASO DE ERROR
    builder.addCase(executeScript.rejected, (state, action) => {
      state.logs.push({
        message: "Error crítico ejecutando script",
        data: action.error.message || action.error,
      });
    });
  }, */
});

export const { setJsCode, setSqlCode, clearConsole, addExecutionLogs } =
  ScriptEditor.actions;
export default ScriptEditor.reducer;
