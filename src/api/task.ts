import { DOMAIN } from "@/constants";

export const BASE_URL = `https://${DOMAIN}/todos`;

export interface Task {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export type CreateTaskPayload = Omit<Task, "id">;
export type EditTaskPayload = Partial<Task> & { id: number };

/**
 * Get list of task for a User
 * @param userId User ID
 * @returns List of tasks
 */
export async function getTasks(userId: number): Promise<Task[]> {
  return (await (await fetch(`${BASE_URL}/user/${userId}`)).json()).todos;
}

/**
 * Creat task
 * @param task Task object
 * @returns The newly created task object from backend
 */
export async function createTask(task: CreateTaskPayload): Promise<Task> {
  return await (
    await fetch(`${BASE_URL}/add`, {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();
}

/**
 * Edit Task
 * @param id ID of the task to update
 * @param task An Oject containing id of the task and a partial Task object
 * @returns The newly updated task object from backend
 */
export async function editTask(task: EditTaskPayload): Promise<Task> {
  // Delete id from task object to prevent api error
  const payload = { ...task };
  // @ts-ignore
  delete payload.id;
  return await (
    await fetch(`${BASE_URL}/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();
}

/**
 * Edit Task
 * @param id ID of the task to delete
 * @returns ID of the task that has been deleted
 */
export async function deleteTask(id: number): Promise<number> {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return id;
}
