import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, editTask, deleteTask, Task } from "@/api/task";

const key = "task";

export const useGetTasks = (userId: number) => {
  const getTaskList = useQuery({
    queryKey: [key],
    queryFn: async () => {
      return await getTasks(userId);
    },
  });

  return getTaskList;
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSettled: () => {
      // Reload tasks after API call
      // queryClient.invalidateQueries({ queryKey: [key] });
    },
    onMutate: (task) => {
      // Generate random id for optimistic update which will be set to the correct one after re-validation
      // @ts-ignore
      task.id = Math.ceil(Math.random() * 1000);

      const previous = queryClient.getQueryData([key]);

      queryClient.setQueryData([key], (prev: Task[] | undefined) => {
        if (prev) {
          return [...prev, task];
        } else {
          return [task];
        }
      });

      return { previous };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData([key], context.previous);
      }
    },
  });
};

export const useEditTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editTask,
    onMutate: (task) => {
      const previous = queryClient.getQueryData([key]);

      // Optimistically update tasks list
      queryClient.setQueryData([key], (prev: Task[] | undefined) => {
        const copy = JSON.parse(JSON.stringify(prev));
        const index = prev?.findIndex((t) => t.id === task.id) ?? 0;
        if (prev === undefined) {
          return [task];
        } else {
          copy[index] = { ...prev[index], ...task };
        }
        return copy;
      });

      return { previous };
    },
    onSettled: () => {
      // Reload tasks after API call
      // queryClient.invalidateQueries({ queryKey: [key] });
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData([key], context.previous);
      }
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onMutate: (id) => {
      // Optimistically update tasks list
      queryClient.setQueryData([key], (prev: Task[] | undefined) => {
        const copy = JSON.parse(JSON.stringify(prev));

        const index = prev?.findIndex((t) => t.id === id) ?? 0;
        if (prev === undefined) {
          return [];
        } else {
          copy.splice(index, 1);
        }
        return copy;
      });
    },
    onSettled: () => {
      // Reload tasks after API call
      // queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
};
