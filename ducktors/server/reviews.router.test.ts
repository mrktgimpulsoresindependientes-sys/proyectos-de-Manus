import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(user: TrpcContext["user"]): TrpcContext { return { user, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] }; }

describe("router de opiniones", () => {
  it("protege la consulta de citas elegibles cuando no hay sesión", async () => {
    const caller = appRouter.createCaller(context(null));
    await expect(caller.reviews.eligibleAppointments({ professionalId: 12 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("valida el rango de la valoración antes de invocar la persistencia", async () => {
    const caller = appRouter.createCaller(context({ id: 7, openId: "patient", email: "patient@example.com", name: "Paciente", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }));
    await expect(caller.reviews.submit({ appointmentId: 42, rating: 6 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
