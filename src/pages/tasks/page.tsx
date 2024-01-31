import { TaskCard } from "./components/task-card";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Droppable } from "@/components/ui/dropable";
import { Draggable } from "@/components/ui/draggable";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetTasks, useEditTask, useCreateTask } from "@/hooks/useTasks";
import { Task } from "@/api/task";
import { CreateTaskDialog, SaveOutput } from "./components/create-task-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MouseSensor } from "@/lib/utils";

export function Tasks() {
  const [incompleteList, setIncompleteList] = useState<Task[]>([]);
  const [completeList, setCompleteList] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { data: tasks } = useGetTasks(1);
  const { mutateAsync: editTask } = useEditTask();
  const { mutateAsync: createTask } = useCreateTask();

  // Split the tasks into their buckets
  useEffect(() => {
    if (tasks) {
      const incompleteTasks: Task[] = [];
      const completeTasks: Task[] = [];

      for (let i = 0; i < tasks.length; i++) {}

      tasks.forEach((task) => {
        if (task.completed) {
          completeTasks.push(task);
        } else {
          incompleteTasks.push(task);
        }
      });
      setCompleteList(completeTasks);
      setIncompleteList(incompleteTasks);
    }
  }, [tasks]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id.toString());
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const split = event.over?.id.toString().split("-")!;

    if (split) {
      // Find source and destination
      const destSide = split[0] === "true";
      const destIndex = +split[1];
      const srcSide =
        tasks![tasks?.findIndex((task) => task.id === +event.active.id)!]
          .completed;
      const srcIndex = srcSide
        ? completeList.findIndex((task) => task.id === +event.active.id)
        : incompleteList.findIndex((task) => task.id === +event.active.id);
      const taskBeingMoved = tasks?.find(
        (task) => task.id === +event.active.id
      )!;
      taskBeingMoved.completed = destSide;

      // Remove from source
      if (srcSide) {
        setCompleteList((prev) => {
          const copy = [...prev];
          copy.splice(srcIndex, 1);
          return copy;
        });
      } else {
        setIncompleteList((prev) => {
          const copy = [...prev];
          copy.splice(srcIndex, 1);
          return copy;
        });
      }

      // Add to dest
      if (destSide) {
        setCompleteList((prev) => {
          const copy = [...prev];
          copy.splice(destIndex, 0, taskBeingMoved);
          return copy;
        });
      } else {
        setIncompleteList((prev) => {
          const copy = [...prev];
          copy.splice(destIndex, 0, taskBeingMoved);
          return copy;
        });
      }
      editTask({ id: taskBeingMoved.id, completed: destSide });
    }
  }

  function handleCreateTask(task: SaveOutput) {
    delete task.id;
    createTask(task);
  }

  // Render a column
  function renderBucket(completed: boolean) {
    const list = completed ? completeList : incompleteList;

    return (
      <ScrollArea>
        <div className="flex flex-col gap-2  h-[calc(100vh-70px)] grow-1">
          {list.map((task, index) => (
            <div key={task.id}>
              <Droppable id={`${completed.toString()}-${index}`}>
                <div className="h-1"></div>
              </Droppable>
              <Draggable key={task.id} id={task.id.toString()}>
                <div style={{ opacity: task.id === +activeId! ? 0 : 1 }}>
                  <TaskCard task={task} />
                </div>
              </Draggable>
              {index === list.length - 1 ? (
                <Droppable id={`${completed.toString()}-${index + 1}`}>
                  <div className="h-1"></div>
                </Droppable>
              ) : null}
            </div>
          ))}
          {list.length === 0 ? (
            <Droppable id={`${completed.toString()}-${0}`}>
              <div className="h-1"></div>
            </Droppable>
          ) : null}
        </div>
      </ScrollArea>
    );
  }

  // Allows buttons to work inside draggable components and also only
  // start dragging after 1 pixel of movement
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <DragOverlay>
        {activeId ? (
          <TaskCard task={tasks?.find((task) => task.id === +activeId)!} />
        ) : null}
      </DragOverlay>
      <div className="max-w-[800px] mx-auto pt-12 h-full">
        <div className="flex w-full justify-center gap-10 h-full">
          <div className="w-full">
            <div className="flex flex-col h-full">
              <div className="uppercase text-sm font-bold text-muted-foreground shink-0">
                Incomplete
              </div>
              {renderBucket(false)}
            </div>
          </div>
          <div className="w-full ">
            <div className="flex flex-col h-full">
              <div className="uppercase text-sm font-bold text-muted-foreground shrink-0">
                Complete
              </div>
              {renderBucket(true)}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed right-2 bottom-2">
        <CreateTaskDialog
          trigger={<Button>Create Task</Button>}
          mode="CREATE"
          onSave={handleCreateTask}
        />
      </div>
    </DndContext>
  );
}
