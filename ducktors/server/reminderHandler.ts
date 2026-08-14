import type { Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { processDueReminderDeliveries } from "./reminderRunner";
export async function runAppointmentReminders(req: Request, res: Response) { try { const user = await sdk.authenticateRequest(req); if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" }); const result = await processDueReminderDeliveries(); return res.json({ ok: true, taskUid: user.taskUid, ...result }); } catch (error) { return res.status(500).json({ error: error instanceof Error ? error.message : "unknown-reminder-error", timestamp: new Date().toISOString(), context: { path: req.path } }); } }
