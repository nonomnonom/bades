---
name: orkestrasi-tim-bades
description: Use when coordinating Bades work across Claude Code agent teams, subagents, parallel sessions, or GitHub/workflow cleanup so the work is split safely and stays aligned with GOAL.md.
---

# Orkestrasi Tim Bades

Gunakan skill ini saat ingin membagi kerja Bades ke beberapa agent Claude Code.

## Pilih mode yang tepat

- Gunakan **single session** jika perubahan kecil dan menyentuh sedikit file.
- Gunakan **subagent** jika ada side-task berat seperti audit diff, riset, atau
  verifikasi yang tidak perlu memenuhi konteks utama.
- Gunakan **agent team** jika task bisa dipecah ke area file yang independen
  dan beberapa agent perlu bekerja paralel.
- Gunakan **`/loop`** untuk maintenance branch aktif, polling CI/review, atau
  follow-up otonom dalam sesi yang tetap terbuka.

## Template peran tim

### Cleanup branding / GitHub

- `operator-github-bades`
- `pelaksana-front-bades`
- `penjaga-goal-bades`
- `verifikator-bades`

### Feature lintas front + server

- `pelaksana-front-bades`
- `pelaksana-server-bades`
- `lokalisasi-bades`
- `verifikator-bades`

### Audit dan perapian bahasa

- `lokalisasi-bades`
- `penjaga-goal-bades`
- `verifikator-bades`

## Aturan pecah kerja

- Hindari dua teammate mengedit file yang sama.
- Pecah task menjadi deliverable jelas dengan deskripsi singkat dan area file.
- Untuk kerja besar, targetkan 5-6 task per teammate agar lead bisa reassign.
- Minta lead **menunggu teammate selesai** sebelum mengambil alih pekerjaan
  mereka.

## Prompt awal yang disarankan

```text
Buat agent team Bades untuk task ini. Gunakan teammate:
- operator-github-bades untuk .github dan metadata repo
- pelaksana-front-bades untuk surface UI/copy user-facing
- penjaga-goal-bades untuk audit drift terhadap GOAL.md
- verifikator-bades untuk check akhir

Pecah kerja menjadi task independen per area file. Jangan biarkan dua teammate
mengedit file yang sama. Tunggu teammate menyelesaikan task mereka sebelum lead
mengerjakan hal yang sama.
```

## Guardrail

- Semua hasil harus tetap Bades-first.
- Jangan gunakan agent team untuk task berurutan yang sebenarnya cukup dikerjakan
  satu sesi.
- Jika task menyentuh branding, workflow GitHub, docs, seed, atau copy, selalu
  sertakan `penjaga-goal-bades` atau `verifikator-bades`.
