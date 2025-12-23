import { Button } from "@/components/ui/button";

export const Tap = ({
  onClick,
  name,
}: {
  onClick?: (name: string) => void;
  name: string;
}) => {
  const onClickTab = () => {
    onClick?.(name);
  };
  return (
    <Button variant="outline" onClick={onClickTab} className="uppercase">
      {name}
    </Button>
  );
};
