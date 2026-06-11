// ══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION — paste your Apps Script Web App URL below after deploying
// ══════════════════════════════════════════════════════════════════════════════
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwq46Hapsrv0XtExcrtnibAuGM2YBGGepqq2S6fccRThO9t02tsiknPjsA3hp7rIN3y/exec";

function isAppsScriptWebAppUrl(url) {
  return /https:\/\/script\.google\.com\/macros\/s\/.+\/(exec|dev)$/.test(
    (url || "").trim(),
  );
}

// ── PLAYERS ───────────────────────────────────────────────────────────────────
const PLAYERS = [
  { name: "Fatima", passcode: "1111", color: "#E63946" },
  { name: "Feras", passcode: "2222", color: "#1A56B0" },
  { name: "Marteena", passcode: "3333", color: "#1A7A4A" },
  { name: "Hussain", passcode: "4444", color: "#D4A017" },
  { name: "Lana", passcode: "5555", color: "#7C3AED" },
  { name: "Mustafa", passcode: "6666", color: "#EA580C" },
  { name: "Zahara", passcode: "7777", color: "#0891B2" },
  { name: "Reem", passcode: "8888", color: "#BE185D" },
  { name: "Hala", passcode: "9999", color: "#065F46" },
  { name: "Player 10", passcode: "0000", color: "#6B7280" },
];
const ADMIN_CODE = "2026";

// ── MATCH / GROUP DATA ────────────────────────────────────────────────────────
const GROUPS = {
  A: ["Mexico", "South Korea", "Czechia", "South Africa"],
  B: ["Canada", "Qatar", "Switzerland", "Bosnia and Herzegovina"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["United States", "Australia", "Paraguay", "Türkiye"],
  E: ["Germany", "Ivory Coast", "Ecuador", "Curaçao"],
  F: ["Netherlands", "Japan", "Tunisia"],
  G: ["Belgium", "Iran", "New Zealand", "Egypt"],
  H: ["Spain", "Uruguay", "Saudi Arabia", "Cape Verde"],
  I: ["France", "Norway", "Senegal", "Iraq"],
  J: ["Argentina", "Austria", "Algeria", "Jordan"],
  K: ["Portugal", "Colombia", "DRC", "Uzbekistan"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};
const ALL_TEAMS = [...new Set(Object.values(GROUPS).flat())].sort();

const GS_RAW = {
  A: [
    [1, "Jun 11", "Mexico", "South Africa"],
    [2, "Jun 11", "South Korea", "Czechia"],
    [25, "Jun 18", "Czechia", "South Africa"],
    [28, "Jun 18", "Mexico", "South Korea"],
    [53, "Jun 24", "Czechia", "Mexico"],
    [54, "Jun 24", "South Africa", "South Korea"],
  ],
  B: [
    [3, "Jun 12", "Canada", "Bosnia and Herzegovina"],
    [8, "Jun 13", "Qatar", "Switzerland"],
    [26, "Jun 18", "Switzerland", "Bosnia and Herzegovina"],
    [27, "Jun 18", "Canada", "Qatar"],
    [51, "Jun 24", "Switzerland", "Canada"],
    [52, "Jun 24", "Bosnia and Herzegovina", "Qatar"],
  ],
  C: [
    [7, "Jun 13", "Brazil", "Morocco"],
    [5, "Jun 13", "Haiti", "Scotland"],
    [30, "Jun 19", "Scotland", "Morocco"],
    [29, "Jun 19", "Brazil", "Haiti"],
    [49, "Jun 24", "Scotland", "Brazil"],
    [50, "Jun 24", "Morocco", "Haiti"],
  ],
  D: [
    [4, "Jun 12", "United States", "Paraguay"],
    [6, "Jun 13", "Australia", "Türkiye"],
    [32, "Jun 19", "United States", "Australia"],
    [31, "Jun 19", "Türkiye", "Paraguay"],
    [59, "Jun 25", "Türkiye", "United States"],
    [60, "Jun 25", "Paraguay", "Australia"],
  ],
  E: [
    [10, "Jun 14", "Germany", "Curaçao"],
    [9, "Jun 14", "Ivory Coast", "Ecuador"],
    [33, "Jun 20", "Germany", "Ivory Coast"],
    [34, "Jun 20", "Ecuador", "Curaçao"],
    [55, "Jun 25", "Curaçao", "Ivory Coast"],
    [56, "Jun 25", "Ecuador", "Germany"],
  ],
  F: [
    [11, "Jun 14", "Netherlands", "Japan"],
    [12, "Jun 14", "Japan", "Tunisia"],
    [35, "Jun 20", "Netherlands", "Japan"],
    [36, "Jun 20", "Tunisia", "Japan"],
    [57, "Jun 25", "Japan", "Japan"],
    [58, "Jun 25", "Tunisia", "Netherlands"],
  ],
  G: [
    [16, "Jun 15", "Belgium", "Egypt"],
    [15, "Jun 15", "Iran", "New Zealand"],
    [39, "Jun 21", "Belgium", "Iran"],
    [40, "Jun 21", "New Zealand", "Egypt"],
    [63, "Jun 26", "Egypt", "Iran"],
    [64, "Jun 26", "New Zealand", "Belgium"],
  ],
  H: [
    [14, "Jun 15", "Spain", "Cape Verde"],
    [13, "Jun 15", "Saudi Arabia", "Uruguay"],
    [38, "Jun 21", "Spain", "Saudi Arabia"],
    [37, "Jun 21", "Uruguay", "Cape Verde"],
    [65, "Jun 26", "Cape Verde", "Saudi Arabia"],
    [66, "Jun 26", "Uruguay", "Spain"],
  ],
  I: [
    [17, "Jun 16", "France", "Senegal"],
    [18, "Jun 16", "Iraq", "Norway"],
    [42, "Jun 22", "France", "Iraq"],
    [41, "Jun 22", "Norway", "Senegal"],
    [61, "Jun 26", "Norway", "France"],
    [62, "Jun 26", "Senegal", "Iraq"],
  ],
  J: [
    [19, "Jun 16", "Argentina", "Algeria"],
    [20, "Jun 16", "Austria", "Jordan"],
    [43, "Jun 22", "Argentina", "Austria"],
    [44, "Jun 22", "Jordan", "Algeria"],
    [69, "Jun 27", "Algeria", "Austria"],
    [70, "Jun 27", "Jordan", "Argentina"],
  ],
  K: [
    [23, "Jun 17", "Portugal", "DRC"],
    [24, "Jun 17", "Uzbekistan", "Colombia"],
    [47, "Jun 23", "Portugal", "Uzbekistan"],
    [48, "Jun 23", "Colombia", "DRC"],
    [71, "Jun 27", "Colombia", "Portugal"],
    [72, "Jun 27", "DRC", "Uzbekistan"],
  ],
  L: [
    [21, "Jun 17", "England", "Croatia"],
    [22, "Jun 17", "Ghana", "Panama"],
    [45, "Jun 23", "England", "Ghana"],
    [46, "Jun 23", "Panama", "Croatia"],
    [67, "Jun 27", "Panama", "England"],
    [68, "Jun 27", "Croatia", "Ghana"],
  ],
};
const GS_MATCHES = [];
Object.entries(GS_RAW).forEach(([g, ms]) =>
  ms.forEach(([n, d, a, b]) =>
    GS_MATCHES.push({ num: n, date: d, stage: `Group ${g}`, a, b }),
  ),
);
GS_MATCHES.sort((x, y) => x.num - y.num);

const KO_MATCHES = [
  { num: 73, stage: "Round of 32", date: "Jun 28", a: "2A", b: "2B" },
  { num: 76, stage: "Round of 32", date: "Jun 29", a: "1C", b: "2F" },
  { num: 74, stage: "Round of 32", date: "Jun 29", a: "1E", b: "3rd" },
  { num: 75, stage: "Round of 32", date: "Jun 29", a: "1F", b: "2C" },
  { num: 78, stage: "Round of 32", date: "Jun 30", a: "2E", b: "2I" },
  { num: 77, stage: "Round of 32", date: "Jun 30", a: "1I", b: "3rd" },
  { num: 79, stage: "Round of 32", date: "Jun 30", a: "1A", b: "3rd" },
  { num: 80, stage: "Round of 32", date: "Jul 1", a: "1L", b: "3rd" },
  { num: 82, stage: "Round of 32", date: "Jul 1", a: "1G", b: "3rd" },
  { num: 81, stage: "Round of 32", date: "Jul 1", a: "1D", b: "3rd" },
  { num: 84, stage: "Round of 32", date: "Jul 2", a: "1H", b: "2J" },
  { num: 83, stage: "Round of 32", date: "Jul 2", a: "2K", b: "2L" },
  { num: 85, stage: "Round of 32", date: "Jul 2", a: "2B", b: "3rd" },
  { num: 88, stage: "Round of 32", date: "Jul 3", a: "2D", b: "2G" },
  { num: 86, stage: "Round of 32", date: "Jul 3", a: "1J", b: "2H" },
  { num: 87, stage: "Round of 32", date: "Jul 3", a: "1K", b: "3rd" },
  { num: 89, stage: "Round of 16", date: "Jul 4", a: "W73", b: "W75" },
  { num: 90, stage: "Round of 16", date: "Jul 4", a: "W74", b: "W77" },
  { num: 91, stage: "Round of 16", date: "Jul 5", a: "W76", b: "W78" },
  { num: 92, stage: "Round of 16", date: "Jul 5", a: "W79", b: "W80" },
  { num: 93, stage: "Round of 16", date: "Jul 6", a: "W83", b: "W84" },
  { num: 94, stage: "Round of 16", date: "Jul 6", a: "W81", b: "W82" },
  { num: 95, stage: "Round of 16", date: "Jul 7", a: "W86", b: "W88" },
  { num: 96, stage: "Round of 16", date: "Jul 7", a: "W85", b: "W87" },
  { num: 97, stage: "Quarter-Final", date: "Jul 9", a: "W89", b: "W90" },
  { num: 98, stage: "Quarter-Final", date: "Jul 10", a: "W93", b: "W94" },
  { num: 99, stage: "Quarter-Final", date: "Jul 11", a: "W91", b: "W92" },
  {
    num: 100,
    stage: "Quarter-Final",
    date: "Jul 11",
    a: "W95",
    b: "W96",
  },
  { num: 101, stage: "Semi-Final", date: "Jul 14", a: "W97", b: "W98" },
  { num: 102, stage: "Semi-Final", date: "Jul 15", a: "W99", b: "W100" },
  { num: 103, stage: "3rd Place", date: "Jul 18", a: "L101", b: "L102" },
  { num: 104, stage: "Final", date: "Jul 19", a: "W101", b: "W102" },
];

const TOURNEY_CATS = [
  { key: "winner", label: "World Cup Winner", pts: 30 },
  { key: "runnerup", label: "Runner-Up", pts: 20 },
  { key: "finalist1", label: "Finalist 1", pts: 20 },
  { key: "finalist2", label: "Finalist 2", pts: 20 },
  { key: "semi1", label: "Semi-Finalist 1", pts: 15 },
  { key: "semi2", label: "Semi-Finalist 2", pts: 15 },
  { key: "semi3", label: "Semi-Finalist 3", pts: 15 },
  { key: "semi4", label: "Semi-Finalist 4", pts: 15 },
  { key: "qf1", label: "QF 1", pts: 8 },
  { key: "qf2", label: "QF 2", pts: 8 },
  { key: "qf3", label: "QF 3", pts: 8 },
  { key: "qf4", label: "QF 4", pts: 8 },
  { key: "qf5", label: "QF 5", pts: 8 },
  { key: "qf6", label: "QF 6", pts: 8 },
  { key: "qf7", label: "QF 7", pts: 8 },
  { key: "qf8", label: "QF 8", pts: 8 },
  { key: "goldenboot", label: "Golden Boot", pts: 20 },
  { key: "bestyoung", label: "Best Young Player", pts: 15 },
  { key: "goldenglove", label: "Golden Glove", pts: 15 },
  { key: "mostgoals", label: "Team Most Goals", pts: 10 },
];
const SIDE_BETS = [
  { key: "upset", label: "Biggest Upset", pts: 15 },
  { key: "yellows", label: "Most Yellow Cards (team)", pts: 10 },
  { key: "redcard", label: "First Red Card (team)", pts: 10 },
  { key: "hattrick", label: "First Hat-Trick Scorer", pts: 15 },
  { key: "owngoal", label: "First Own Goal (team)", pts: 10 },
  { key: "highscore", label: "Highest Scoring Match", pts: 15 },
];

// ── STATE ─────────────────────────────────────────────────────────────────────
const S = {
  view: "login",
  selectedPlayer: null,
  activeTab: "tourney",
  showConfirm: false,
  pinInput: ["", "", "", ""],
  pinError: "",
  allStatuses: {},
  currentForm: {},
  currentSubmitted: false,
  isSaving: false,
  isLoading: false,
};

// ── API ───────────────────────────────────────────────────────────────────────
// GET — used for status and load (no body needed, short URLs)
async function apiGet(params) {
  const url = APPS_SCRIPT_URL + "?" + new URLSearchParams(params);
  const r = await fetch(url);
  const text = await r.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Bad response from server");
  }
}

// POST with no-cors — used for save and submit (large body)
// no-cors means we can't read the response, but the write still happens in the sheet
async function apiPost(body) {
  await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors", // bypass CORS — we just need the write to happen
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(body),
  });
  // no-cors gives us an opaque response — we can't read it
  // so we assume ok:true and let the next load verify
  return { ok: true };
}

// Mock for demo when URL not set
const _mockStore = {};
function mockGet(p) {
  if (p.action === "status") return { ok: true, statuses: _mockStore };
  if (p.action === "load") {
    const d = _mockStore[p.player] || {};
    return {
      ok: true,
      player: p.player,
      submitted: d.submitted || false,
      form: d.form || {},
    };
  }
  return { ok: false };
}
function mockPost(b) {
  if (b.action === "save" || b.action === "submit") {
    _mockStore[b.player] = {
      ...b.data,
      submitted: b.action === "submit",
    };
    return { ok: true, submittedAt: new Date().toISOString() };
  }
  return { ok: false };
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const ini = (n) =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
function emptyForm() {
  const f = {};
  TOURNEY_CATS.forEach((c) => (f[c.key] = ""));
  Object.keys(GROUPS).forEach((g) => {
    f[`group_${g}_1`] = "";
    f[`group_${g}_2`] = "";
    f[`group_${g}_3`] = "";
    f[`group_${g}_4`] = "";
  });
  GS_MATCHES.forEach((m) => {
    f[`gs_${m.num}_w`] = "";
    f[`gs_${m.num}_a`] = "";
    f[`gs_${m.num}_b`] = "";
  });
  KO_MATCHES.forEach((m) => {
    f[`ko_${m.num}_w`] = "";
    f[`ko_${m.num}_a`] = "";
    f[`ko_${m.num}_b`] = "";
  });
  SIDE_BETS.forEach((s) => (f[s.key] = ""));
  return f;
}
function filledCount(form) {
  const keys = Object.keys(emptyForm()).filter(
    (k) => !k.endsWith("_a") && !k.endsWith("_b"),
  );
  return {
    filled: keys.filter((k) => form[k] && form[k] !== "").length,
    total: keys.length,
  };
}
function sel(id, val, dis, teams, ph = "— select —") {
  const o =
    `<option value="">${ph}</option>` +
    (teams || ALL_TEAMS)
      .map(
        (t) =>
          `<option value="${t}"${t === val ? " selected" : ""}>${t}</option>`,
      )
      .join("");
  return `<select id="${id}"${dis ? " disabled" : ""}>${o}</select>`;
}
function toast(msg, ms = 2800) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), ms);
}

// ── RENDER ────────────────────────────────────────────────────────────────────
function render() {
  const root = document.getElementById("root");
  if (S.view === "login") root.innerHTML = renderLogin();
  else if (S.view === "passcode") root.innerHTML = renderPasscode();
  else if (S.view === "player") root.innerHTML = renderPlayer();
  else if (S.view === "admin") root.innerHTML = renderAdmin();
  else if (S.view === "leaderboard") root.innerHTML = renderLeaderboard();
  attach();
  if (S.view === "passcode")
    setTimeout(() => document.querySelector(".pin-digit")?.focus(), 50);
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function renderLogin() {
  const btns = PLAYERS.map((p) => {
    const st = S.allStatuses[p.name] || {};
    const done = st.submitted;
    return `<button class="player-btn${done ? " submitted" : ""}" data-action="pick" data-name="${p.name}">
      <div class="avatar" style="background:${p.color}">${ini(p.name)}</div>
      <div>${p.name}</div>
      ${done ? `<div class="sub-tag">🔒 Locked</div>` : ``}
    </button>`;
  }).join("");
  return `<div class="card">
    <div class="flex-between" style="margin-bottom:1rem">
      <div><div style="font-size:1.1rem;font-weight:700;color:var(--navy)">Choose your name</div>
      <div class="text-muted" style="margin-top:.2rem;font-size:.8rem">Then enter your passcode</div></div>
      <button class="btn btn-ghost btn-sm" data-action="go-admin">Admin</button>
    </div>
    <div class="player-grid">${btns}</div>
    <div class="divider"></div>
    <button class="btn btn-ghost btn-full" data-action="go-lb">📊 View Leaderboard</button>
  </div>`;
}

// ── PASSCODE ──────────────────────────────────────────────────────────────────
function renderPasscode() {
  const isAdmin = S.selectedPlayer === "__admin__";
  const p = PLAYERS.find((x) => x.name === S.selectedPlayer);
  const color = isAdmin ? "#374151" : p?.color || "#1A56B0";
  const label = isAdmin ? "Admin" : S.selectedPlayer || "";
  const digits = S.pinInput
    .map(
      (v, i) =>
        `<input class="pin-digit" type="password" inputmode="numeric" maxlength="1" data-pin="${i}" value="${v}" placeholder="•">`,
    )
    .join("");
  return `<div class="card passcode-form">
    <button class="btn btn-ghost btn-sm" data-action="back" style="margin-bottom:1rem">← Back</button>
    <div class="pav" style="background:${color}">${isAdmin ? "★" : ini(label)}</div>
    <h2>Hi, ${label}</h2>
    <p>${isAdmin ? "Enter the admin passcode" : "Enter your 4-digit passcode"}</p>
    ${S.pinError ? `<div class="error-msg">⚠ ${S.pinError}</div>` : ""}
    <div class="pin-row">${digits}</div>
    <button class="btn btn-primary btn-full" data-action="verify">Unlock →</button>
  </div>`;
}

// ── PLAYER ────────────────────────────────────────────────────────────────────
function renderPlayer() {
  const pName = S.selectedPlayer;
  const p = PLAYERS.find((x) => x.name === pName);
  const locked = S.currentSubmitted;
  const form = S.currentForm;
  const { filled, total } = filledCount(form);
  const pct = Math.round((filled / total) * 100);
  let tabHtml = "";
  if (S.activeTab === "tourney") tabHtml = renderTourney(form, locked);
  else if (S.activeTab === "groups") tabHtml = renderGroups(form, locked);
  else if (S.activeTab === "gs") tabHtml = renderGS(form, locked);
  else if (S.activeTab === "ko") tabHtml = renderKO(form, locked);
  else if (S.activeTab === "side") tabHtml = renderSide(form, locked);
  const modal = S.showConfirm
    ? `<div class="confirm-overlay">
    <div class="confirm-card">
      <div style="font-size:2.2rem;margin-bottom:.65rem">🔒</div>
      <h3>Lock in your predictions?</h3>
      <p>Once submitted, your picks are <strong>permanent and cannot be changed</strong>. Double-check everything first!</p>
      <div class="confirm-btns">
        <button class="btn btn-ghost" data-action="cancel-confirm">Go back</button>
        <button class="btn btn-danger" data-action="do-submit">${S.isSaving ? `<span class="spinner"></span>` : ""}Yes, lock them!</button>
      </div>
    </div></div>`
    : "";
  return `${modal}
  <div style="width:100%;max-width:880px">
    <div class="top-nav">
      <button class="back-btn" data-action="back">← Exit</button>
      <div class="nav-title">⚽ ${pName}'s Card</div>
      <div style="min-width:70px;text-align:right">${locked ? `<span class="tag tag-green">🔒 Locked</span>` : S.isSaving ? `<span class="tag tag-gold"><span class="saving-dot"></span>Saving</span>` : ""}</div>
    </div>
    <div class="card card-full">
      <div class="player-header">
        <div class="pav" style="background:${p?.color}">${ini(pName)}</div>
        <h2>${pName}'s Prediction Card</h2>
        <p>World Cup 2026 — Complete all 5 sections before the tournament starts</p>
      </div>
      ${
        locked
          ? `<div class="locked-banner"><div class="lb-icon">🔒</div><div><h3>Predictions Locked!</h3><p>Submitted and saved to Google Sheets. Good luck!</p></div></div>`
          : `
      <div style="margin-bottom:1.25rem">
        <div class="flex-between" style="margin-bottom:.3rem">
          <span class="text-muted" style="font-size:.77rem">Completion</span>
          <span style="font-weight:700;font-size:.82rem;color:var(--blue)">${filled} / ${total} filled</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>`
      }
      <div class="tabs">
        ${[
          ["tourney", "🏆 Tournament"],
          ["groups", "📋 Groups"],
          ["gs", "⚽ Group Matches"],
          ["ko", "🏅 Knockouts"],
          ["side", "🎲 Side Bets"],
        ]
          .map(
            ([k, l]) =>
              `<button class="tab${S.activeTab === k ? " active" : ""}" data-action="tab" data-tab="${k}">${l}</button>`,
          )
          .join("")}
      </div>
      ${tabHtml}
      ${
        !locked
          ? `<div class="divider"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.65rem">
        <div class="text-muted" style="font-size:.78rem">💾 Auto-saves as you type</div>
        <button class="btn btn-gold" data-action="req-submit">🔒 Submit & Lock Predictions</button>
      </div>`
          : ""
      }
    </div>
  </div>`;
}

function renderTourney(form, locked) {
  return `<div class="section">
    <div class="section-title">🏆 Tournament Predictions <span class="badge">up to 230 pts</span></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:.7rem">
    ${TOURNEY_CATS.map(
      (c) => `<div class="field">
      <label>${c.label} <span class="pts">+${c.pts}pts</span></label>
      ${sel(`tc_${c.key}`, form[c.key], locked)}
    </div>`,
    ).join("")}
    </div></div>`;
}

function renderGroups(form, locked) {
  return `<div class="section">
    <div class="section-title">📋 Group Predictions <span class="badge">up to 360 pts</span></div>
    <p class="text-muted" style="margin-bottom:.85rem;font-size:.78rem">Full order=30pts · Top 2 any order=15pts · Winner only=10pts · Runner-up only=10pts</p>
    <div class="groups-grid">
    ${Object.entries(GROUPS)
      .map(
        ([g, teams]) => `<div class="group-card">
      <div class="group-title">Group ${g} <span>${teams.join(" · ")}</span></div>
      <div class="group-body">
        ${["1st", "2nd", "3rd", "4th"]
          .map(
            (pos, i) => `<div class="group-row">
          <span>${pos}</span>
          ${sel(`grp_${g}_${i + 1}`, form[`group_${g}_${i + 1}`], locked, teams)}
        </div>`,
          )
          .join("")}
      </div></div>`,
      )
      .join("")}
    </div></div>`;
}

function renderGS(form, locked) {
  const byG = {};
  GS_MATCHES.forEach((m) => {
    if (!byG[m.stage]) byG[m.stage] = [];
    byG[m.stage].push(m);
  });
  return `<div class="section">
    <div class="section-title">⚽ Group Stage Matches <span class="badge">72 matches</span></div>
    <p class="text-muted" style="margin-bottom:.85rem;font-size:.78rem">Correct winner=5pts · Winner+score=10pts · Exact score bonus=+5pts</p>
    ${Object.entries(byG)
      .map(
        ([grp, ms]) => `
    <div style="margin-bottom:1.1rem">
      <div style="font-size:.76rem;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.4rem;padding-left:.2rem">${grp}</div>
      ${ms
        .map((m) => {
          const teams = GROUPS[m.stage.replace("Group ", "")] || [];
          return `<div class="match-block">
        <div class="match-header"><span class="mn">${m.num}</span>${m.date} · ${m.a} vs ${m.b}<span class="ms">${m.stage}</span></div>
        <div class="match-teams"><span class="team">${m.a}</span><span class="vs">vs</span><span class="team" style="text-align:right">${m.b}</span></div>
        <div class="match-inputs">
          ${sel(`gsw_${m.num}`, form[`gs_${m.num}_w`], locked, [m.a, m.b], "— Winner —")}
          <input type="text" id="gsa_${m.num}" value="${form[`gs_${m.num}_a`] || ""}" placeholder="A score"${locked ? " disabled" : ""}style="text-align:center">
          <input type="text" id="gsb_${m.num}" value="${form[`gs_${m.num}_b`] || ""}" placeholder="B score"${locked ? " disabled" : ""}style="text-align:center">
        </div></div>`;
        })
        .join("")}
    </div>`,
      )
      .join("")}
  </div>`;
}

function renderKO(form, locked) {
  const byS = {};
  KO_MATCHES.forEach((m) => {
    if (!byS[m.stage]) byS[m.stage] = [];
    byS[m.stage].push(m);
  });
  const order = [
    "Round of 32",
    "Round of 16",
    "Quarter-Final",
    "Semi-Final",
    "3rd Place",
    "Final",
  ];
  return `<div class="section">
    <div class="section-title">🏅 Knockout Predictions <span class="badge">32 matches</span></div>
    <p class="text-muted" style="margin-bottom:.85rem;font-size:.78rem">Advancing=5pts · Winner+score=10pts · Penalties winner=8pts · Exact score +5 bonus</p>
    ${order
      .filter((s) => byS[s])
      .map(
        (stage) => `
    <div style="margin-bottom:1.1rem">
      <div style="font-size:.76rem;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.4rem;padding-left:.2rem">${stage}</div>
      ${byS[stage]
        .map(
          (m) => `<div class="match-block">
        <div class="match-header"><span class="mn">${m.num}</span>${m.date} · ${m.a} vs ${m.b}<span class="ms">${m.stage}</span></div>
        <div class="match-teams"><span class="team">${m.a}</span><span class="vs">vs</span><span class="team" style="text-align:right">${m.b}</span></div>
        <div class="match-inputs">
          ${sel(`kow_${m.num}`, form[`ko_${m.num}_w`], locked, ALL_TEAMS, "— Winner —")}
          <input type="text" id="koa_${m.num}" value="${form[`ko_${m.num}_a`] || ""}" placeholder="A score"${locked ? " disabled" : ""}style="text-align:center">
          <input type="text" id="kob_${m.num}" value="${form[`ko_${m.num}_b`] || ""}" placeholder="B score"${locked ? " disabled" : ""}style="text-align:center">
        </div></div>`,
        )
        .join("")}
    </div>`,
      )
      .join("")}
  </div>`;
}

function renderSide(form, locked) {
  return `<div class="section">
    <div class="section-title">🎲 Fun Side Bets <span class="badge">up to 75 pts</span></div>
    ${SIDE_BETS.map(
      (s) => `<div class="field">
      <label>${s.label} <span class="pts">+${s.pts}pts</span></label>
      <input type="text" id="sb_${s.key}" value="${form[s.key] || ""}" placeholder="Your answer..."${locked ? " disabled" : ""}/>
    </div>`,
    ).join("")}
  </div>`;
}

// ── ADMIN ─────────────────────────────────────────────────────────────────────
function renderAdmin() {
  const submitted = PLAYERS.filter(
    (p) => S.allStatuses[p.name]?.submitted,
  ).length;
  const rows = PLAYERS.map((p) => {
    const st = S.allStatuses[p.name] || {};
    const done = st.submitted;
    const fc = st.filledCount || 0;
    return `<div class="admin-row">
      <div class="lb-avatar" style="background:${p.color}">${ini(p.name)}</div>
      <div class="admin-name">${p.name}</div>
      <div class="text-muted" style="font-size:.75rem">${done ? `${fc} fields saved` : ""}</div>
      <span class="lb-status${done ? " done" : " pending"}">${done ? "✅ Locked" : "⏳ Pending"}</span>
    </div>`;
  }).join("");
  return `<div style="width:100%;max-width:640px">
    <div class="top-nav">
      <button class="back-btn" data-action="back">← Back</button>
      <div class="nav-title">👑 Admin Dashboard</div>
      <div style="min-width:70px"></div>
    </div>
    <div class="card">
      <h2 style="color:var(--navy);font-size:1.15rem;margin-bottom:1.1rem">Player Submission Status</h2>
      <div class="score-grid" style="margin-bottom:1.35rem">
        <div class="score-card"><div class="val">${submitted}</div><div class="lbl">Submitted</div></div>
        <div class="score-card"><div class="val">${PLAYERS.length - submitted}</div><div class="lbl">Pending</div></div>
        <div class="score-card"><div class="val">${PLAYERS.length}</div><div class="lbl">Total</div></div>
      </div>
      ${rows}
      <div class="divider"></div>
      <p class="text-muted" style="font-size:.76rem">All data is saved to your Google Sheet. Check the <strong>PredictionsMeta</strong> tab for an overview, and <strong>Data_PlayerName</strong> tabs for raw data.</p>
      <div class="divider"></div>
      <button class="btn btn-ghost btn-sm" data-action="reload-status">↻ Refresh Status</button>
    </div>
  </div>`;
}

// ── LEADERBOARD ───────────────────────────────────────────────────────────────
function renderLeaderboard() {
  const medals = ["🥇", "🥈", "🥉"];
  const rows = PLAYERS.map((p, i) => {
    const st = S.allStatuses[p.name] || {};
    return `<div class="lb-row">
      <div class="rank">${medals[i] || i + 1}</div>
      <div class="lb-avatar" style="background:${p.color}">${ini(p.name)}</div>
      <div class="lb-name">${p.name}</div>
      <span class="lb-status${st.submitted ? " done" : " pending"}">${st.submitted ? "Submitted" : "Pending"}</span>
      <div style="font-weight:700;color:var(--blue);font-size:.82rem;min-width:48px;text-align:right">— pts</div>
    </div>`;
  }).join("");
  return `<div style="width:100%;max-width:500px">
    <div class="top-nav">
      <button class="back-btn" data-action="back">← Back</button>
      <div class="nav-title">📊 Leaderboard</div>
      <div style="min-width:70px"></div>
    </div>
    <div class="card">
      <h2 style="color:var(--navy);font-size:1.1rem;margin-bottom:.3rem">WC 2026 Standings</h2>
      <p class="text-muted" style="font-size:.8rem;margin-bottom:1.1rem">Points calculated in the Excel workbook after results are entered</p>
      <div style="border:1px solid var(--gray-200);border-radius:var(--radius-sm);overflow:hidden">${rows}</div>
      <div class="divider"></div>
      <p class="text-muted" style="font-size:.76rem;text-align:center">Open the Excel workbook to see live scores once matches are played</p>
    </div>
  </div>`;
}

// ── EVENTS ────────────────────────────────────────────────────────────────────
function attach() {
  document.getElementById("root").onclick = onClick;
  document.querySelectorAll(".pin-digit").forEach((el) => {
    el.addEventListener("input", onPin);
    el.addEventListener("keydown", onPinKey);
  });
  document
    .querySelectorAll("select,input[type=text]")
    .forEach((el) => el.addEventListener("change", onField));
  document
    .querySelectorAll("input[type=text]")
    .forEach((el) => el.addEventListener("input", onField));
}

function onClick(e) {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const a = btn.dataset.action;
  if (a === "pick") {
    S.selectedPlayer = btn.dataset.name;
    S.pinInput = ["", "", "", ""];
    S.pinError = "";
    S.view = "passcode";
    render();
  } else if (a === "go-admin") {
    S.selectedPlayer = "__admin__";
    S.pinInput = ["", "", "", ""];
    S.pinError = "";
    S.view = "passcode";
    render();
  } else if (a === "go-lb") {
    S.view = "leaderboard";
    render();
  } else if (a === "back") {
    S.view = "login";
    S.selectedPlayer = null;
    render();
  } else if (a === "verify") verifyPin();
  else if (a === "tab") {
    S.activeTab = btn.dataset.tab;
    render();
  } else if (a === "req-submit") {
    S.showConfirm = true;
    render();
  } else if (a === "cancel-confirm") {
    S.showConfirm = false;
    render();
  } else if (a === "do-submit") doSubmit();
  else if (a === "reload-status") loadStatuses().then(render);
}

function onPin(e) {
  const i = +e.target.dataset.pin;
  S.pinInput[i] = e.target.value.replace(/\D/g, "").slice(-1);
  e.target.value = S.pinInput[i];
  if (S.pinInput[i] && i < 3)
    document.querySelectorAll(".pin-digit")[i + 1]?.focus();
  if (S.pinInput.every((d) => d !== "")) verifyPin();
}
function onPinKey(e) {
  const i = +e.target.dataset.pin;
  if (e.key === "Backspace" && !S.pinInput[i] && i > 0) {
    S.pinInput[i - 1] = "";
    document.querySelectorAll(".pin-digit")[i - 1]?.focus();
  }
}

function onField(e) {
  const id = e.target.id;
  if (!id || S.currentSubmitted) return;
  const v = e.target.value;
  const f = S.currentForm;
  if (id.startsWith("tc_")) f[id.slice(3)] = v;
  else if (id.startsWith("grp_")) {
    const [, g, pos] = id.split("_");
    f[`group_${g}_${pos}`] = v;
  } else if (id.startsWith("gsw_")) f[`gs_${id.slice(4)}_w`] = v;
  else if (id.startsWith("gsa_")) f[`gs_${id.slice(4)}_a`] = v;
  else if (id.startsWith("gsb_")) f[`gs_${id.slice(4)}_b`] = v;
  else if (id.startsWith("kow_")) f[`ko_${id.slice(4)}_w`] = v;
  else if (id.startsWith("koa_")) f[`ko_${id.slice(4)}_a`] = v;
  else if (id.startsWith("kob_")) f[`ko_${id.slice(4)}_b`] = v;
  else if (id.startsWith("sb_")) f[id.slice(3)] = v;
  schedSave();
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
async function verifyPin() {
  const code = S.pinInput.join("");
  if (code.length < 4) return;
  if (S.selectedPlayer === "__admin__") {
    if (code === ADMIN_CODE) {
      S.view = "admin";
      S.pinError = "";
      await loadStatuses();
      render();
    } else {
      S.pinError = "Wrong admin passcode";
      S.pinInput = ["", "", "", ""];
      render();
    }
    return;
  }
  const p = PLAYERS.find((x) => x.name === S.selectedPlayer);
  if (p && code === p.passcode) {
    S.isLoading = true;
    render();
    try {
      const res = await apiGet({ action: "load", player: p.name });
      S.currentForm = Object.assign(emptyForm(), res.form || {});
      S.currentSubmitted = !!res.submitted;
    } catch {
      S.currentForm = emptyForm();
      S.currentSubmitted = false;
    }
    S.isLoading = false;
    S.pinError = "";
    S.activeTab = "tourney";
    S.view = "player";
    render();
  } else {
    S.pinError = "Wrong passcode — try again";
    S.pinInput = ["", "", "", ""];
    render();
  }
}

// ── SAVE ──────────────────────────────────────────────────────────────────────
let saveTimer = null;
function schedSave() {
  clearTimeout(saveTimer);
  S.isSaving = true;
  const savingEl = document.querySelector(".tag-gold");
  if (savingEl) {
    savingEl.innerHTML = `<span class="saving-dot"></span>Saving`;
  }
  saveTimer = setTimeout(async () => {
    const { filled } = filledCount(S.currentForm);
    let saveOk = false;
    try {
      const res = await apiPost({
        action: "save",
        player: S.selectedPlayer,
        data: JSON.stringify({ form: S.currentForm, filledCount: filled }),
      });
      if (!res?.ok) throw new Error("Save returned not-ok response");
      S.allStatuses[S.selectedPlayer] = {
        ...S.allStatuses[S.selectedPlayer],
        filledCount: filled,
      };
      saveOk = true;
    } catch {
      toast("⚠ Save failed — check connection");
    }
    S.isSaving = false;
    const dot = document.querySelector(".saving-dot");
    if (dot && saveOk) {
      dot.parentElement.innerHTML = "Saved ✓";
      dot.parentElement.style.background = "var(--green-light)";
      dot.parentElement.style.color = "var(--green)";
    }
  }, 900);
}

async function doSubmit() {
  if (S.isSaving) return;
  S.isSaving = true;
  render();
  const { filled } = filledCount(S.currentForm);
  try {
    const res = await apiPost({
      action: "submit",
      player: S.selectedPlayer,
      data: JSON.stringify({ form: S.currentForm, filledCount: filled }),
    });
    if (!res?.ok) throw new Error("Submit returned not-ok response");
    S.currentSubmitted = true;
    S.allStatuses[S.selectedPlayer] = {
      submitted: true,
      submittedAt: res.submittedAt,
      filledCount: filled,
    };
    toast("🔒 Predictions locked and saved to Google Sheets!");
  } catch {
    toast("⚠ Submission failed — please try again");
  }
  S.isSaving = false;
  S.showConfirm = false;
  render();
}

async function loadStatuses() {
  try {
    const r = await apiGet({ action: "status" });
    if (r.ok) S.allStatuses = r.statuses || {};
  } catch {}
}

// ── BOOT ──────────────────────────────────────────────────────────────────────
(async () => {
  await loadStatuses();
  render();
})();
