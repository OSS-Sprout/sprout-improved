import { useEffect, useState } from "react";
import { todayISO, waterPlant } from "./lib.js";
import { fetchPlants, createPlant, updatePlant } from "./api.js";
import { ROOMS, LIGHT, DIFFICULTY } from "./data.js";
import Garden from "./views/Garden.jsx";
import Plant from "./views/Plant.jsx";
import Schedule from "./views/Schedule.jsx";

function useScrolled() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const f = () => setS(window.scrollY > 8);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return s;
}

function AddPlant({ onClose, onAdd }) {
  const [f, setF] = useState({ name: "", species: "", room: ROOMS[0], waterEvery: 7, light: "bright", difficulty: "easy", humidity: "Average" });
  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    const species = f.species.trim() || "Houseplant";
    onAdd({
      name: f.name.trim(), species, room: f.room,
      kw: species.toLowerCase().replace(/\s+/g, "-") + ",plant", seed: Math.floor(Math.random() * 90) + 1,
      waterEvery: Math.max(1, parseInt(f.waterEvery) || 7), light: f.light, humidity: f.humidity, difficulty: f.difficulty,
      lastWatered: todayISO(), log: [todayISO()], note: "", tips: [],
    });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-ink/40 backdrop-blur-sm" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="w-full max-w-md bg-card rounded-4xl p-7 shadow-lift animate-fadeUp">
        <h2 className="font-display text-2xl font-extrabold">Add a plant</h2>
        <p className="text-sm text-mute mt-1 mb-5">Welcome a new green friend to the garden.</p>
        <div className="space-y-3">
          <input autoFocus value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Nickname (e.g. Monty)" className="w-full rounded-2xl border border-line px-4 py-3 text-sm bg-paper focus:outline-none focus:border-brand-400" />
          <input value={f.species} onChange={(e) => setF({ ...f, species: e.target.value })} placeholder="Species (e.g. Monstera Deliciosa)" className="w-full rounded-2xl border border-line px-4 py-3 text-sm bg-paper focus:outline-none focus:border-brand-400" />
          <div className="flex gap-3">
            <select value={f.room} onChange={(e) => setF({ ...f, room: e.target.value })} className="flex-1 rounded-2xl border border-line px-3 py-3 text-sm bg-paper">{ROOMS.map((r) => <option key={r}>{r}</option>)}</select>
            <label className="flex items-center gap-2 text-sm text-mute rounded-2xl border border-line px-3 bg-paper">Water every<input type="number" min="1" value={f.waterEvery} onChange={(e) => setF({ ...f, waterEvery: e.target.value })} className="w-12 bg-transparent py-3 text-ink font-semibold" />d</label>
          </div>
          <div className="flex gap-3">
            <select value={f.light} onChange={(e) => setF({ ...f, light: e.target.value })} className="flex-1 rounded-2xl border border-line px-3 py-3 text-sm bg-paper">{Object.entries(LIGHT).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}</select>
            <select value={f.difficulty} onChange={(e) => setF({ ...f, difficulty: e.target.value })} className="flex-1 rounded-2xl border border-line px-3 py-3 text-sm bg-paper">{Object.entries(DIFFICULTY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-line py-2.5 text-sm font-medium text-mute hover:text-ink">Cancel</button>
          <button className="flex-1 rounded-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 text-sm font-semibold transition-colors">Add to garden</button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [plants, setPlants] = useState([]);
  const [view, setView] = useState("garden");
  const [currentId, setCurrentId] = useState(null);
  const [adding, setAdding] = useState(false);
  const scrolled = useScrolled();

  // 서버 통신 상태
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");

  // 1. 목록 불러오기 GET
  const load = async() => {
    setStatus("loading");
    try{
      const data = await fetchPlants();
      setPlants(data);
      setStatus("ready");
    } catch(e){
      setError(e.message);
      setStatus("error");
    }
  };
  useEffect(() => {load();}, []);

  // 2. 수정 저장 (PUT)
  const update = async(plant) => {
    try{
      const saved = await updatePlant(plant);
      setPlants((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    } catch(e){
      setSaveError(`저장에 실패했습니다: ${e.message}`);
    }
  }

  // 3. 물 주기: 물 준 상태로 바꾼 후에 2로 저장
  const water = (plant) => update(waterPlant(plant));

  // 4. 식물 추가 (POST)
  const add = async(plant) => {
    try{
      const created = await createPlant(plant);
      setPlants((prev) => [created, ...prev]);
    } catch(e){
      setSaveError(`식물 추가에 실패했습니다: ${e.message}`);
    }
  }

  const open = (plant) => { setCurrentId(plant.id); setView("plant"); window.scrollTo(0, 0); };
  const go = (v) => { setView(v); window.scrollTo(0, 0); };
  const current = plants.find((p) => p.id === currentId);

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`sticky top-0 z-30 transition-colors ${scrolled ? "bg-paper/90 backdrop-blur border-b border-line" : "bg-paper"}`}>
        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-[68px] flex items-center justify-between">
          <button onClick={() => go("garden")} className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-brand-600 grid place-items-center text-paper text-lg">🌿</span>
            <span className="font-display text-2xl font-extrabold tracking-tight">Sprout</span>
          </button>
          <nav className="flex items-center gap-1 sm:gap-2">
            {[["garden", "Garden"], ["schedule", "Schedule"]].map(([k, l]) => (
              <button key={k} onClick={() => go(k)} className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${view === k ? "text-brand-600" : "text-mute hover:text-ink"}`}>{l}</button>
            ))}
            <button onClick={() => setAdding(true)} className="ml-1 bg-ink text-paper rounded-full px-4 py-2 text-sm font-semibold hover:bg-brand-700 transition-colors">+ Add plant</button>
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-6xl w-full px-5 sm:px-8 py-10">
        {saveError && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl bg-rose/10 text-rose px-4 py-3 text-sm">
            <span>{saveError}</span>
            <button onClick={() => setSaveError("")} className="font-semibold">닫기</button>
          </div>
        )}
        
        {status === "loading" && <p className="text-center text-mute py-20">식물을 불러오는 중...</p>}

        {status === "error" && (
           <div className="text-center py-20">
            <p className="text-rose font-semibold">식물 목록을 불러오지 못했습니다.</p>
            <p className="text-sm text-mute mt-1">{error}</p>
            <button onClick={load} className="mt-4 rounded-full bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 text-sm font-semibold">다시 시도</button>
          </div>
        )}

        {status === "ready" && (
          <>
            {view === "garden" && <Garden plants={plants} onOpen={open} onWater={water} onAdd={() => setAdding(true)} />}
            {view === "schedule" && <Schedule plants={plants} onOpen={open} onWater={water} />}
            {view === "plant" && current && <Plant plant={current} onUpdate={update} onWater={water} onBack={() => go("garden")} />}
          </>
        )}
      </main>

      <footer className="border-t border-line mt-10">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-7 text-sm text-mute flex flex-wrap justify-between gap-2">
          <span className="font-display">Sprout — keep every plant thriving.</span>
        </div>
      </footer>

      {adding && <AddPlant onClose={() => setAdding(false)} onAdd={add} />}
    </div>
  );
}
