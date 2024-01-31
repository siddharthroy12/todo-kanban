import { useDroppable } from "@dnd-kit/core";

type DroppablePops = {
  id: string;
  children: React.ReactNode;
};

export function Droppable(props: DroppablePops) {
  const { isOver, setNodeRef, active } = useDroppable({
    id: props.id,
  });
  const style = {
    background: isOver ? "green" : "red",
    opacity: active ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="duration-200">
      {props.children}
    </div>
  );
}
