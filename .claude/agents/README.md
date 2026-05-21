# Bades Agent Playbook

Folder ini berisi role subagent yang bisa dipakai langsung sebagai:

- subagent biasa dalam satu sesi, atau
- teammate role saat membuat **agent team** Claude Code.

## Role yang tersedia

- `penjaga-goal-bades` - audit drift terhadap `GOAL.md`
- `pelaksana-front-bades` - implementasi UI, website, email, copy
- `pelaksana-server-bades` - backend, seed, metadata, boundary legacy
- `operator-github-bades` - `.github`, repo metadata, release, workflow
- `lokalisasi-bades` - perapian istilah dan Bahasa Indonesia native
- `verifikator-bades` - check akhir berbasis diff dan command

## Prompt tim yang disarankan

### Cleanup branding / GitHub

```text
Buat agent team Bades untuk membereskan metadata repo dan workflow GitHub.
Gunakan teammate:
- operator-github-bades
- penjaga-goal-bades
- verifikator-bades

Pecah task menjadi unit independen per file atau per area config. Jangan
biarkan dua teammate mengedit file yang sama. Tunggu teammate selesai sebelum
lead mengerjakan area yang sama.
```

### Feature lintas frontend + backend

```text
Buat agent team Bades untuk task ini dengan teammate:
- pelaksana-front-bades
- pelaksana-server-bades
- lokalisasi-bades
- verifikator-bades

Pecah task menjadi pekerjaan frontend, backend, copy/lokalisasi, lalu verifikasi.
Pastikan tidak ada file conflict antarteammate.
```

## Aturan praktis

- Mulai dengan 3-5 teammate.
- Gunakan `penjaga-goal-bades` atau `verifikator-bades` pada task yang menyentuh
  branding, docs, website, seed, email, atau workflow GitHub.
- Untuk maintenance branch aktif saat Anda tidak memantau terus, gunakan
  bare `/loop` atau skill `operasi-otonom-bades`.
