import { describe, it, expect } from "vitest";
import { createTask, deleteTask, editTask, getTasks } from "../task";

describe("Task APIs", () => {
  it("Get tasks", async () => {
    const res = await getTasks(1);
    expect(res.length).greaterThan(0);
    expect(res[0]).toHaveProperty("completed");
    expect(res[0]).toHaveProperty("todo");
    expect(res[0]).toHaveProperty("userId");
    expect(res[0]).toHaveProperty("id");
  });

  it("Create Task", async () => {
    const payload = { completed: false, todo: "Hello", userId: 1 };
    const res = await createTask(payload);
    expect(res).toMatchObject(payload);
  });

  it("Update Task", async () => {
    const payload = { completed: true, id: 1 };
    const res = await editTask(payload);
    expect(res).toMatchObject(payload);
  });

  it("Delete Task", async () => {
    const res = await deleteTask(1);
    expect(res).toEqual(1);
  });
});
