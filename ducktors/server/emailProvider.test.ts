import { describe, expect, it, vi } from "vitest";
import { sendTransactionalEmail } from "./emailProvider";
describe("adaptador de correo", () => { it("permanece bloqueado sin proveedor configurado", async () => { await expect(sendTransactionalEmail({ to: "persona@example.com", subject: "Prueba", text: "Mensaje" }, vi.fn() as never)).rejects.toThrow("no está configurado"); }); });
