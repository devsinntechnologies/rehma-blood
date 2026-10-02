import React from "react";
import { Construction } from "lucide-react";

/** Flags a screen whose data and actions aren't connected to the backend yet. */
export default function PreviewNotice({ children }: { children: React.ReactNode }) {
  return (
    <div role="note" className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[13px] text-amber-500">
      <Construction size={18} className="shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}
