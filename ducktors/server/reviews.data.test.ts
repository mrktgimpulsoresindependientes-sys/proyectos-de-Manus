import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({ getDb: vi.fn() }));

import { getDb } from "./db";
import { createPatientReview, listEligibleReviewAppointments } from "./healthDb";

const mockedGetDb = vi.mocked(getDb);
const appointment = { id: 42, patientUserId: 7, professionalId: 12, state: "completed" };
const limitChain = (rows: unknown[]) => ({ from: () => ({ where: () => ({ limit: async () => rows }) }) });

describe("persistencia de opiniones", () => {
  beforeEach(() => vi.clearAllMocks());

  it("guarda una opinión pendiente sólo para una cita completada del paciente", async () => {
    const values = vi.fn().mockResolvedValue(undefined);
    const db = { select: vi.fn().mockReturnValueOnce(limitChain([appointment])).mockReturnValueOnce(limitChain([])), insert: vi.fn(() => ({ values })) };
    mockedGetDb.mockResolvedValue(db as never);

    const result = await createPatientReview({ patientUserId: 7, appointmentId: 42, rating: 5, body: "Atención clara." });

    expect(result.allowed).toBe(true);
    expect(db.insert).toHaveBeenCalledTimes(1);
    expect(values).toHaveBeenCalledWith(expect.objectContaining({ appointmentId: 42, patientUserId: 7, professionalId: 12, rating: 5, state: "pending" }));
  });

  it("no guarda una segunda opinión para la misma cita", async () => {
    const insert = vi.fn();
    const db = { select: vi.fn().mockReturnValueOnce(limitChain([appointment])).mockReturnValueOnce(limitChain([{ id: 1 }])), insert };
    mockedGetDb.mockResolvedValue(db as never);

    const result = await createPatientReview({ patientUserId: 7, appointmentId: 42, rating: 4 });

    expect(result).toMatchObject({ allowed: false, reason: "Ya existe una opinión asociada a esta cita." });
    expect(insert).not.toHaveBeenCalled();
  });

  it("lista sólo las citas completadas aún no valoradas para un profesional", async () => {
    const eligible = [{ appointmentId: 42, startsAt: new Date("2026-08-10T10:00:00Z") }];
    const db = { select: vi.fn(() => ({ from: () => ({ leftJoin: () => ({ where: () => ({ orderBy: async () => eligible }) }) }) })) };
    mockedGetDb.mockResolvedValue(db as never);

    await expect(listEligibleReviewAppointments(7, 12)).resolves.toEqual(eligible);
  });
});
