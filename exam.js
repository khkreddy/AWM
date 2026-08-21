function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function prefix() {
  const s = document.body.getAttribute("data-base") || "";
  return s;
}
function figSrc(src) {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("chemistry/") || src.startsWith("physics/")) return src;
  const sub = document.body.getAttribute("data-subject") || "chemistry";
  if (src.startsWith("figures/")) return prefix() + sub + "/" + src;
  return prefix() + src;
}
function tableHTML(t) {
  if (!t) return "";
  const headers = t.headers || [];
  const rows = t.rows || [];
  const labels = t.row_labels || [];
  const showLab = labels.length > 0;
  return `<div class="fig"><table class="exam"><thead><tr>` +
    (showLab ? `<th></th>` : "") +
    headers.map((h) => `<th>${esc(h)}</th>`).join("") +
    `</tr></thead><tbody>` +
    rows.map((row, i) => `<tr>` + (showLab ? `<th>${esc(labels[i] || "")}</th>` : "") +
      (row || []).map((c) => `<td>${esc(c)}</td>`).join("") + `</tr>`).join("") +
    `</tbody></table></div>`;
}
function figureHTML(it) {
  const f = it.figure;
  let html = "";
  if (it.equations && it.equations.length) {
    html += it.equations.map((e) => `<div class="eq">${esc(e.text || e)}</div>`).join("");
  }
  if (f && f.kind === "smiles" && (f.images || []).length) {
    html += `<div class="fig"><div class="smiles-row">` +
      f.images.map((im) =>
        `<div class="smiles-card"><img src="${esc(figSrc(im.src))}" alt="${esc(im.label || "structure")}">` +
        (im.label ? `<div class="lab">${esc(im.label)}</div>` : "") + `</div>`
      ).join("") + `</div></div>`;
  } else if (f && f.src) {
    html += `<div class="fig"><img src="${esc(figSrc(f.src))}" alt="figure"></div>`;
  } else if (f && f.kind === "table" && f.table) {
    html += tableHTML(f.table);
  }
  if (it.tables && it.tables.length) {
    html += it.tables.map(tableHTML).join("");
  }
  return html;
}
function stmtHTML(it) {
  const stmts = it.statements || [];
  if (!stmts.length) return "";
  return `<ol class="stmts">` + stmts.map((s) => {
    const n = s.n == null ? "" : s.n;
    const t = s.text == null ? s : s.text;
    return `<li><span class="n">${esc(n)}</span> ${esc(t)}</li>`;
  }).join("") + `</ol>`;
}
function optionsHTML(it, showKey) {
  const opts = it.options || {};
  const keys = Object.keys(opts).sort();
  if (!keys.length) return "";
  const ans = String(it.answer || "");
  return `<ol class="options">` + keys.map((k) => {
    const mark = showKey && ans && k === ans ? ` class="key"` : "";
    return `<li${mark}><span class="lab">${esc(k)}</span> ${esc(opts[k])}</li>`;
  }).join("") + `</ol>`;
}
function itemHTML(it, n, showKey) {
  const qn = n;
  const lead = it.stem_lead || it.stem || "";
  const marks = it.marks == null ? "1" : String(it.marks);
  return `<div class="q" id="q-${esc(it.item_uid)}">
    <span class="qmarks">[${esc(marks)}]</span>
    <p class="stem"><span class="qnum">${esc(qn)}</span>${esc(lead)}</p>
    ${figureHTML(it)}
    ${stmtHTML(it)}
    ${optionsHTML(it, showKey)}
    ${showKey && it.answer ? `<p class="keyline">Key ${esc(it.answer)}</p>` : ""}
  </div>`;
}
function paperHTML(items, meta, showKey) {
  const subj = (meta.subject || "CHEMISTRY").toUpperCase();
  const title = meta.paper_name || "Assembled paper";
  const node = meta.node ? `Node ${meta.node}` : "";
  return `
    <div class="hdr">
      <div class="board">Assessment World Model</div>
      <div class="subj">${esc(subj)}</div>
      <div class="papername">${esc(title)}</div>
      <div class="sess">${esc([node, meta.qualification, meta.n ? meta.n + " items" : ""].filter(Boolean).join(" · "))}</div>
    </div>
    <div class="cand"><div>Candidate name <span class="dots"></span></div>
      <div>Centre number <span class="dots"></span></div></div>
    <hr class="rule">
    <p class="instr">Deterministic retrieval. Four options <b>A</b>–<b>D</b> where present.
      Each question is worth the marks in the margin.</p>
    <hr class="rule">
    ${items.map((it, i) => itemHTML(it, i + 1, showKey)).join("")}
    <div class="draft">${esc(meta.hash ? "result_hash " + meta.hash : "")}</div>`;
}
window.AWMExam = { paperHTML, itemHTML, esc };
