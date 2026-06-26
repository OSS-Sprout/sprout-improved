// Care metadata badges.
export const LIGHT = {
  bright: { label: "Bright indirect", icon: "🌤" },
  direct: { label: "Direct sun", icon: "☀️" },
  low:    { label: "Low light", icon: "🌥" },
};
export const DIFFICULTY = {
  easy:     { label: "Easy", color: "#2f7d43" },
  moderate: { label: "Moderate", color: "#c47a4e" },
  fussy:    { label: "Fussy", color: "#b1442f" },
};
export const ROOMS = ["Living room", "Bedroom", "Kitchen", "Office", "Bathroom"];

// Seed garden. lastWatered chosen relative to 2026-06-27 to spread due dates.
export const SEED_PLANTS = [
  { id: "pl1", name: "Marble Queen", species: "Pothos", room: "Living room", kw: "pothos,houseplant", seed: 11, waterEvery: 6, light: "bright", humidity: "Average", difficulty: "easy", lastWatered: "2026-06-20", log: ["2026-06-20","2026-06-14","2026-06-08"], note: "Trailing happily off the shelf. Trim the longest vine soon.", tips: ["Let the top inch of soil dry out between waters.", "Tolerates low light but grows faster in bright indirect."] },
  { id: "pl2", name: "Monty", species: "Monstera Deliciosa", room: "Living room", kw: "monstera,plant", seed: 4, waterEvery: 7, light: "bright", humidity: "High", difficulty: "easy", lastWatered: "2026-06-20", log: ["2026-06-20","2026-06-13","2026-06-06"], note: "New fenestrated leaf unfurling! Rotate weekly.", tips: ["Wipe leaves monthly so it can breathe.", "Give it a moss pole to climb."] },
  { id: "pl3", name: "Luna", species: "Peace Lily", room: "Bedroom", kw: "peace-lily,plant", seed: 7, waterEvery: 5, light: "low", humidity: "High", difficulty: "moderate", lastWatered: "2026-06-22", log: ["2026-06-22","2026-06-17","2026-06-12"], note: "Droops dramatically when thirsty — a helpful alarm.", tips: ["Mist often; it loves humidity.", "Brown tips mean tap-water minerals — try filtered."] },
  { id: "pl4", name: "Sunny", species: "Fiddle Leaf Fig", room: "Office", kw: "fiddle-leaf-fig,plant", seed: 19, waterEvery: 7, light: "bright", humidity: "Average", difficulty: "fussy", lastWatered: "2026-06-21", log: ["2026-06-21","2026-06-14"], note: "Hates being moved. Found its spot by the window.", tips: ["Keep it in ONE bright spot — it sulks at change.", "Water when the top 2 inches are dry."] },
  { id: "pl5", name: "Pickle", species: "Calathea Orbifolia", room: "Bathroom", kw: "calathea,plant", seed: 23, waterEvery: 4, light: "low", humidity: "High", difficulty: "fussy", lastWatered: "2026-06-24", log: ["2026-06-24","2026-06-20","2026-06-16"], note: "The prayer plant — leaves lift at night.", tips: ["Never let it fully dry out.", "Loves a steamy bathroom."] },
  { id: "pl6", name: "Spike", species: "Snake Plant", room: "Bedroom", kw: "snake-plant,sansevieria", seed: 31, waterEvery: 21, light: "low", humidity: "Low", difficulty: "easy", lastWatered: "2026-06-15", log: ["2026-06-15","2026-05-26"], note: "Practically immortal. Cleans the air while I sleep.", tips: ["Underwater rather than overwater.", "Thrives on neglect."] },
  { id: "pl7", name: "Zed", species: "ZZ Plant", room: "Office", kw: "zz-plant,zamioculcas", seed: 14, waterEvery: 18, light: "low", humidity: "Low", difficulty: "easy", lastWatered: "2026-06-12", log: ["2026-06-12","2026-05-25"], note: "Glossy and unbothered in the dim corner.", tips: ["Rhizomes store water — let soil dry fully.", "Great for windowless rooms."] },
  { id: "pl8", name: "Vera", species: "Aloe Vera", room: "Kitchen", kw: "aloe,succulent", seed: 28, waterEvery: 14, light: "direct", humidity: "Low", difficulty: "easy", lastWatered: "2026-06-20", log: ["2026-06-20","2026-06-06"], note: "Kitchen first-aid kit for the odd burn.", tips: ["Deep but infrequent watering.", "Wants the brightest windowsill."] },
  { id: "pl9", name: "Rocky", species: "Rubber Plant", room: "Living room", kw: "rubber-plant,ficus", seed: 9, waterEvery: 9, light: "bright", humidity: "Average", difficulty: "moderate", lastWatered: "2026-06-25", log: ["2026-06-25","2026-06-16"], note: "Burgundy new growth is unreal.", tips: ["Wipe the big leaves for shine and health.", "Steady light keeps leaves from dropping."] },
  { id: "pl10", name: "Bjorn", species: "String of Pearls", room: "Kitchen", kw: "string-of-pearls,succulent", seed: 36, waterEvery: 12, light: "direct", humidity: "Low", difficulty: "moderate", lastWatered: "2026-06-26", log: ["2026-06-26","2026-06-14"], note: "Cascading green beads over the counter.", tips: ["Pearls plump when hydrated, shrivel when thirsty.", "Very prone to rot — err on dry."] },
];
