import { useState } from "react";
import { useReveal } from "../lib.js";

export function Reveal({ children, delay = 0, className = "" }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} className={className}
      style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(18px)", transition: `opacity .7s cubic-bezier(.2,.7,.2,1) ${delay}s, transform .7s cubic-bezier(.2,.7,.2,1) ${delay}s` }}>
      {children}
    </div>
  );
}

export function Eyebrow({ children, className = "" }) {
  return <div className={`text-[11px] font-semibold uppercase tracking-[.24em] text-brand-600 ${className}`}>{children}</div>;
}

export function Img({ src, alt = "", className = "", ratio }) {
  const [on, setOn] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-brand-100/60 ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      <img src={src} alt={alt} loading="lazy" onLoad={() => setOn(true)}
        className={`w-full h-full object-cover img-fade ${on ? "on" : ""}`} />
    </div>
  );
}

export function Chip({ children, className = "" }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}

export function Badge({ icon, children, className = "" }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-ink/80 ${className}`}>{icon && <span>{icon}</span>}{children}</span>;
}

export function Bar({ pct, color = "#2f7d43", track = "#e2dfd0", className = "" }) {
  return (
    <div className={`h-2 rounded-full overflow-hidden ${className}`} style={{ background: track }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
    </div>
  );
}

// A water-due pill that colours by urgency.
export function DuePill({ care, relDay }) {
  const tone = care.overdue ? "bg-rose/12 text-rose" : care.due ? "bg-brand-600 text-paper" : care.daysUntil <= 2 ? "bg-sun/20 text-clay" : "bg-paper text-mute";
  return <Chip className={tone}><span>💧</span>{relDay(care.daysUntil)}</Chip>;
}
