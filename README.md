# Assessment World Model

**Live:** https://khkreddy.github.io/AWM/

Packed `2026-08-22T10:03:59Z`. Public, static, zero model calls at page load.

This page is a **sheaf plus a retrieval engine**. A sheaf here means one id grammar
and joins by equality: map node id = supplement node id = question `node_ids[]`.
Retrieval is set algebra over those keys, then a stable sort. The same query JSON
yields the same paper twice.

## What is up

| subject | items | map-bound | map | supplement | figures encoded | status |
|---|---:|---:|---:|---:|---:|---|
| chemistry | 803 | 782 | V15 · 21 nodes · 1190 statements | 1640 | 351 | ready |
| physics | 1091 | 0 | — | — | 0 | cms_stems_only |
| biology | 1517 | 0 | — | — | 0 | cms_stems_only |
| mathematics | 0 | 0 | — | — | 0 | not in CMS Grade A/B yet |

Chemistry is the only subject with a curriculum map. Assemble a paper from a **node**
(for example `C7/H-ACIDBASE`): the page returns the node, the syllabus statements on
it, the supplement items on it, and the questions bound to it — then typesets those
questions as an exam paper.

Physics and biology are CMS Grade A+B stems and options only. They have no map, so
retrieval is board / year / format. That gap is intentional and visible.

## Pages

| | |
|---|---|
| [Home](index.html) | counts and the retrieval claim |
| [Assemble](assemble.html) | chemistry map RAG / test maker / quiz |
| [Exam paper](exam.html) | candidate view from stored JSON |

## What is withheld

Misconception prose, mastery-facet prose, examiner comments, source-paper crops,
credentials, absolute home-directory paths, SUPERChem.

Answers sit in the JSON so the paper view can show a key. They are not printed on
the candidate paper until **Show key**.

## Update cadence

Every 6 hours the working tree packs this public set, lints it, and pushes if it
changed. This README is rewritten on each pack.

## Repository layout

```
chemistry/map.json questions.json supplement.json nodes.json figures/
physics/questions.json
biology/questions.json
math/questions.json
```
