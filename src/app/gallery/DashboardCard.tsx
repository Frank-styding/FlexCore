import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TrashIcon, Play, Edit } from "lucide-react";

export const DashboardCard = ({
  name,
  onClick,
  onDelete,
  onEdit,
}: {
  name: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <Card className="w-40 h-35 gap-4 items-center justify-center ">
      <CardHeader className="text-center  w-full text-2xl" title={name}>
        {name}
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button variant="outline" size="icon" onClick={onDelete}>
          <TrashIcon className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onClick}>
          <Play className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
