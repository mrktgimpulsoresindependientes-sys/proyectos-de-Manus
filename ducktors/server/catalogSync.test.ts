import { describe, expect, it } from "vitest";
import { staleSlotReconciliation } from "./catalogSync";
describe("reconciliación de disponibilidad Yellow Duxn", () => { it("bloquea todos los horarios previos cuando la fuente autorizada no devuelve ninguno", () => { expect(staleSlotReconciliation([])).toBe("all"); }); it("conserva sólo los horarios sincronizados cuando la fuente devuelve slots", () => { expect(staleSlotReconciliation(["slot-1"])).toBe("except-synced"); }); });
