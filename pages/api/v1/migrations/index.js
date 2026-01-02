import { createRouter } from "next-connect";
import controller from "infra/controller.js";
const router = createRouter();
import migrator from "models/migrator.js";

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandler);

async function getHandler(req, res) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return res.status(200).json(pendingMigrations);
}

async function postHandler(req, res) {
  const migrateMigrations = await migrator.runPendingMigrations();

  if (migrateMigrations.length > 0) {
    return res.status(201).json(migrateMigrations);
  }

  return res.status(200).json(migrateMigrations);
}
