import { Router } from "express";
import { getPlayStats, resetPeriodicStats } from "../controller/play-stats.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Protected route only for admins
router.get("/play-stats", protectRoute, requireAdmin, getPlayStats);
router.post("/reset-stats", protectRoute, requireAdmin, resetPeriodicStats);

export default router;