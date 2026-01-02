import { Button } from "@/components/ui/button";

export const Tap = ({
  onClick,
  name,
  active,
}: {
  onClick?: (name: string) => void;
  name: string;
  active?: boolean;
}) => {
  const onClickTab = () => {
    onClick?.(name);
  };
  return (
    <Button
      variant={active ? "default" : "outline"}
      onClick={onClickTab}
      className="uppercase min-w-20 transition-none duration-0"
    >
      {name}
    </Button>
  );
};
