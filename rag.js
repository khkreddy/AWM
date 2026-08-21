/* Deterministic retrieval. No embeddings. No provider calls.
   Chemistry join key: map node id == supplement node_id == question.node_ids[].
   Pool is always sorted by item_uid before any shuffle. Same query → same uids.
*/
(function (g) {
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function seededShuffle(arr, seed) {
    const a = arr.slice();
    const rand = mulberry32(seed >>> 0);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function fnv1a(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16).padStart(8, "0");
  }
  function retrieve(items, q) {
    const node = (q.node || "").trim();
    const board = (q.board || "").trim();
    const fmt = (q.format || "").trim();
    const fig = q.figure; // true | false | undefined
    let pool = items.filter((it) => {
      if (node && !(it.node_ids || []).includes(node)) return false;
      if (board && (it.qualification || it.board) !== board) return false;
      if (fmt && it.format !== fmt) return false;
      if (fig === true && !it.has_drawn_figure && !it.figure) return false;
      if (fig === false && (it.has_drawn_figure || it.figure)) return false;
      return true;
    });
    pool.sort((a, b) => String(a.item_uid).localeCompare(String(b.item_uid)));
    const sortedUids = pool.map((x) => x.item_uid);
    if (q.seed != null && q.seed !== "") {
      pool = seededShuffle(pool, Number(q.seed) >>> 0);
    }
    const limit = q.limit == null ? pool.length : Math.max(0, Number(q.limit));
    const taken = pool.slice(0, limit);
    const uids = taken.map((x) => x.item_uid);
    return {
      query: {
        node: node || null,
        board: board || null,
        format: fmt || null,
        figure: fig == null ? null : fig,
        limit: limit,
        seed: q.seed === "" || q.seed == null ? null : Number(q.seed) >>> 0,
        sort: q.seed == null || q.seed === "" ? "item_uid" : "item_uid then mulberry32",
      },
      n_pool: sortedUids.length,
      n: taken.length,
      uids,
      items: taken,
      result_hash: fnv1a(JSON.stringify({ q: {
        node: node || null, board: board || null, format: fmt || null,
        figure: fig == null ? null : fig, limit, seed: q.seed === "" || q.seed == null ? null : Number(q.seed) >>> 0,
      }, uids })),
    };
  }
  function sheaf(map, supplement, questions, nodeId) {
    const node = (map.nodes || []).find((n) => n.id === nodeId) || null;
    const statements = (map.statements || []).filter((s) => s.node === nodeId);
    const supp = (supplement.items || supplement || []).filter((s) => s.node_id === nodeId);
    const qs = (questions.items || questions).filter((q) => (q.node_ids || []).includes(nodeId));
    qs.sort((a, b) => String(a.item_uid).localeCompare(String(b.item_uid)));
    return {
      node,
      n_statements: statements.length,
      n_supplement: supp.length,
      n_questions: qs.length,
      statements,
      supplement: supp,
      questions: qs,
    };
  }
  g.AWMRag = { retrieve, sheaf, fnv1a, seededShuffle };
})(window);
