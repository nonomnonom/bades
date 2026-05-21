# Anti Brand Leak

Gunakan rule ini saat menyentuh branding, copy, docs, metadata, seed, email,
atau contoh data.

## Larangan Utama

- Jangan memperkenalkan istilah `Twenty` pada surface baru yang terlihat user.
- Jangan pakai istilah CRM generik seperti `company`, `people`, `deal`,
  `opportunity`, `pipeline`, atau `workspace` pada copy Bades jika ada padanan
  yang lebih tepat untuk konteks desa.
- Jangan menulis docs, changelog, screenshot caption, judul email, atau empty
  state yang membuat Bades terasa sebagai rename tipis dari Twenty.

## Surface Yang Harus Bersih

- Judul halaman, menu, label, tombol, placeholder, toast, modal, dan helper
  text.
- Seed data, story, fixture, demo workspace, dan screenshot docs.
- Template email, website copy, metadata SEO, manifest, favicon, dan social
  preview.

## Pengecualian Teknis

- Identifier internal legacy masih boleh sementara jika perubahan berisiko.
- Kalau identifier legacy belum bisa dihapus, isolasikan di layer teknis dan
  jangan biarkan bocor ke pengalaman user.
