import express from "express";
const router = express.Router();
export default router;

import {
  createTask,
  deleteTaskById,
  getTaskById,
  getTasksByUserId,
} from "#db/queries/tasks";

import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

router
  .route("/")
  .get(requireUser, async (req, res) => {
    const tasks = await getTasksByUserId(req.user.id);
    res.send(tasks);
  })
  .post(requireUser, requireBody, async (req, res, next) => {
    if (!req.body) return res.status(400).send("Task not available.");
    const { title, done } = req.body;
    const task = await createTask(title, done, req.user.id);
    res.status(201).send(task);
  });

router.param("id", async (req, res, next, id) => {
  const task = await getTaskById(id);
  if (!task) return res.status(400).send("Task not available.");
  if (task.user_id !== req.user.id)
    return res.status(403).send("No tasks for user.");

  req.task = task;

  next();
});

router
  .route("/:id")
  .delete(async (req, res) => {
    await deleteTaskById(req.task.id);
    res.sendStatus(204);
  })

  .put(requireBody(["title", "done"]), async (req, res) => {
    const { title, done } = req.body;
    const task = await updateTaskById(title, done, req.params.id);
    res.send(task);
  });
