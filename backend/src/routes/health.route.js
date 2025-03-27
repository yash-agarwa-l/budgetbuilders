import express from "express";
import sequelize from "../db/db.js";

const router = express.Router();

/** Liveness: the process is up. Must not touch dependencies. */
router.get("/", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

/** Readiness: the process can serve traffic, database included. */
router.get("/ready", async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: "ready", database: "up" });
  } catch {
    res.status(503).json({ status: "unavailable", database: "down" });
  }
});

export default router;
