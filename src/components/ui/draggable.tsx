import React from "react";
import { useDraggable } from "@dnd-kit/core";

type DraggbleProps = {
  id: string;
  children: React.ReactNode;
};

export function Draggable(props: DraggbleProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.id,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}
