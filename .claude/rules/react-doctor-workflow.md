---
paths:
  - "packages/front/src/**/*.tsx"
  - "packages/ui/src/**/*.tsx"
---

# React Doctor Workflow

Gunakan skill `react-doctor` saat:

- selesai mengerjakan feature React,
- selesai memperbaiki bug React,
- sebelum menutup task yang mengubah file React,
- atau saat sedang cleanup kualitas code React.

## Default verification

- Untuk perubahan aktif, jalankan:

```bash
bunx react-doctor@latest --verbose --diff
```

- Jika score turun atau muncul regression yang relevan, perbaiki dulu sebelum
  menganggap task selesai.

## Saat cleanup lebih luas

- Jika task memang berupa audit atau cleanup React lintas area, jalankan scan
  penuh:

```bash
bunx react-doctor@latest --verbose
```

## Cara pakai rule ini

- Treat `react-doctor` sebagai quality gate ringan untuk area React yang
  disentuh task aktif.
- Tetap prioritaskan verifikasi paling sempit yang relevan; jangan jadikan scan
  penuh sebagai kewajiban untuk perubahan kecil.
- Jika hasil `react-doctor` bentrok dengan pola repo yang sengaja dipakai,
  ikuti pola repo lalu catat tradeoff-nya di ringkasan kerja.
