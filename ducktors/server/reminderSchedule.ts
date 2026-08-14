import { eq } from "drizzle-orm";
import { automationJobs } from "../drizzle/schema";
import { getDb } from "./db";
import { createHeartbeatJob } from "./_core/heartbeat";

export const APPOINTMENT_REMINDER_JOB_KEY = "appointment-reminders";
export const APPOINTMENT_REMINDER_CRON = "0 0 * * * *";
export const APPOINTMENT_REMINDER_PATH = "/api/scheduled/appointment-reminders";
export async function getAppointmentReminderSchedule() { const db = await getDb(); if (!db) return null; const [job] = await db.select().from(automationJobs).where(eq(automationJobs.jobKey, APPOINTMENT_REMINDER_JOB_KEY)).limit(1); return job ?? null; }
export async function createAppointmentReminderSchedule(sessionToken: string) { const existing = await getAppointmentReminderSchedule(); if (existing) return { taskUid: existing.taskUid, nextExecutionAt: null, created: false }; const job = await createHeartbeatJob({ name: "ducktors-appointment-reminders", cron: APPOINTMENT_REMINDER_CRON, path: APPOINTMENT_REMINDER_PATH, description: "Procesa confirmaciones y recordatorios de citas Ducktors." }, sessionToken); const db = await getDb(); if (!db) throw new Error("La base de datos no está disponible."); await db.insert(automationJobs).values({ jobKey: APPOINTMENT_REMINDER_JOB_KEY, taskUid: job.taskUid, cron: APPOINTMENT_REMINDER_CRON }); return { ...job, created: true }; }
