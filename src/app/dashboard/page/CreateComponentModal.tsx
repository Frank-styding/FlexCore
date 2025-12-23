import { ComponentEditor } from "@/components/custom/ComponentEditor/ComponentEditor";
import { Modal, ModalProps } from "@/components/custom/Modal";
import { CodePlayground } from "@/components/custom/Playground";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearch } from "@/hooks/useSearch";
/* import { Edit } from "lucide-react"; */
import { ChangeEvent, useState } from "react";

type CreateComponentModalProps = Omit<ModalProps, "title">;

const SelectComponent = ({
  items = [],
  onSelect,
}: {
  items?: string[];
  onSelect?: (value: string) => void;
}) => {
  const [data, value, setValue] = useSearch(items, (item, value) => {
    return item.toLowerCase().includes(value.toLowerCase());
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="grid grid-rows-[auto_1fr] p-3 gap-5 h-full min-w-[50%]">
      <Input
        placeholder="Buscar componnente"
        value={value}
        onChange={onChange}
      />
      <div className="overlfow-x-hidden overflow-y-auto max-h-[90%]">
        <div className="flex flex-wrap gap-5">
          {data.map((item) => (
            <Button
              variant="outline"
              className="w-35 h-35 items-center justify-center text-2xl"
              key={item}
              onClick={() => onSelect?.(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Editor = () => {
  return (
    <ComponentEditor
      defaultContextVariables={{
        parentId: "101",
        theme: "dark",
        userId: "user_123",
      }}
      initialSql="-- Usa {{parentId}} para filtrar dinámicamente
SELECT * FROM orders WHERE user_id = {{parentId}}"
      initialScript="// Transforma la data cruda del SQL para tu componente
return sqlData.map(order => ({
    label: `Order #${order.id}`,
    value: order.total
}));"
    />
  );
};

const items = ["Table"];
export const CreateComponentModal = (props: CreateComponentModalProps) => {
  const [editor, setEditor] = useState({ open: false, componentName: "" });

  const onSelect = (name: string) => {
    setEditor({ open: true, componentName: name });
  };

  return (
    <Modal
      {...props}
      title="Create Component"
      className="min-w-[90%] min-h-[85%] max-h-[85%] grid grid-rows-[35px_1fr] gap-0"
    >
      <div className="w-full min-h-full  grid grid-rows-[1fr_40px] gap-3">
        <ComponentEditor />
        <div className="flex justify-end gap-5">
          <Button variant="outline"> Cancel </Button>
          <Button variant="default"> Create </Button>
        </div>
      </div>
    </Modal>
  );
};
