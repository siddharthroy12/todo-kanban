import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "@/api/task";
import { LinkIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog, SaveOutput } from "./create-task-dialog";
import { useEditTask, useDeleteTask } from "@/hooks/useTasks";
import { DeleteDialog } from "@/components/delete-dialog";

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const { mutateAsync: editTask } = useEditTask();
  function onUpdate(task: SaveOutput) {
    if (task.id !== undefined) {
      editTask({ ...task, id: task.id! });
    }
  }
  const { mutateAsync: deleteTask } = useDeleteTask();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.todo}</CardTitle>
        <CardDescription>12th Jan - Created by Prahlad</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 text-muted-foreground">
          {" "}
          <LinkIcon className="w-[16px]" />
          main.psd
        </div>
        <Badge variant="secondary" className="p-2 rounded-md mt-5">
          Design
        </Badge>
      </CardContent>
      <CardFooter className="gap-2">
        <DeleteDialog
          content={task.todo}
          onConfirm={() => {
            deleteTask(task.id);
          }}
          trigger={
            <Button variant="destructive" size={"sm"}>
              Delete
            </Button>
          }
        />

        <CreateTaskDialog
          mode="UPDATE"
          onSave={onUpdate}
          initialData={task}
          trigger={
            <Button
              variant="outline"
              size={"sm"}
              onClick={(e) => e.stopPropagation()}
            >
              Edit
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
