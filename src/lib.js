import { useEffect, useRef, useState } from "react";

export const img = (kw, seed, w = 800, h = 600) => `https://loremflickr.com/${w}/${h}/${kw}?lock=${seed}`;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY = 86400000;
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const today0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
export const todayISO = () => { const d = today0(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
export const fmtDate = (iso) => { const d = parse(iso); return `${MONTHS[d.getMonth()]} ${d.getDate()}`; };

export function careOf(plant) {
  const next = new Date(parse(plant.lastWatered).getTime() + plant.waterEvery * DAY);
  const daysUntil = Math.round((next - today0()) / DAY);
  return { next, daysUntil, due: daysUntil <= 0, overdue: daysUntil < 0 };
}

export function relDay(n) {
  if (n < 0) return `${-n} day${n === -1 ? "" : "s"} overdue`;
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  if (n <= 7) return `in ${n} days`;
  return `in ${n} days`;
}

export function waterPlant(plant) {
  const t = todayISO();
  const log = [t, ...(plant.log || []).filter((d) => d !== t)].slice(0, 30);
  return { ...plant, lastWatered: t, log };
}

export function gardenStats(plants) {
  let due = 0, soon = 0;
  plants.forEach((p) => { const c = careOf(p); if (c.due) due++; else if (c.daysUntil <= 7) soon++; });
  return { total: plants.length, due, soon, healthy: plants.length - due };
}

export function bucketBySchedule(plants) {
  const b = { now: [], tomorrow: [], week: [], later: [] };
  plants.forEach((p) => {
    const c = careOf(p);
    if (c.due) b.now.push(p);
    else if (c.daysUntil === 1) b.tomorrow.push(p);
    else if (c.daysUntil <= 7) b.week.push(p);
    else b.later.push(p);
  });
  const byDays = (a, z) => careOf(a).daysUntil - careOf(z).daysUntil;
  Object.values(b).forEach((arr) => arr.sort(byDays));
  return b;
}

export function useReveal(threshold = 0.14) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold });
    io.observe(el); return () => io.disconnect();
  }, [threshold]);
  return [ref, shown];
}
