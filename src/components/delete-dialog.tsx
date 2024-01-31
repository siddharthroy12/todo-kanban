import { Task } from "@/api/task";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DialogClose } from "@radix-ui/react-dialog";

export type SaveOutput = Omit<Task, "id"> & { id?: number };

type DeleteDialogProps = {
  trigger: React.ReactNode;
  onConfirm: () => void;
  content: string;
};

export function DeleteDialog({
  trigger,
  onConfirm,
  content,
}: DeleteDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
        </DialogHeader>
        <p className="pt-5">{content}</p>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" variant="destructive" onClick={onConfirm}>
              Yes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
