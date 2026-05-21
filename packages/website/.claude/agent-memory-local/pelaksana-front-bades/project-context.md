---
name: project-context
description: Konteks rebrand website Bades — scope file, terminologi SID, pola perubahan yang sudah dijalankan pada rebrand-bades branch
metadata:
  type: project
---

Rebrand website public Bades dari terminologi CRM/Twenty ke Sistem Informasi Desa (SID) Indonesia, dikerjakan di branch `rebrand-bades`.

**Why:** GOAL.md mewajibkan eliminasi penuh brand Twenty dan terminologi CRM dari surface user-facing. Website public adalah prioritas tertinggi karena dampak publik langsung.

**How to apply:** Saat mengerjakan file website, selalu cek TERMINOLOGY.md di root untuk mapping CRM→SID. File yang sudah dibersihkan pada sesi ini:
- `(home)/app-preview.data.ts` — data seluruhnya diganti ke konteks desa Indonesia
- `(home)/page.tsx` — copy bahasa Indonesia penuh, CTA Indonesia
- `(home)/three-cards-illustration.data.ts` — case study diganti ke konteks desa
- `(home)/helped.data.ts` — card copy diganti ke konteks desa
- `product/feature.data.ts` — semua copy fitur ke Bahasa Indonesia native
- `product/ai-hero-tabs.data.ts` — contoh AI prompt ke konteks desa
- `product/page.tsx` — copy Indonesia penuh
- `why-bades/page.tsx` — teks editorial dan CTA Indonesia penuh

Pola utama yang diterapkan: pipeline→alur permohonan layanan, companies→penduduk, people→warga, opportunities→permohonan, deal→layanan, "Get started"→"Mulai sekarang", "Talk to us"→"Hubungi kami", "trusted by"→"dipercaya oleh", +10k others→+10rb desa lainnya.
