import express from "express";
const router = express.Router();
export default router;
import {
  createTask,
  deleteTaskById,
  getTaskById,
  getTasksByUserId,
} from "#db/queries/task.js";
import requireBody from "#middleware/requireBody.js";
import requireUser from "#middleware/requireUser.js";

router
  .route("/")
  .get(requireUser, async (req, res) => {
    const tasks = await getTasksByUserId(req.user.id);
    res.send(tasks);
  })
  .post(requireUser, requireBody, ["title", "done"], async (req, res) => {
    if (!req.body) return res.status(400).send("Task not available.");
    const { title, done } = req.body;
    const task = await createTask(title, done, req.user.id);
    res.status(201).sent(task);
  });

router.param("id", async (req, res, next, id) => {
  const task = await getTaskById(id);
  if (!task) return res.status(400).send("Task not available.");
  if (task.user_id !== req.user.id)
    return res.status(403).send("No tasks for user.");

  req.task = task;

  next();
});

router.route("/:id").delete(async (req, res) => {
  await deleteTaskById(req.task.id);
  res.sendStatus(204);
});

router.route("/:id").put(requireBody[("title", "done")], async (req, req) => {
  const { title, done } = req.body;
  const task = await updateTaskById(title, done, req.user.id);
  res.send(task);
});
