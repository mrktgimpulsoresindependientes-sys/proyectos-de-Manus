import { describe, expect, it } from "vitest";
import { APPOINTMENT_REMINDER_CRON, APPOINTMENT_REMINDER_PATH } from "./reminderSchedule";
describe("programación de recordatorios", () => { it("usa un cron UTC de seis campos y un callback permitido", () => { expect(APPOINTMENT_REMINDER_CRON.split(" ")).toHaveLength(6); expect(APPOINTMENT_REMINDER_PATH.startsWith("/api/scheduled/")).toBe(true); }); });
