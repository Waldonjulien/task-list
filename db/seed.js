import db from "#db/client";
import { createUser } from "./queries/user.js";
import { createTask } from "./queries/task.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user = await createUser("user6", "password123");
  for (let i = 1; i <= 5; ++i) {
    await createTask(`Task ${i}`, false, user.id);
  }
}
