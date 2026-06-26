import { Img, Eyebrow, Badge, DuePill, Reveal } from "../components/ui.jsx";
import { img, careOf, relDay, gardenStats } from "../lib.js";

export function PlantCard({ plant, onOpen, onWater }) {
  const c = careOf(plant);
  return (
    <div className="group rounded-4xl overflow-hidden bg-card border border-line shadow-soft lift">
      <button onClick={() => onOpen(plant)} className="block w-full text-left">
        <Img src={img(plant.kw, plant.seed, 700, 580)} alt={plant.species} ratio="5 / 4" />
      </button>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <button onClick={() => onOpen(plant)} className="text-left min-w-0">
            <h3 className="font-display text-lg font-bold leading-tight truncate">{plant.name}</h3>
            <div className="text-sm text-mute truncate">{plant.species}</div>
          </button>
          <DuePill care={c} relDay={relDay} />
        </div>
        <div className="flex items-center justify-between mt-3.5">
          <Badge icon="📍">{plant.room}</Badge>
          <button onClick={() => onWater(plant)} className="rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 px-3.5 py-1.5 text-sm font-semibold transition-colors">💧 Water</button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ n, label, tone = "" }) {
  return (
    <div className="bg-card border border-line rounded-4xl px-5 py-4 shadow-soft">
      <div className={`font-display text-3xl font-extrabold leading-none ${tone}`}>{n}</div>
      <div className="text-xs uppercase tracking-wider text-mute mt-1.5">{label}</div>
    </div>
  );
}

export default function Garden({ plants, onOpen, onWater, onAdd }) {
  const s = gardenStats(plants);
  const due = plants.filter((p) => careOf(p).due).sort((a, b) => careOf(a).daysUntil - careOf(b).daysUntil);

  return (
    <div className="space-y-12">
      {/* today hero */}
      <Reveal>
        <section className="rounded-5xl p-7 sm:p-10 shadow-soft" style={{ background: "linear-gradient(135deg,#235e33,#2f7d43 55%,#4c9a5a)" }}>
          <Eyebrow className="text-brand-100">Today in your garden</Eyebrow>
          {due.length > 0 ? (
            <>
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-paper mt-3 tracking-tight">{due.length} plant{due.length > 1 ? "s are" : " is"} thirsty.</h1>
              <p className="text-brand-100/90 mt-2 text-lg">A quick round with the watering can and you're done for the day.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-7">
                {due.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl p-2.5 pr-3">
                    <button onClick={() => onOpen(p)}><Img src={img(p.kw, p.seed, 120, 120)} alt="" className="w-12 h-12 rounded-xl shrink-0" /></button>
                    <button onClick={() => onOpen(p)} className="flex-1 min-w-0 text-left">
                      <div className="font-semibold text-paper truncate">{p.name}</div>
                      <div className="text-xs text-brand-100/80 truncate">{p.species}</div>
                    </button>
                    <button onClick={() => onWater(p)} className="rounded-full bg-paper text-brand-700 px-3 py-1.5 text-sm font-bold hover:bg-white transition-colors">💧</button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-paper mt-3 tracking-tight">All watered. 🌿</h1>
              <p className="text-brand-100/90 mt-2 text-lg">Every plant is happy. Check back tomorrow — nothing's due today.</p>
            </>
          )}
        </section>
      </Reveal>

      {/* stats */}
      <div className="grid grid-cols-3 gap-4">
        <MiniStat n={s.total} label="Plants" />
        <MiniStat n={s.due} label="Need water" tone={s.due ? "text-rose" : "text-brand-600"} />
        <MiniStat n={s.soon} label="Due this week" tone="text-clay" />
      </div>

      {/* garden grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl font-extrabold">Your garden</h2>
          <button onClick={onAdd} className="bg-ink text-paper rounded-full px-4 py-2 text-sm font-semibold hover:bg-brand-700 transition-colors">+ Add plant</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {plants.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 0.04}><PlantCard plant={p} onOpen={onOpen} onWater={onWater} /></Reveal>)}
        </div>
      </section>
    </div>
  );
}
