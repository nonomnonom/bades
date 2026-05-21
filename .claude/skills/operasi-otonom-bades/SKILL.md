---
name: operasi-otonom-bades
description: Use when setting up Bades autonomous workflows with /loop, reminders, scheduled tasks, or overnight Claude Code maintenance on the current branch.
---

# Operasi Otonom Bades

Gunakan skill ini saat ingin menyerahkan maintenance branch aktif ke Claude Code
secara semi-otonom.

## Pilih mekanisme

- Gunakan **`/loop`** jika sesi Claude Code tetap terbuka di mesin Anda.
- Gunakan **reminder satu kali** untuk check balik pada jam tertentu.
- Gunakan **scheduled task natural language** jika butuh polling ringan dalam
  sesi aktif.
- Gunakan **GitHub Actions / routine lain** jika butuh otomatisasi yang tetap
  jalan tanpa sesi terbuka.

## Default repo ini

- Bare `/loop` sudah memakai `.claude/loop.md`.
- Prompt default itu memprioritaskan task aktif, PR/CI aktif, dan audit terhadap
  `GOAL.md`.
- Default ini juga boleh melanjutkan clean up + refactor terarah satu area per
  iterasi ketika arah transformasi sudah jelas dari transcript dan `GOAL.md`.

## Prompt yang disarankan

### Jaga branch aktif

```text
/loop 15m cek branch dan PR aktif ini, perbaiki CI yang merah akibat perubahan
aktif, jawab komentar review baru, dan jaga agar diff tetap selaras dengan
GOAL.md. Jangan mulai inisiatif baru.
```

### Mode dinamis

```text
/loop cek CI, review comments, dan drift terhadap GOAL.md pada branch aktif ini.
Jika tenang, tunggu lebih lama. Jika ada failure atau komentar baru, tindak
lanjuti.
```

### Reminder sekali jalan

```text
ingatkan saya dalam 45 menit untuk mengecek apakah branch release ini sudah
hijau dan siap ditinjau
```

## Guardrail

- `/loop` bersifat session-scoped dan butuh sesi tetap hidup.
- Jangan gunakan `/loop` untuk memulai proyek baru di luar arah repo yang sudah
  diotorisasi.
- Batasi ke branch, PR, dan transformasi Bades yang sudah didukung transcript
  serta `GOAL.md`.
- Jika pekerjaan menyentuh area besar, pecah dulu dengan `orkestrasi-tim-bades`
  lalu gunakan `/loop` untuk maintenance lanjutan.
