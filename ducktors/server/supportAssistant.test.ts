import { describe, expect, it } from "vitest";
import { guidedSupportReply } from "./supportAssistant";
describe("asistente inicial de Ducktors", () => { it("orienta sobre reservas sin afirmar disponibilidad", () => { expect(guidedSupportReply("¿Cómo agendo una cita?")).toContain("Buscar profesionales"); }); it("deriva señales de emergencia sin emitir orientación clínica", () => { expect(guidedSupportReply("Tengo dolor de pecho y no puedo respirar")).toContain("emergencias"); }); });
