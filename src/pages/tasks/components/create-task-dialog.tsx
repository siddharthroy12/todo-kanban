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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";

export type SaveOutput = Omit<Task, "id"> & { id?: number };

type CreateTaskDialogProps = {
  trigger: React.ReactNode;
  mode: "CREATE" | "UPDATE";
  onSave: (task: SaveOutput) => void;
  initialData?: Task;
};

export function CreateTaskDialog({
  trigger,
  mode,
  onSave,
  initialData,
}: CreateTaskDialogProps) {
  const [name, setName] = useState(initialData ? initialData.todo : "");
  const [completed, setCompleted] = useState(
    initialData ? initialData.completed : false
  );

  function onSubmit() {
    onSave({
      todo: name,
      completed,
      userId: 1, // Hardcoded because no auth is setup
      id: mode !== "CREATE" ? (initialData ? initialData.id : 0) : undefined,
    });
  }

  function onOpenChange(open: boolean) {
    if (open) {
      setName(initialData ? initialData.todo : "");
      setCompleted(initialData ? initialData.completed : false);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "CREATE" ? "Create" : "Edit"} task
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="completed" className="text-right">
              Completed
            </Label>
            <Switch
              id="completed"
              checked={completed}
              onCheckedChange={(e) => setCompleted(e)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              onClick={onSubmit}
              disabled={name.trim().length === 0}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
