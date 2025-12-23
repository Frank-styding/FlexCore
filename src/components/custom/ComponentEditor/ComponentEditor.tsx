"use client";

import { ButtonGroup } from "@/components/ui/button-group";
import Editor from "@monaco-editor/react";
import { Tap } from "./Tap";
import { Button } from "@/components/ui/button";
import { TabContainer } from "./TabContainer";
import { TabContent } from "./TabContent";
import { Play } from "lucide-react";
import { useComponentEditor } from "./useComponentEditor";
import { Console } from "./Console";

interface DataPipelineEditorProps {
  initialSql?: string;
  initialScript?: string;
  defaultContextVariables?: Record<string, any>;
}

const CustomEditor = (
  props: {
    language: string;
    value?: string;
    onChange: (value: string | undefined) => void;
  } & React.ComponentProps<typeof Editor>
) => {
  return (
    <Editor
      {...props}
      height="100%"
      defaultLanguage={props.language}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 15,
        padding: { top: 10 },
      }}
    />
  );
};
export const ComponentEditor = ({
  initialSql = "SELECT * FROM items WHERE parent_id = {{parentId}}",
  initialScript = "// Tienes acceso a 'sqlData' y 'variables'\nconst processed = sqlData.map(item => item.name);\nreturn processed;",
}: DataPipelineEditorProps) => {
  const {
    sqlCode,
    setSqlCode,
    jsCode,
    setJsCode,
    logs,
    uiState,
    toggleTab,
    runPipeline,
    clearLogs,
    handleEditorDidMount,
  } = useComponentEditor({ initialSql, initialScript });

  return (
    <div className="w-full h-full grid grid-rows-[45px_1fr]">
      <div className="w-full h-12 flex gap-3">
        <ButtonGroup>
          <Tap name="JS" onClick={toggleTab} />
          <Tap name="SQL" onClick={toggleTab} />
          <Tap name="Console" onClick={toggleTab} />
        </ButtonGroup>
        <Tap name="preview" onClick={toggleTab} />
        <Button variant="outline" onClick={runPipeline}>
          <Play />
        </Button>
      </div>
      <div className="w-full  flex gap-10">
        <TabContainer show={uiState.showEditor}>
          <TabContent id="JS" currentId={uiState.currentTab}>
            <CustomEditor
              value={jsCode}
              onChange={(v) => setJsCode(v || "")}
              onMount={handleEditorDidMount}
              language="javascript"
            />
          </TabContent>
          <TabContent id="SQL" currentId={uiState.currentTab}>
            <CustomEditor
              value={sqlCode}
              onChange={(v) => setSqlCode(v || "")}
              language="sql"
            />
          </TabContent>
        </TabContainer>
        <TabContainer show={uiState.showConsole}>
          <TabContent>
            <Console logs={logs} onClean={clearLogs} />
          </TabContent>
        </TabContainer>
        <TabContainer show={uiState.showPreview}>
          <TabContent>preview</TabContent>
        </TabContainer>
      </div>
    </div>
  );
};
