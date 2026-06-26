import { useState, useEffect } from "react";
import { Img, Eyebrow, Badge, Bar, DuePill } from "../components/ui.jsx";
import { LIGHT, DIFFICULTY } from "../data.js";
import { img, careOf, relDay, fmtDate } from "../lib.js";

export default function Plant({ plant, onUpdate, onWater, onBack }) {
  const [note, setNote] = useState(plant.note || "");
  const [saved, setSaved] = useState(false);
  useEffect(() => { setNote(plant.note || ""); }, [plant.id]);

  const c = careOf(plant);
  const daysSince = plant.waterEvery - c.daysUntil;
  const thirst = Math.min(100, Math.max(0, Math.round((daysSince / plant.waterEvery) * 100)));
  const diff = DIFFICULTY[plant.difficulty] || DIFFICULTY.easy;
  const light = LIGHT[plant.light] || LIGHT.bright;
  const saveNote = () => { onUpdate({ ...plant, note }); setSaved(true); setTimeout(() => setSaved(false), 1500); };

  return (
    <div className="space-y-12">
      <button onClick={onBack} className="text-sm text-mute hover:text-ink transition-colors">← Back to garden</button>

      <div className="grid md:grid-cols-[360px_1fr] gap-10 items-start">
        {/* photo */}
        <div className="md:sticky md:top-24">
          <Img src={img(plant.kw, plant.seed, 900, 1000)} alt={plant.species} ratio="9 / 10" className="rounded-5xl shadow-lift" />
          <button onClick={() => onWater(plant)} className="mt-4 w-full rounded-full bg-brand-600 hover:bg-brand-700 text-paper py-3.5 font-semibold text-lg transition-colors shadow-soft">💧 Water now</button>
        </div>

        {/* info */}
        <div>
          <div className="flex items-center gap-3">
            <Eyebrow>{plant.room}</Eyebrow>
            <DuePill care={c} relDay={relDay} />
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-extrabold mt-3 tracking-tight">{plant.name}</h1>
          <p className="text-xl text-mute mt-1 italic">{plant.species}</p>

          {/* thirst meter */}
          <div className="mt-7 bg-card border border-line rounded-4xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <Eyebrow>Soil moisture</Eyebrow>
              <span className="text-sm text-mute">{c.due ? "Needs water" : `Watered ${daysSince}d ago · next ${relDay(c.daysUntil).toLowerCase()}`}</span>
            </div>
            <Bar pct={100 - thirst} color={c.overdue ? "#b1442f" : c.due ? "#c47a4e" : "#2f7d43"} className="h-3" />
            <div className="flex justify-between text-xs text-mute mt-1.5"><span>Thirsty</span><span>Just watered</span></div>
          </div>

          {/* care facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <Fact k="Water" v={`Every ${plant.waterEvery}d`} icon="💧" />
            <Fact k="Light" v={light.label} icon={light.icon} />
            <Fact k="Humidity" v={plant.humidity} icon="💨" />
            <Fact k="Care" v={diff.label} dot={diff.color} />
          </div>

          {/* tips */}
          {plant.tips?.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold mb-3">Care tips</h2>
              <ul className="space-y-2">
                {plant.tips.map((t, i) => (
                  <li key={i} className="flex gap-3 bg-card border border-line rounded-2xl p-3.5 shadow-soft"><span className="text-brand-600">🌱</span><span className="text-sm">{t}</span></li>
                ))}
              </ul>
            </div>
          )}

          {/* note */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-xl font-bold">My notes</h2>
              {saved && <span className="text-xs text-brand-600">✓ Saved</span>}
            </div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} onBlur={saveNote} rows={3}
              placeholder="New growth, repotting plans, where it likes to sit…"
              className="w-full rounded-4xl border border-line bg-card px-5 py-4 text-[15px] leading-relaxed shadow-soft focus:outline-none focus:border-brand-400 resize-none" />
          </div>

          {/* watering log */}
          <div className="mt-8">
            <h2 className="font-display text-xl font-bold mb-3">Watering history</h2>
            <div className="flex flex-wrap gap-2">
              {(plant.log || []).map((d, i) => (
                <Badge key={i} className={i === 0 ? "ring-1 ring-brand-200" : ""} icon="💧">{fmtDate(d)}</Badge>
              ))}
              {(plant.log || []).length === 0 && <span className="text-sm text-mute">No waterings logged yet.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fact({ k, v, icon, dot }) {
  return (
    <div className="bg-card border border-line rounded-2xl p-3.5 shadow-soft">
      <div className="text-xs uppercase tracking-wider text-mute flex items-center gap-1.5">{dot ? <span className="w-2 h-2 rounded-full" style={{ background: dot }} /> : <span>{icon}</span>}{k}</div>
      <div className="font-display font-bold mt-1 leading-tight">{v}</div>
    </div>
  );
}
