import type { ReactNode } from "react";
import { DucktorsFooter } from "./DucktorsFooter";
import { FloatingSupportAssistant } from "./FloatingSupportAssistant";
import { DucktorsHeader } from "./DucktorsHeader";
export function DucktorsPage({ children }: { children: ReactNode }) { return <div className="flex min-h-screen flex-col bg-[#fbfdff] text-slate-900"><DucktorsHeader /><main>{children}</main><DucktorsFooter /><FloatingSupportAssistant /></div>; }
