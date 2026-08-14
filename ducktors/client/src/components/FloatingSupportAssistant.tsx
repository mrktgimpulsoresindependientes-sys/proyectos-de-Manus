import { AIChatBox, type Message } from "@/components/AIChatBox";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { BotMessageSquare, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const initialMessages: Message[] = [{ role: "assistant", content: "Hola, soy el asistente de Ducktors. Puedo orientarte sobre **agendar una cita** o **registrar un consultorio**." }];

export function FloatingSupportAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const ask = trpc.support.ask.useMutation({
    onSuccess: data => setMessages(previous => [...previous, { role: "assistant", content: data.answer }]),
    onError: () => toast.error("No fue posible responder en este momento. Intenta nuevamente."),
  });
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, []);
  const send = (content: string) => { setMessages(previous => [...previous, { role: "user", content }]); ask.mutate({ message: content }); };
  return <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
    {open && <section id="ducktors-floating-assistant" role="dialog" aria-modal="false" aria-label="Asistente de ayuda Ducktors" className="w-[calc(100vw-2rem)] overflow-hidden rounded-[1.5rem] border border-sky-100 bg-white shadow-[0_24px_70px_rgba(9,46,102,.3)] sm:w-[380px]"><header className="flex items-center justify-between bg-cobalt-950 px-5 py-4 text-white"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-sky-300 text-cobalt-950"><BotMessageSquare className="size-5" /></span><div><h2 className="font-display text-base font-bold">Ayuda Ducktors</h2><p className="text-xs text-sky-200">Orientación no clínica</p></div></div><Button aria-label="Cerrar asistente" variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)}><X className="size-5" /></Button></header><div className="p-2"><AIChatBox messages={messages} onSendMessage={send} isLoading={ask.isPending} height="420px" placeholder="Escribe una duda operativa..." suggestedPrompts={["¿Cómo agendo una cita?", "¿Cómo registro mi consultorio?"]} /></div><p className="border-t border-sky-100 px-5 py-3 text-xs leading-5 text-slate-500">No ofrece diagnósticos, atención de urgencias ni confirma disponibilidad clínica.</p></section>}
    <Button aria-expanded={open} aria-controls="ducktors-floating-assistant" aria-label={open ? "Cerrar asistente de ayuda" : "Abrir asistente de ayuda"} onClick={() => setOpen(value => !value)} className="h-14 rounded-full bg-cobalt-700 px-5 font-bold shadow-[0_12px_28px_rgba(31,94,188,.38)] hover:bg-cobalt-800"><MessageCircle className="mr-2 size-5" />{open ? "Cerrar ayuda" : "¿Necesitas ayuda?"}</Button>
  </div>;
}
