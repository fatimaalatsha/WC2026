const SHEET_ID = "1CkNWv49DcSOgruWIp0BWiy-zUulruTDTec1ldZjCUK0";
const PRED_SHEET = "Predictions";

const BASE_HEADERS = [
  "Player",
  "submitted",
  "submittedAt",
  "filledCount",
  "updatedAt",
];

// ── ROUTING ───────────────────────────────────────────────────────────────────
function doGet(e) {
  const p = e.parameter;
  let result;

  if (p.action === "status") result = getStatus();
  else if (p.action === "load") result = loadPlayer(p.player);
  else result = { ok: false, error: "unknown action" };

  return respond(result);
}

function doPost(e) {
  let body = null;

  // 1) raw JSON body
  try {
    if (e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
  } catch (_) {}

  // 2) form-urlencoded payload=<json>
  if (!body && e.parameter && e.parameter.payload) {
    try {
      body = JSON.parse(e.parameter.payload);
    } catch (_) {}
  }

  if (!body) return respond({ ok: false, error: "bad JSON" });

  // Accept object/string variants
  let parsedData = body.data;
  if (typeof parsedData === "string") {
    try {
      parsedData = JSON.parse(parsedData);
    } catch (_) {
      parsedData = null;
    }
  }
  if (
    (!parsedData || typeof parsedData !== "object") &&
    typeof body.dataJson === "string"
  ) {
    try {
      parsedData = JSON.parse(body.dataJson);
    } catch (_) {
      parsedData = null;
    }
  }

  Logger.log(
    "doPost contents len: %s",
    e.postData && e.postData.contents ? e.postData.contents.length : 0,
  );
  Logger.log("body.action: %s, player: %s", body.action, body.player);
  Logger.log("parsedData type: %s", typeof parsedData);
  Logger.log(
    "form key count: %s",
    Object.keys((parsedData && parsedData.form) || {}).length,
  );

  let result;
  if (body.action === "save")
    result = savePlayer(body.player, parsedData, false);
  else if (body.action === "submit")
    result = savePlayer(body.player, parsedData, true);
  else result = { ok: false, error: "unknown action" };

  return respond(result);
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function getPredSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(PRED_SHEET);
  if (!sh) sh = ss.insertSheet(PRED_SHEET);

  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, BASE_HEADERS.length).setValues([BASE_HEADERS]);
  } else if (sh.getLastColumn() === 0) {
    sh.getRange(1, 1, 1, BASE_HEADERS.length).setValues([BASE_HEADERS]);
  }

  return sh;
}

function getHeaders_(sh) {
  const lastCol = sh.getLastColumn();
  if (lastCol === 0) {
    sh.getRange(1, 1, 1, BASE_HEADERS.length).setValues([BASE_HEADERS]);
    return BASE_HEADERS.slice();
  }
  const headers = sh
    .getRange(1, 1, 1, lastCol)
    .getValues()[0]
    .map((h) => String(h || "").trim());
  return headers;
}

function ensureHeaders_(sh, formKeys) {
  let headers = getHeaders_(sh);

  // Ensure base headers exist
  const missingBase = BASE_HEADERS.filter((h) => !headers.includes(h));
  if (missingBase.length > 0) {
    sh.getRange(1, headers.length + 1, 1, missingBase.length).setValues([
      missingBase,
    ]);
    headers = headers.concat(missingBase);
  }

  // Ensure all form keys are columns
  const missingForm = formKeys.filter((k) => !headers.includes(k));
  if (missingForm.length > 0) {
    sh.getRange(1, headers.length + 1, 1, missingForm.length).setValues([
      missingForm,
    ]);
    headers = headers.concat(missingForm);
  }

  return headers;
}

function headerIndexMap_(headers) {
  const map = {};
  headers.forEach((h, i) => {
    map[h] = i;
  });
  return map;
}

function findPlayerRow_(sh, player) {
  const lr = sh.getLastRow();
  if (lr < 2) return -1;
  const vals = sh.getRange(2, 1, lr - 1, 1).getValues(); // col A = Player
  const target = String(player || "").trim();
  for (let i = 0; i < vals.length; i++) {
    if (String(vals[i][0] || "").trim() === target) return i + 2;
  }
  return -1;
}

function toBool_(v) {
  return v === true || String(v).toLowerCase() === "true";
}

// ── STATUS ────────────────────────────────────────────────────────────────────
function getStatus() {
  const sh = getPredSheet_();
  const headers = getHeaders_(sh);
  const idx = headerIndexMap_(headers);

  const lr = sh.getLastRow();
  if (lr < 2) return { ok: true, statuses: {} };

  const rows = sh.getRange(2, 1, lr - 1, headers.length).getValues();
  const statuses = {};

  rows.forEach((r) => {
    const player = String(r[idx.Player] || "").trim();
    if (!player) return;

    statuses[player] = {
      submitted: toBool_(r[idx.submitted]),
      submittedAt: r[idx.submittedAt] || null,
      filledCount: Number(r[idx.filledCount] || 0),
    };
  });

  return { ok: true, statuses: statuses };
}

// ── LOAD ──────────────────────────────────────────────────────────────────────
function loadPlayer(player) {
  if (!player) return { ok: false, error: "no player" };

  const sh = getPredSheet_();
  const headers = getHeaders_(sh);
  const idx = headerIndexMap_(headers);

  const rowNum = findPlayerRow_(sh, player);
  if (rowNum < 0)
    return { ok: true, player: player, submitted: false, form: {} };

  const row = sh.getRange(rowNum, 1, 1, headers.length).getValues()[0];

  const form = {};
  headers.forEach((h, i) => {
    if (BASE_HEADERS.includes(h)) return;
    form[h] = row[i] == null ? "" : row[i];
  });

  return {
    ok: true,
    player: player,
    submitted: toBool_(row[idx.submitted]),
    form: form,
  };
}

// ── SAVE / SUBMIT ─────────────────────────────────────────────────────────────
function savePlayer(player, data, submit) {
  if (!player || !data || typeof data !== "object") {
    return { ok: false, error: "missing params" };
  }

  const sh = getPredSheet_();
  const now = new Date().toISOString();
  const form = data.form || {};
  const filledCount = Number(data.filledCount || 0);

  const headers = ensureHeaders_(sh, Object.keys(form));
  const idx = headerIndexMap_(headers);
  const rowNum = findPlayerRow_(sh, player);

  const rowValues = new Array(headers.length).fill("");

  // If player exists, start from existing row so we preserve unknown columns
  if (rowNum > 0) {
    const existing = sh.getRange(rowNum, 1, 1, headers.length).getValues()[0];
    for (let i = 0; i < headers.length; i++) rowValues[i] = existing[i];
  }

  // Base fields
  rowValues[idx.Player] = player;
  const wasSubmitted = rowNum > 0 ? toBool_(rowValues[idx.submitted]) : false;
  rowValues[idx.submitted] = submit ? true : wasSubmitted;
  rowValues[idx.submittedAt] = submit
    ? now
    : rowValues[idx.submittedAt] || null;
  rowValues[idx.filledCount] = filledCount;
  rowValues[idx.updatedAt] = now;

  // Write every form key into its own column
  Object.keys(form).forEach((k) => {
    if (idx[k] !== undefined) rowValues[idx[k]] = form[k];
  });

  if (rowNum > 0) {
    sh.getRange(rowNum, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sh.appendRow(rowValues);
  }

  return { ok: true, submittedAt: now };
}
