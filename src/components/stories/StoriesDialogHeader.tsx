import { DialogHeader, DialogTitle } from "../ui/dialog";

interface StoriesDialogHeaderProps {
  onClose?: () => void;
}

export const StoriesDialogHeader = ({ onClose }: StoriesDialogHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold">Your Stories</DialogTitle>
    </DialogHeader>
  );
};