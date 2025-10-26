import express from "express";
import { createUser, getUserByUserNameAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
const router = express.Router();
export default router;

router
  .route("/register")
  .post(requireBody(["username", "password"]), async (req, res) => {
    if (!req.body) {
      return res.status(400).send("body needed");
    }
    const { username, password } = req.body;
    const user = await createUser(username, password);
    const token = createToken({ id: user.id });

    res.status(201).send({ token });
  });

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;

    const user = await getUserByUserNameAndPassword(username, password);
    if (!user) return res.status(401).send("invalid username or password.");

    const token = createToken({ id: user.id });
    res.send({ token });
  });
