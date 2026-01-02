import { createRouter } from "next-connect";
import migrationsRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller";
const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandler);

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(req, res) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationsRunner({
      ...defaultMigrationOptions,
      dbClient,
    });
    return res.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(req, res) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migrateMigrations = await migrationsRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    if (migrateMigrations.length > 0) {
      return res.status(201).json(migrateMigrations);
    }

    return res.status(200).json(migrateMigrations);
  } finally {
    await dbClient.end();
  }
}
