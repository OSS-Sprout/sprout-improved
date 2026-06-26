import { Img, Eyebrow, DuePill, Reveal } from "../components/ui.jsx";
import { img, careOf, relDay, bucketBySchedule, gardenStats } from "../lib.js";

function Row({ plant, onOpen, onWater }) {
  const c = careOf(plant);
  return (
    <div className="flex items-center gap-4 bg-card border border-line rounded-2xl p-3 shadow-soft">
      <button onClick={() => onOpen(plant)} className="shrink-0"><Img src={img(plant.kw, plant.seed, 140, 140)} alt="" className="w-14 h-14 rounded-xl" /></button>
      <button onClick={() => onOpen(plant)} className="flex-1 text-left min-w-0">
        <div className="font-semibold truncate">{plant.name} <span className="text-mute font-normal">· {plant.species}</span></div>
        <div className="text-sm text-mute truncate">{plant.room} · every {plant.waterEvery} days</div>
      </button>
      <DuePill care={c} relDay={relDay} />
      <button onClick={() => onWater(plant)} className="rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 px-3.5 py-1.5 text-sm font-semibold transition-colors shrink-0">💧 Water</button>
    </div>
  );
}

function Section({ title, hint, plants, onOpen, onWater, accent }) {
  if (!plants.length) return null;
  return (
    <Reveal>
      <section>
        <div className="flex items-baseline gap-3 mb-3">
          <h2 className="font-display text-2xl font-extrabold flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />{title}</h2>
          <span className="text-mute">{plants.length}</span>
          {hint && <span className="text-sm text-mute ml-auto">{hint}</span>}
        </div>
        <div className="space-y-2.5">
          {plants.map((p) => <Row key={p.id} plant={p} onOpen={onOpen} onWater={onWater} />)}
        </div>
      </section>
    </Reveal>
  );
}

export default function Schedule({ plants, onOpen, onWater }) {
  const b = bucketBySchedule(plants);
  const s = gardenStats(plants);

  return (
    <div className="space-y-10">
      <header className="pt-4">
        <Eyebrow>Care schedule</Eyebrow>
        <h1 className="font-display text-5xl sm:text-6xl font-extrabold mt-4 tracking-tight">Never miss a watering.</h1>
        <p className="text-mute mt-4 text-lg max-w-xl">Everything that needs you, sorted by when. Tap 💧 the moment you've watered and the whole schedule re-sorts itself.</p>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {[["Plants", s.total, ""], ["Need water now", s.due, s.due ? "text-rose" : "text-brand-600"], ["Due this week", s.soon, "text-clay"]].map(([l, n, tone]) => (
          <div key={l} className="bg-card border border-line rounded-4xl px-5 py-4 shadow-soft">
            <div className={`font-display text-3xl font-extrabold leading-none ${tone}`}>{n}</div>
            <div className="text-xs uppercase tracking-wider text-mute mt-1.5">{l}</div>
          </div>
        ))}
      </div>

      {b.now.length === 0 && (
        <div className="bg-brand-50 border border-brand-100 rounded-4xl p-6 text-center">
          <div className="font-display text-2xl font-extrabold text-brand-700">Nothing due right now 🌿</div>
          <p className="text-brand-700/70 mt-1">Your whole garden is hydrated. Enjoy the calm.</p>
        </div>
      )}

      <div className="space-y-9">
        <Section title="Needs water now" hint="overdue & due today" plants={b.now} onOpen={onOpen} onWater={onWater} accent="#b1442f" />
        <Section title="Tomorrow" plants={b.tomorrow} onOpen={onOpen} onWater={onWater} accent="#c47a4e" />
        <Section title="This week" plants={b.week} onOpen={onOpen} onWater={onWater} accent="#e0b13c" />
        <Section title="Later" plants={b.later} onOpen={onOpen} onWater={onWater} accent="#2f7d43" />
      </div>
    </div>
  );
}
