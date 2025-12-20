import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TrashIcon, Play } from "lucide-react";

export const DashboardCard = ({
  name,
  onClick,
  onDelete,
}: {
  name: string;
  onClick?: (item: string) => void;
  onDelete?: (item: string) => void;
}) => {
  return (
    <Card className="w-40 h-35 gap-4 items-center justify-center ">
      <CardHeader className="text-center  w-full text-2xl" title={name}>
        {name}
      </CardHeader>
      <CardContent className="flex justify-center gap-5">
        <Button variant="outline" size="icon" onClick={() => onDelete?.(name)}>
          <TrashIcon className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onClick?.(name)}>
          <Play className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
