import { useAddSourceDialog } from "@/shared/store/store";
import { Button } from "@/shared/ui/Button";

export const AddSourceButton = () => {
  const { open } = useAddSourceDialog();
  const handleClick = () => {
    open();
  };
  return (
    <Button variant="solid" onClick={() => handleClick()}>
      + Источник
    </Button>
  );
};
